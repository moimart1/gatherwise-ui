import ListMultiSelect from '@gatherwise/common-frontend-libs/components/ListMultiSelect'
import { Action, Subject } from '@gatherwise/common-frontend-libs/libs/authorization'
import { subject } from '@gatherwise/common-frontend-libs/libs/authorization/casl-ability'
import { SubscriptionEnum } from '@gatherwise/common-frontend-libs/libs/constants'
import { useLocalize } from '@gatherwise/common-frontend-libs/libs/localization'
import { useAuthenticatedUser } from '@gatherwise/common-frontend-libs/providers/AuthenticatedUserProvider'
import { useState } from 'react'

export default function SubscriptionsSelect({ selected, onChange, company, disabled }) {
  const localize = useLocalize()
  const authenticatedUser = useAuthenticatedUser()
  const [subscriptions, setSubscriptions] = useState(
    Object.values(SubscriptionEnum)
      .filter((item) => item)
      .map((subscriptionKey) => ({
        name: localize(subscriptionKey),
        key: subscriptionKey,
        selected: selected === subscriptionKey,
        disabled: authenticatedUser?.cannot(
          Action.UpdateValues,
          subject(Subject.Company, {
            ...company,
            subscription: subscriptionKey,
          }),
          'subscription'
        ),
      }))
  )

  return (
    <ListMultiSelect
      items={subscriptions}
      multiple={false}
      disabled={disabled}
      onSelect={(item) => {
        setSubscriptions((previous) => [...previous.map((s) => ({ ...s, selected: s.key === item.key }))])
        onChange(item.key)
      }}
    />
  )
}
