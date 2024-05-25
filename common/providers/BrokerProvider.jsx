import sha256 from 'crypto-js/sha256'
import { matches } from 'mqtt-pattern'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { brokerToolsUrl } from '../libs/constants'
import { randomAlphaNumeric } from '../libs/random'
import { useAuthenticationService } from '../services/endpoints/authentications'
import { useAuthenticatedUser } from './AuthenticatedUserProvider'

const BrokerContext = createContext()

/**
 * Subscribe to a topic from the broker
 * @callback SubscribeFn
 * @param {string} topic Topic to subscribe
 * @param {(options:{topic: string, message: string}) => void} callback Callback when receive a message on the specified topic
 * @param {{qos:number, checkSignature:boolean}} options
 * @returns {void}
 */

/**
 * Unsubscribe from a topic from the broker
 * @callback UnsubscribeFn
 * @param {string} topic Topic to unsubscribe
 * @returns {void}
 */

/**
 * Publish a message to a topic to the broker
 * @callback PublishFn
 * @param {string} topic
 * @param {object} payload
 * @param {{qos?:number}} options
 * @returns {void}
 */

export const ConnectionStatus = {
  Connecting: 'connecting',
  Connected: 'connected',
  Reconnecting: 'reconnecting',
  Error: 'error',
  Disconnected: 'disconnected',
}

/** @returns {{subscribe: SubscribeFn, unsubscribe:UnsubscribeFn, publish:PublishFn, connectionStatus:keyof ConnectionStatus}} */
export const useBrokerContext = () => useContext(BrokerContext)

export const signatureHeaderField = 'signature'
export const nonceHeaderField = 'nonce'

/**
 * @param {string} topic Topic
 * @param {string} payload
 * @param {number} nonce Nonce to have unique signature
 * @returns {string} Signature
 */
function signatureFrom(topic, message, nonce) {
  const payload = JSON.parse(message)
  // DEPRECATED remove nonce from payload, use userProperties in network-tools and gateway-agent
  return (payload?.nonce ? sha256(topic + message) : sha256(`${topic}${nonce}${message}`)).toString()
}

export default function BrokerProvider({ enabled, children }) {
  const authenticationService = useAuthenticationService()
  const [brokerToken, setBrokerToken] = useState()
  const authenticatedUser = useAuthenticatedUser()
  /** @type {{current: import('mqtt').MqttClient}} */
  const client = useRef()
  const handlers = useRef([])
  const [connectionStatus, setConnectionStatus] = useState(ConnectionStatus.Disconnected)
  const randomId = randomAlphaNumeric(8)

  // Get token for the broker
  useEffect(() => {
    if (enabled && authenticatedUser?.isLoggedIn && authenticatedUser?.companyId) {
      authenticationService
        .createBrokerToken()
        .then((data) => {
          setBrokerToken(data.access_token)
          console.log(`[BrokerProvider] got a new broker token`)
        })
        .catch((err) => console.error('When get a broker token:', err))
    }

    return () => {}
  }, [authenticatedUser, enabled])

  // Connect & setup broker
  useEffect(() => {
    if (!client.current && brokerToken) {
      // This synchronously ensures we won't enter this block again
      // before the client is asynchronously set
      client.current = true
      setConnectionStatus(ConnectionStatus.Connecting)

      const clientId = `${authenticatedUser.authClientId}-${authenticatedUser.companyId}-${randomId}`
      console.log('[BrokerProvider] connecting with', clientId)
      import('mqtt').then(({ default: mqtt }) => {
        // Dynamic import to avoid to load if not required
        client.current = mqtt.connect(brokerToolsUrl, {
          protocolVersion: 5,
          clientId: clientId,
          username: authenticatedUser.username, // Need a username to use password
          password: brokerToken,
          protocolId: 'MQTT',
          clean: false,
          keepalive: 30,
          reconnectPeriod: 1000,
          connectTimeout: 30 * 1000,
        })

        client.current.on('connect', () => {
          setConnectionStatus(ConnectionStatus.Connected)
          console.log(`[BrokerProvider] Connected, handlers: ${handlers.current.length}`)
          handlers.current.forEach(({ topic }) => {
            client.current.subscribe(topic)
          })
        })

        client.current.on('disconnect', () => {
          setConnectionStatus(ConnectionStatus.Disconnected)
          console.log(`[BrokerProvider] Disconnected`)
        })

        client.current.on('reconnect', () => {
          setConnectionStatus(ConnectionStatus.Reconnecting)
          console.log(`[BrokerProvider] Reconnect`)
        })

        client.current.on('close', () => {
          console.log(`[BrokerProvider] Closed`)
        })

        client.current.on('error', (error) => {
          setConnectionStatus(ConnectionStatus.Error)
          console.error(error?.response?.data?.error?.message ? error.response.data.error.message : error.message)
          if (client.current) client.current.end()
        })

        client.current.on('message', (topic, message, packet) => {
          console.log('[BrokerProvider] Message on topic', topic, 'message', message.length, 'handlers', handlers.current.length)

          handlers.current.forEach((handler) => {
            if (matches(handler.topic, topic)) {
              if (handler?.options?.checkSignature) {
                const payload = JSON.parse(message)
                // payload?.nonce is DEPRECATED
                const nonce = payload?.nonce ? payload.nonce : packet.properties.userProperties[nonceHeaderField]
                if (!nonce) {
                  console.log(`[BrokerProvider] Received an expired message on topic ${topic}:`, message.toString())
                  return // Ignore message
                }

                // Verify message integrity with the signature
                const signature = packet.properties.userProperties[signatureHeaderField]
                const expectedSignature = signatureFrom(topic, message.toString(), nonce)
                if (expectedSignature !== signature) {
                  console.log(`[BrokerProvider] Received message on topic ${topic} with a bad signature:`)
                  console.log(`[BrokerProvider] expected [${typeof expectedSignature}:${expectedSignature}]`)
                  console.log(`[BrokerProvider] received [${typeof signature}:${signature}]`)
                  return // Ignore message
                }
              }

              handler?.callback({
                topic,
                message: message.toString(),
              })
            }
          })
        })
      })
    }

    return () => {
      console.log('[BrokerProvider] Cleaned')
      if (client.current?.end) client.current.end()
      client.current = undefined
    }
  }, [brokerToken])

  /** @type {SubscribeFn} */
  const subscribe = (topic, callback, options = { qos: 0, checkSignature: false }) => {
    const handler = { topic, callback, options }
    console.log('[BrokerProvider] subscribe', handler?.topic)
    handlers.current.push(handler)
    if (client.current?.subscribe) {
      // TODO manage multiple same topic ?
      client.current.subscribe({ [topic]: options })
    }
  }

  /** @type {UnsubscribeFn} */
  const unsubscribe = (topic) => {
    console.log('[BrokerProvider] unsubscribe', topic)
    const index = handlers.current.findIndex((el) => el.topic === topic)
    if (index >= 0) handlers.current.splice(index, 1)
    if (client.current?.unsubscribe) {
      // TODO manage multiple same topic ?
      client.current.unsubscribe(topic)
    }
  }

  /** @type {PublishFn} */
  const publish = (topic, payload, options = { qos: 0 }) => {
    if (connectionStatus !== ConnectionStatus.Connected) {
      return false // TODO throw an error ?
    }
    // DEPRECATED remove nonce from payload, use userProperties in network-tools and gateway-agent
    const nonce = payload.nonce ? payload.nonce : new Date().getTime()
    const payloadString = JSON.stringify(payload)
    client.current.publish(
      topic,
      payloadString,
      {
        qos: options?.qos,
        properties: {
          userProperties: {
            [signatureHeaderField]: signatureFrom(topic, payloadString, nonce),
            [nonceHeaderField]: nonce,
          },
        },
      },
      (error) => {
        if (error) {
          console.log(`[BrokerProvider] Error on publish payload: ${error}`)
        }
      }
    )
  }

  return enabled ?
      <BrokerContext.Provider
        value={{
          connectionStatus,
          subscribe,
          unsubscribe,
          publish,
        }}
      >
        {children}
      </BrokerContext.Provider>
    : children
}
