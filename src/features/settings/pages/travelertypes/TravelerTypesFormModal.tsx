import React from 'react'
import { FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { useZodForm } from '@/shared/components/form-fields'
import { BaseInputField } from '@/shared/components/base-input-field'
import ModalStatus from '@/shared/components/modal-status'

export const schema = z.object({
  nameAr: z.string().min(1, 'Arabic name is required'),
  nameEn: z.string().min(1, 'English name is required'),
  descAr: z.string().optional(),
  descEn: z.string().optional()
});

interface TravelerTypesFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: any | null
  onSave: (data: any) => void
  loading: boolean
  label: string
}

export function TravelerTypesFormModal({
  open,
  onOpenChange,
  editingItem,
  onSave,
  loading,
  label
}: TravelerTypesFormModalProps) {
  const methods = useZodForm(
    schema,
    editingItem || { nameAr: '', nameEn: '', descAr: '', descEn: '' }
  )

  React.useEffect(() => {
    if (editingItem) {
      methods.reset(editingItem)
    } else {
      methods.reset({ nameAr: '', nameEn: '', descAr: '', descEn: '' })
    }
  }, [editingItem, open, methods.reset])

  return (
    <ModalStatus
      open={open}
      onOpenChange={onOpenChange}
      title={editingItem ? `Edit ${label}` : `Add New ${label}`}
      agreeLabel="Save"
      cancelLabel="Cancel"
      onAgreeButtonClick={methods.handleSubmit(onSave)}
      onCancelButtonClick={() => onOpenChange(false)}
      loading={loading}
    >
      <FormProvider {...methods}>
        <div className="space-y-4 text-right" dir="rtl">
          <div className="grid grid-cols-2 gap-4">
                        <BaseInputField name="nameAr" label="Arabic Name / الاسم بالعربية" required />
                        <BaseInputField name="nameEn" label="English Name" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <BaseInputField name="descAr" label="Arabic Description / الوصف بالعربية" />
                        <BaseInputField name="descEn" label="English Description" />
                      </div>
        </div>
      </FormProvider>
    </ModalStatus>
  )
}
