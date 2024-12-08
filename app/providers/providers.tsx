'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from './ThemeProviders'
import { Toaster } from 'react-hot-toast';

export function Providers({children}: { children: React.ReactNode }): JSX.Element {
  return (
    <NextUIProvider>
      <ThemeProvider defaultTheme="light" attribute='class'>
        <Toaster/>
        {children}
      </ThemeProvider>
    </NextUIProvider>
  )
}
