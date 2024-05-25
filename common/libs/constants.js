export const environmentEnum = {
  production: 'production',
  productionBeta: 'production-beta',
  development: 'development',
}

export const serviceEnum = {
  admin: 'admin',
  cnc: 'cnc',
  edge: 'edge',
  webapp: 'webapp',
}

export { roleEnum } from './authorization'

export const crudEnum = {
  create: 'create',
  read: 'read',
  update: 'update',
  delete: 'delete',
}

// Mqtt actions
export const actionEnum = {
  create: 'create',
  remove: 'remove',
}

export function crudText(action) {
  return {
    [crudEnum.create]: {
      processing: 'creating',
      processed: 'created',
    },
    [crudEnum.read]: {
      processing: 'reading',
      processed: 'read',
    },
    [crudEnum.update]: {
      processing: 'updating',
      processed: 'updated',
    },
    [crudEnum.delete]: {
      processing: 'deleting',
      processed: 'deleted',
    },
  }[action]
}

export const globalRealm = 'webapp'
export const baseUrlRealm = 'https://sso.gatherwise.com/realms'
export const baseUrlGlobalRealm = `${baseUrlRealm}/${globalRealm}`
export const brokerToolsUrl = 'wss://broker.mqtt.tools.gatherwise.com/'

export const SubscriptionEnum = {
  None: '',
  Free: 'free',
  EdgePlatform: 'edge-platform',
  Standard: 'standard',
}

export const EXPIRED_SUBSCRIPTION_ERROR_CODE = 'EXPIRED_SUBSCRIPTION'
