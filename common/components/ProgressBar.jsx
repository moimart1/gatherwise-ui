import { shortHumanizeDuration } from '../libs/humanize-duration'

export const UnitEnum = {
  Percent: '%',
  Quantity: 'quantity',
  HumanMs: 'human-milliseconds',
}

export function ProgressBar({
  className,
  onClick,
  total = 100,
  value = 0,
  unit = UnitEnum.Percent,
  color = '#9CA3AF',
  labelTitle,
}) {
  const percent = Math.max(Math.round((value * 100) / total), 0)
  let label = `${percent}%`
  if (unit === UnitEnum.Quantity) {
    label = `${value}/${total}`
  } else if (unit === UnitEnum.HumanMs) {
    label = `${value === 0 ? value : shortHumanizeDuration(value)}/${shortHumanizeDuration(total)}`
  }

  return (
    <div className={className} onClick={onClick}>
      <div className={`m-auto flex h-full flex-row items-center space-x-2 px-2 ${onClick ? 'cursor-pointer' : ''}`}>
        <div className='h-full w-full rounded-full bg-gray-200'>
          <div className='h-full rounded-full' style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: color }}></div>
        </div>
        <div className='whitespace-nowrap text-sm'>
          <span title={labelTitle}>{label}</span>
        </div>
      </div>
    </div>
  )
}
