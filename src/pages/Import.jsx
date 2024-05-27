import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useImportService } from '../services/endpoints/importations'

export default function Import() {
  const { register, handleSubmit } = useForm()
  const [isLoading, setLoading] = useState(false)
  const [reload, setReload] = useState(false)
  const [importations, setImportations] = useState([])
  const importService = useImportService()

  const trigReload = () => setReload(!reload)

  const onSubmit = async (data) => {
    setLoading(true)
    const formData = new FormData()
    formData.append('file', data.file[0])

    importService
      .uploadFile(formData)
      .catch((error) => {
        alert(JSON.stringify(error))
      })
      .finally(() => {
        setLoading(false)
        trigReload()
      })
  }

  useEffect(() => {
    importService.readAll().then(setImportations)
  }, [reload])

  return (
    <div className=''>
      {isLoading && <div>Loading...</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type='file' {...register('file')} />
        <input type='submit' />
      </form>
      <div>
        <ul>
          {Array.isArray(importations) &&
            importations.map((importation, idx) => {
              return (
                <li key={idx} className={'flex'}>
                  <label className={'font-bold'}>
                    {importation.name}
                    <span className='font-normal italic m-3'>
                      {importation?.convertedAt ? importation.convertedAt : 'not converted'}
                    </span>
                  </label>
                  <button
                    onClick={() => {
                      setLoading(true)
                      importService
                        .convertToTransactions(importation._id)
                        .catch((error) => alert(JSON.stringify(error)))
                        .finally(() => {
                          setLoading(false)
                          trigReload()
                        })
                    }}
                  >
                    Convert
                  </button>
                </li>
              )
            })}
        </ul>
      </div>
    </div>
  )
}
