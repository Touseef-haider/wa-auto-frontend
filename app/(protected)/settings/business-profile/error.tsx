'use client' // Error boundaries must be Client Components
 
import Button from '@/app/common/Button/Index'
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2 className='text-red-400 text-xl'>Something went wrong in fetching business details!</h2>
      <Button 
        title="Reset"
        type="button"
        className='py-3 mt-4 px-6'
        onClick={
          () => reset()
        }
      />
    </div>
  )
}