import { vi } from 'vitest'

const context = { client: undefined, onHandlers: {} }

export default {
  /** @type {(brokerUrl: string, opts?: import('mqtt').IClientOptions)} */
  connect: vi.fn().mockImplementation((brokerUrl, opts) => {
    const TestMqttClient = vi.fn()
    context.client = new TestMqttClient(brokerUrl, opts)

    TestMqttClient.prototype.on = vi.fn().mockImplementation((event, callback) => {
      context.onHandlers[event] = callback
      if (event === 'connect') callback() // Send connect event directly
      return context.client
    })
    TestMqttClient.prototype.publish = vi.fn().mockImplementation(() => {
      return context.client
    })
    TestMqttClient.prototype.subscribe = vi.fn().mockImplementation(() => {
      return context.client
    })
    TestMqttClient.prototype.unsubscribe = vi.fn().mockImplementation(() => {
      return context.client
    })
    TestMqttClient.prototype.end = vi.fn().mockImplementation(() => {
      return context.client
    })

    return context.client
  }),
}

export function getTestMqttClientInstance() {
  return context.client
}
