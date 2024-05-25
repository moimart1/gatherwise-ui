import { AbilityBuilder, createMongoAbility, subject } from '@casl/ability'
import { unpackRules } from '@casl/ability/extra'
import { getAuthorizationService } from '../../services/endpoints/authorizations'

export { AbilityBuilder, createMongoAbility, subject }

export async function getCurrentAbility() {
  const authorizationService = getAuthorizationService()
  const ability = new AbilityBuilder(createMongoAbility).build({
    detectSubjectType: (subject) => {
      // When use subject(...)
      if (subject?.__caslSubjectType__) return subject.__caslSubjectType__
      return subject
    },
  })

  try {
    const [rules, allowedRoles] = await Promise.all([authorizationService.getRules(), authorizationService.getAllowedRoles()])

    ability.update(unpackRules(rules))
    return { allowedRoles, ability }
  } catch (err) {
    console.error('[getCurrentAbility] Unable to get ability', err)
  }

  return { allowedRoles: [], ability }
}
