'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const token = getToken()
    if (token) {
      router.push('/dashboard')
    } else {
      router.push('/auth')
    }
  }, [router])

  return null
}
