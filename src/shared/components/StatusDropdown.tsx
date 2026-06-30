import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'

interface StatusDropdownProps {
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}

export function StatusDropdown({ value, onChange, disabled }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setCoords({
          top: rect.bottom,
          left: rect.left,
          width: rect.width
        })
      }
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const dropdownContent = isOpen && (
    <div
      className="fixed rounded-xl border border-border/60 bg-card p-1 shadow-lg z-[9999] animate-in fade-in slide-in-from-top-1 duration-150"
      style={{
        top: coords.top + 6,
        left: coords.left,
        minWidth: '120px'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          onChange(true)
          setIsOpen(false)
        }}
        className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/5 hover:text-emerald-500 text-left text-xs font-semibold text-foreground/90 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Active</span>
        </div>
        {value && <Check className="h-3 w-3" />}
      </button>

      <button
        onClick={() => {
          onChange(false)
          setIsOpen(false)
        }}
        className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-rose-500/5 hover:text-rose-500 text-left text-xs font-semibold text-foreground/90 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          <span>Inactive</span>
        </div>
        {!value && <Check className="h-3 w-3" />}
      </button>
    </div>
  )

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation()
          if (!disabled) setIsOpen(!isOpen)
        }}
        disabled={disabled}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border ${
          value
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/15'
            : 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/15'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${value ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        <span>{value ? 'Active' : 'Inactive'}</span>
        <ChevronDown className={`h-3 w-3 opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && createPortal(dropdownContent, document.body)}
    </div>
  )
}

