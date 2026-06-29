import * as React from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription
} from './dialog'
import { cn } from '@/shared/utils/utils'

export interface ModalStatusProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  agreeLabel?: string
  cancelLabel?: string
  onAgreeButtonClick: () => void
  onCancelButtonClick: () => void
  loading?: boolean
  children?: React.ReactNode
}

export function ModalStatus({
  open,
  onOpenChange,
  title,
  description,
  agreeLabel = 'Agree',
  cancelLabel = 'Cancel',
  onAgreeButtonClick,
  onCancelButtonClick,
  loading = false,
  children
}: ModalStatusProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-gray-500 mt-1">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {children && (
          <div className="py-4">
            {children}
          </div>
        )}

        <DialogFooter className="mt-4">
          <button
            type="button"
            onClick={onCancelButtonClick}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onAgreeButtonClick}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-main px-4 text-sm font-semibold text-white hover:opacity-90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing…' : agreeLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default ModalStatus
