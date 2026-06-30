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
  descEn: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().min(0, 'Price must be 0 or more'))
});

interface GroundServicesFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: any | null
  onSave: (data: any) => void
  loading: boolean
  label: string
}

export function GroundServicesFormModal({
  open,
  onOpenChange,
  editingItem,
  onSave,
  loading,
  label
}: GroundServicesFormModalProps) {
  const methods = useZodForm(
    schema,
    editingItem || { nameAr: '', nameEn: '', descAr: '', descEn: '', price: 0 }
  )

  React.useEffect(() => {
    if (editingItem) {
      methods.reset(editingItem)
    } else {
      methods.reset({ nameAr: '', nameEn: '', descAr: '', descEn: '', price: 0 })
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
                      <div className="max-w-[200px]">
                        <BaseInputField type="number" name="price" label="Service Price ($)" required />
                      </div>
        </div>
      </FormProvider>
    </ModalStatus>
  )
}
