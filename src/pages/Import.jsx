import { useForm } from 'react-hook-form'
import { useImportService } from '../services/endpoints/importations'

export default function Import() {
  const { register, handleSubmit } = useForm()
  const importService = useImportService()

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append('file', data.file[0])

    const res = await importService.uploadFile(formData)

    alert(JSON.stringify(`${res.message}, status: ${res.status}`))
  }

  return (
    <div className=''>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type='file' {...register('file')} />

        <input type='submit' />
      </form>
    </div>
  )
}
