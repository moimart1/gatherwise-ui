import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { Subject } from '../../libs/authorization'

export function defineTestAbility() {
  const { can, build } = new AbilityBuilder(createMongoAbility)

  can('all', 'all') // Everything is allowed
  can('create', Subject.User)
  return build()
}
