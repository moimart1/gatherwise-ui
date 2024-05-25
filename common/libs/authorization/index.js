export const roleEnum = {
  CompanyOperator: 'company-operator',
  User: 'user',
  EdgeAdmin: 'edge-admin',
  CompanyAdmin: 'company-admin',
  PartnerAdmin: 'partner-admin',
  SuperAdmin: 'app-admin',
}

export const Action = {
  // General action
  Manage: 'manage',
  Create: 'create',
  Read: 'read',
  ReadAllFromCompany: 'read-all-from-company',
  ReadAll: 'read-all', // No company specified
  Update: 'update',
  UpdateValues: 'update-values', // condition on values
  UpgradeInfrastructure: 'upgrade-infrastructure',
  Delete: 'delete',
  // Used in Companies
  ReadFromParent: 'read-from-parent',
  // Used in Users
  ResetPassword: 'reset-password',
  DeleteFromCompany: 'delete-from-company',
  // Used in Gateways
  CreateGatewayInstallation: 'create-gateway-installation', // Iso link installer and docker command
  // Used in Machines
  Release: 'release',
  ReadVersion: 'read-version',
}

export const Subject = {
  // Admin
  Company: 'Company',
  User: 'User',
  UserLink: 'UserLink', // Represent one user in one company
  // Edge
  Gateway: 'Gateway',
  // Admin + Edge
  Machine: 'Workstation', // TODO update when done in backend
}
