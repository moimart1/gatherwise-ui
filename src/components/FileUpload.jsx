import { FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef } from 'react'
import { useController } from 'react-hook-form'

export const FileUpload = ({ name, placeholder, acceptedFileTypes, control, children, isRequired = false }) => {
  const inputRef = useRef()
  const {
    field: { onChange, value, ...inputProps },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: isRequired },
  })

  return (
    <FormControl isInvalid={error} isRequired>
      <FormLabel htmlFor='writeUpFile'>{children}</FormLabel>
      <InputGroup>
        <InputLeftElement pointerEvents='none'>
          <FontAwesomeIcon icon={faFile} />
        </InputLeftElement>
        <input
          type='file'
          onChange={(e) => onChange(e.target.files[0])}
          accept={acceptedFileTypes}
          name={name}
          ref={(e) => {
            console.log('ref', e)
            inputRef.current = e
          }}
          {...inputProps}
          style={{ display: 'none' }}
        />
        <Input
          placeholder={placeholder || 'Your file ...'}
          onClick={() => {
            console.log(inputRef.current)
            inputRef.current.click()
          }}
          // onChange={(e) => {}}
          readOnly={true}
          value={(value && value.name) || ''}
        />
      </InputGroup>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  )
}

FileUpload.defaultProps = {
  acceptedFileTypes: '',
  allowMultipleFiles: false,
}

export default FileUpload
