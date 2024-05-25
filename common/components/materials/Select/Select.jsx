import React from 'react'
import ReactSelect from 'react-select'

import Option from './Option'
import { classNames } from '../../../libs/style'

const controlStyles = {
  base: 'border rounded-lg bg-white hover:cursor-pointer',
  focus: 'border-gray-600 ring-1 ring-gray-500',
  nonFocus: 'border-gray-300 hover:border-gray-400',
}
const placeholderStyles = 'text-gray-500 pl-1 py-0.5'
const selectInputStyles = 'pl-1 py-0.5'
const valueContainerStyles = 'p-1 gap-1'
const singleValueStyles = 'leading-7 ml-1'
const multiValueStyles = 'bg-gray-100 rounded items-center py-0.5 pl-2 pr-1 gap-1.5'
const multiValueLabelStyles = 'leading-6 py-0.5'
const multiValueRemoveStyles =
  'border border-gray-200 bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 hover:border-red-300 rounded-md'
const indicatorsContainerStyles = 'p-1 gap-1'
const clearIndicatorStyles = 'text-gray-500 p-1 rounded-md hover:bg-red-50 hover:text-red-800'
const indicatorSeparatorStyles = 'bg-gray-300'
const dropdownIndicatorStyles = 'p-1 hover:bg-gray-100 text-gray-500 rounded-md hover:text-black'
const menuStyles = 'p-1 mt-2 border border-gray-200 bg-white rounded-lg'
const groupHeadingStyles = 'ml-3 mt-2 mb-1 text-gray-500 text-sm'
const optionStyles = {
  base: 'hover:cursor-pointer px-3 py-2 rounded',
  focus: 'bg-gray-100 active:bg-gray-200',
  selected: '',
}
const noOptionsMessageStyles = 'text-gray-500 p-2 bg-gray-50 border border-dashed border-gray-200 rounded-sm'

// options: [ { key: '<uid>', name: '<name>' }]
export default function Select({ className, onAfterChange, isClearable, placeholder, options, selected, setSelected }) {
  return (
    <div className={className}>
      <ReactSelect
        isMulti
        menuPortalTarget={document.body} // ensures it is stacked on top
        unstyled
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 999 }),
          input: (base) => ({
            ...base,
            'input:focus': {
              boxShadow: 'none',
            },
          }),
          // On mobile, the label will truncate automatically, so we want to
          // override that behavior.
          multiValueLabel: (base) => ({
            ...base,
            whiteSpace: 'normal',
            overflow: 'visible',
          }),
          control: (base) => ({
            ...base,
            transition: 'none',
          }),
        }}
        classNames={{
          control: ({ isFocused }) => classNames(isFocused ? controlStyles.focus : controlStyles.nonFocus, controlStyles.base),
          placeholder: () => placeholderStyles,
          input: () => selectInputStyles,
          valueContainer: () => valueContainerStyles,
          singleValue: () => singleValueStyles,
          multiValue: () => multiValueStyles,
          multiValueLabel: () => multiValueLabelStyles,
          multiValueRemove: () => multiValueRemoveStyles,
          indicatorsContainer: () => indicatorsContainerStyles,
          clearIndicator: () => clearIndicatorStyles,
          indicatorSeparator: () => indicatorSeparatorStyles,
          dropdownIndicator: () => dropdownIndicatorStyles,
          menu: () => menuStyles,
          groupHeading: () => groupHeadingStyles,
          option: ({ isFocused, isSelected }) =>
            classNames(isFocused && optionStyles.focus, isSelected && optionStyles.selected, optionStyles.base),
          noOptionsMessage: () => noOptionsMessageStyles,
        }}
        isClearable={isClearable}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        placeholder={placeholder}
        options={options}
        value={selected}
        components={{ Option }}
        getOptionLabel={({ name }) => name}
        getOptionValue={({ key }) => key}
        onChange={(selectValues, { action, ...actionType }) => {
          const selectedOptionKey = actionType.option?.key
          if (action === 'select-option') {
            // use Array.prototype.filter to maintain order
            // NOTE filtering `options` also remove
            // any selected options that no longer exist
            setSelected((previous) =>
              options.filter(
                ({ key: optionKey }) =>
                  previous.find(({ key: selectedKey }) => selectedKey === optionKey) || selectedOptionKey === optionKey
              )
            )
          } else if (['deselect-option', 'remove-value', 'pop-value'].includes(action)) {
            const deselectedOptionKey = selectedOptionKey ?? actionType.removedValue?.key
            setSelected((previous) =>
              options.filter(
                ({ key: optionKey }) =>
                  previous.find(({ key: selectedKey }) => selectedKey === optionKey) && deselectedOptionKey !== optionKey
              )
            )
          } else if (action === 'clear') {
            if (isClearable) {
              setSelected([])
            } else {
              // NOTE disallow if bulk delete not yet implemented'
              console.error('Unexpected react-select clear event')
            }
          } else {
            console.error('Unexpected react-select actionType value', actionType)
          }

          onAfterChange?.(selectValues, actionType)
        }}
      />
    </div>
  )
}
