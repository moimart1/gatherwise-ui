import PropTypes from 'prop-types'

export const propTypesOpen = PropTypes.bool.isRequired
export const propTypesIcon = PropTypes.node
export const propTypesDisabled = PropTypes.bool
export const propTypesClassName = PropTypes.string
export const propTypesValue = PropTypes.instanceOf(Object).isRequired
export const propTypesChildren = PropTypes.node.isRequired
export const propTypesAnimate = PropTypes.shape({
  mount: PropTypes.instanceOf(Object),
  unmount: PropTypes.instanceOf(Object),
})
