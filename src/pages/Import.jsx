import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import FileUpload from '../components/FileUpload'

export default function Import() {
  const {
    handleSubmit,
    register,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    let mounted = true

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className=''>
      <FileUpload name='avatar' acceptedFileTypes='*/*' isRequired={true} placeholder='Transactions' control={control}>
        New avatar
      </FileUpload>
    </div>
  )
}
