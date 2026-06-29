import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('erp-theme') as Theme) ?? 'system'
  })

  useEffect(() => {
    const root = window.document.documentElement
    const effective = theme === 'system' ? getSystemTheme() : theme
    root.classList.remove('light', 'dark')
    root.classList.add(effective)
  }, [theme])

  const setTheme = (t: Theme) => {
    localStorage.setItem('erp-theme', t)
    setThemeState(t)
  }

  return { theme, setTheme }
}
