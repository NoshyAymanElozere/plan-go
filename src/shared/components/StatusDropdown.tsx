import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface StatusDropdownProps {
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
  usePortal?: boolean
}

export function StatusDropdown({ value, onChange, disabled, usePortal = true }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      const isInsideTrigger = containerRef.current?.contains(target)
      const isInsideDropdown = dropdownRef.current?.contains(target)
      if (!isInsideTrigger && !isInsideDropdown) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      if (usePortal && buttonRef.current) {
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
  }, [isOpen, usePortal])

  const dropdownInner = (
    <>
      <button
        type="button"
        onClick={() => {
          onChange(true)
          setIsOpen(false)
        }}
        className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/5 hover:text-emerald-500 text-left text-xs font-semibold text-foreground/90 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>{t('active') || 'Active'}</span>
        </div>
        {value && <Check className="h-3 w-3" />}
      </button>

      <button
        type="button"
        onClick={() => {
          onChange(false)
          setIsOpen(false)
        }}
        className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-rose-500/5 hover:text-rose-500 text-left text-xs font-semibold text-foreground/90 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          <span>{t('inactive') || 'Inactive'}</span>
        </div>
        {!value && <Check className="h-3 w-3" />}
      </button>
    </>
  )

  const portalDropdownContent = isOpen && usePortal && (
    <div
      ref={dropdownRef}
      className="fixed rounded-xl border border-border/60 bg-card p-1 shadow-lg z-[9999] animate-in fade-in slide-in-from-top-1 duration-150"
      style={{
        top: coords.top + 6,
        left: coords.left,
        minWidth: '120px'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {dropdownInner}
    </div>
  )

  const inlineDropdownContent = isOpen && !usePortal && (
    <div
      ref={dropdownRef}
      className={`absolute mt-1.5 rounded-xl border border-border/60 bg-card p-1 shadow-lg z-[9999] animate-in fade-in slide-in-from-top-1 duration-150 ${
        isRtl ? 'right-0' : 'left-0'
      }`}
      style={{
        minWidth: '120px'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {dropdownInner}
    </div>
  )

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
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
        <span>{value ? t('active') || 'Active' : t('inactive') || 'Inactive'}</span>
        <ChevronDown className={`h-3 w-3 opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {usePortal ? (isOpen && createPortal(portalDropdownContent, document.body)) : inlineDropdownContent}
    </div>
  )
}
