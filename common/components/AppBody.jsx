import DynamicHeader from './DynamicHeader'

export default function AppBody({ children }) {
  return (
    <div className=''>
      <DynamicHeader className={'sticky top-0 z-20 border-b border-midnight-100 bg-white'} />
      <main className='relative m-auto max-w-7xl px-1 py-4 sm:px-2 md:px-4 md:py-6'>{children}</main>
    </div>
  )
}
