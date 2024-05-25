import { SubscriptionEnum, serviceEnum } from './constants'
import { companyPath, getServiceOrigin } from './urls'

export function servicesInformationFromCompany(company) {
  const information = []
  if (company?._id) {
    information.push({
      name: 'Admin',
      url: `${getServiceOrigin(serviceEnum.admin)}${companyPath(company._id)}`,
      icon: 'fa-solid fa-user-gear',
    })
  }

  if ([SubscriptionEnum.Free, SubscriptionEnum.EdgePlatform, SubscriptionEnum.Standard].includes(company?.subscription)) {
    information.push({
      name: 'Edge',
      url: `${getServiceOrigin(serviceEnum.edge)}${companyPath(company._id)}`,
      icon: 'fa-solid fa-router',
    })
  }

  if ([SubscriptionEnum.Free, SubscriptionEnum.Standard].includes(company?.subscription)) {
    // Little hack to go to CNC service
    const url =
      window.location.origin === getServiceOrigin(serviceEnum.cnc) ?
        `${getServiceOrigin(serviceEnum.cnc)}${companyPath(company._id)}`
      : `${getServiceOrigin(serviceEnum.webapp)}${companyPath(company._id)}`

    information.push({
      name: 'App',
      url,
      icon: 'fa-solid fa-chart-bar',
    })
  }

  return information
}
