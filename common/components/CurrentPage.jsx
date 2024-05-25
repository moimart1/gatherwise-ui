import { RouterProvider } from 'react-router-dom'
import Loading from '../pages/Loading'

export default function CurrentPage({ router }) {
  return <RouterProvider router={router} fallbackElement={<Loading />} />
}
