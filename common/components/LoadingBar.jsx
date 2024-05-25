export default function LoadingBar({ enabled, className }) {
  return (
    <div className='w-full'>
      <div
        className={`overflow-hidden ${enabled ? 'origin-[0%_50%] animate-indeterminate' : 'opacity-0'} flex ${className}`}
      ></div>
    </div>
  )
}
