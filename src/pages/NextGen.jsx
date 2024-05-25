import PrimaryButton from '@gatherwise/common-frontend-libs/components/materials/Button/PrimaryButton'
import React from 'react'
import Checkmark from '../components/Checkmark'

const shopFloorImage = '/home-scene.png' // NOTE static img in public folder

export function Component() {
  return (
    <div className='w-full space-y-3 p-12 text-center'>
      <p style={{ fontSize: '1.75rem' }} className='text-gray-300'>
        NEXT-GEN coming soon…
      </p>
      <p style={{ fontSize: '1.75rem' }} className='text-xl font-bold leading-normal text-gray-500'>
        Thank you for your interest in our public beta
      </p>
      <div className='flex flex-wrap justify-center space-x-8'>
        {['Free CNC machine monitoring', 'Connect machines using our API', 'Guide CNC machine operators'].map((item, i) => (
          <p key={i} className='flex items-baseline'>
            <Checkmark />
            <span className='ml-1 text-sm'>{item}</span>
          </p>
        ))}
      </div>

      <div className='p-8'>
        <PrimaryButton {...{ onClick: () => {} }}>
          <a href='https://www.gatherwise.com'>Return to the Gatherwise website</a>
        </PrimaryButton>
      </div>
      <img
        {...{
          src: shopFloorImage,
          alt: 'Shop floor image',
          className: 'mx-auto',
        }}
      />
    </div>
  )
}
