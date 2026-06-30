import React from 'react'
import { FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useZodForm, ControlledSelect, ControlledCheckbox } from '@/shared/components/form-fields'
import { BaseInputField } from '@/shared/components/base-input-field'
import ModalStatus from '@/shared/components/modal-status'
import { useAllCountries } from '../../api/useCountries'

export const schema = z.object({
  nameAr: z.string().min(1, 'Arabic name is required'),
  nameEn: z.string().min(1, 'English name is required'),
  country_id: z.string().min(1, 'Country is required'),
  is_active: z.boolean()
})

interface CitiesFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: any | null
  onSave: (data: any) => void
  loading: boolean
  label: string
}

export function CitiesFormModal({
  open,
  onOpenChange,
  editingItem,
  onSave,
  loading,
  label
}: CitiesFormModalProps) {
  const { i18n } = useTranslation()
  const { data: countries = [] } = useAllCountries()

  const countryOptions = countries.map((c: any) => {
    const name = c.translations?.find((t: any) => t.language_id === (i18n.language === 'ar' ? 2 : 1))?.name || c.name || ''
    return { value: String(c.id), label: name }
  })

  const getInitialValues = () => {
    if (!editingItem) {
      return { nameAr: '', nameEn: '', country_id: '', is_active: true }
    }
    const nameAr = editingItem.translations?.find((t: any) => t.language_id === 2)?.name || ''
    const nameEn = editingItem.translations?.find((t: any) => t.language_id === 1)?.name || editingItem.name || ''
    return {
      nameAr,
      nameEn,
      country_id: String(editingItem.country_id || ''),
      is_active: editingItem.is_active ?? true
    }
  }

  const methods = useZodForm(schema, getInitialValues())

  React.useEffect(() => {
    if (open) {
      methods.reset(getInitialValues())
    }
  }, [editingItem, open])

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
            <BaseInputField name="nameEn" label="English Name / الاسم بالإنجليزية" required />
          </div>
          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="text-left" dir="ltr">
              <ControlledSelect
                name="country_id"
                control={methods.control}
                label="Country / الدولة *"
                options={countryOptions}
                placeholder="Choose country..."
              />
            </div>
            <div className="pt-5 flex items-center justify-start">
              <ControlledCheckbox name="is_active" control={methods.control} label="Active / نشط" />
            </div>
          </div>
        </div>
      </FormProvider>
    </ModalStatus>
  )
}
