import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { ControlledCheckbox } from '@/shared/components/form-fields'
import { BaseInputField } from '@/shared/components/base-input-field'
import ModalStatus from '@/shared/components/modal-status'
import { getInitialValues } from './validationSchema'

interface CountriesFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: any | null
  onSave: (data: any) => void
  loading: boolean
  label: string
}

export function CountriesFormModal({
  open,
  onOpenChange,
  editingItem,
  onSave,
  loading,
  label
}: CountriesFormModalProps) {
  const { control, register, reset, handleSubmit } = useFormContext()

  useEffect(() => {
    if (open) {
      reset(getInitialValues(editingItem))
    }
  }, [editingItem, open, reset])

  return (
    <ModalStatus
      open={open}
      onOpenChange={onOpenChange}
      title={editingItem ? `Edit ${label}` : `Add New ${label}`}
      agreeLabel="Save"
      cancelLabel="Cancel"
      onAgreeButtonClick={handleSubmit(onSave)}
      onCancelButtonClick={() => onOpenChange(false)}
      loading={loading}
    >
      <div className="space-y-4 text-right" dir="rtl">
        <div className="grid grid-cols-2 gap-4">
          <BaseInputField name="nameAr" label="Arabic Name / الاسم بالعربية" required />
          <BaseInputField name="nameEn" label="English Name / الاسم بالإنجليزية" required />
        </div>
        <div className="grid grid-cols-2 gap-4 items-center">
          <BaseInputField name="code" label="Country Code / رمز الدولة (e.g. EG)" required />
          <div className="pt-5 flex items-center justify-start">
            <ControlledCheckbox name="is_active" control={control} label="Active / نشط" />
          </div>
        </div>
        <div className="text-right">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
            Flag Image / صورة العلم
          </label>
          <input
            type="file"
            accept="image/*"
            {...register('image')}
            className="w-full text-sm text-gray-500 file:ml-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
        </div>
      </div>
    </ModalStatus>
  )
}
