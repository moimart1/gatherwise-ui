export const MachineStateEnum = {
  Connected: 'connected',
  Pending: 'pending',
  Error: 'error',
  Disconnected: 'disconnected',
  Suggested: 'suggested',
}

export const machineBrokerTopic = ({ companyId, machineId }) => `c/${companyId}/w/${machineId}`
