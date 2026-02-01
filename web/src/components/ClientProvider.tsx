'use client'

import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuthInit } from '@/hooks/useAuthInit'

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  useAuthInit()

  return (
    <>
      <Toaster position="top-right" />
      {children}
    </>
  )
}
