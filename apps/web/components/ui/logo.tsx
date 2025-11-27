'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function Logo({ width = 30, height = 30 }: { width?: number; height?: number }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Image src="/logo.png" alt="Openpass Wallet" width={width} height={height} />
  }

  return (
    <Image
      src={resolvedTheme === 'dark' ? '/logo-dark.png' : '/logo.png'}
      alt="Openpass Wallet"
      width={width}
      height={height}
    />
  )
}
