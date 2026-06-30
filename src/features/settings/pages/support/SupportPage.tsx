import React from 'react'
import { Save } from 'lucide-react'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useZodForm } from '@/shared/components/form-fields'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/card'
import { Button } from '@/shared/components/button'
import { BaseInputField } from '@/shared/components/base-input-field'
import { TableSkeleton } from '@/shared/components/table'
import { useSettingsSingle, useSaveSettingsSingle } from '../../api/useSettings'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  whatsapp: z.string().min(1, 'WhatsApp is required'),
  socialLinks: z.string().optional(),
  addressAr: z.string().min(1, 'Arabic address is required'),
  addressEn: z.string().min(1, 'English address is required'),
  workingHoursAr: z.string().min(1, 'Arabic working hours are required'),
  workingHoursEn: z.string().min(1, 'English working hours are required')
});

export default function SupportPage() {
  const { t } = useTranslation()
  const { data: itemData, isLoading } = useSettingsSingle('support')
  const saveMutation = useSaveSettingsSingle('support')

  const methods = useZodForm(schema, itemData || {})

  React.useEffect(() => {
    if (itemData) {
      methods.reset(itemData)
    }
  }, [itemData, methods.reset])

  const onSubmit = (formData: any) => {
    saveMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <Card className="border-border/60 shadow-sm rounded-2xl p-6 bg-white">
        <TableSkeleton rows={4} cols={1} />
      </Card>
    )
  }

  return (
    <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardHeader className="border-b border-gray-50 px-6 py-5">
        <CardTitle className="text-lg font-bold text-gray-800">{t('support') || 'Support'}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                          <BaseInputField name="email" label="Support Email" required />
                          <BaseInputField name="phone" label="Support Phone" required />
                          <BaseInputField name="whatsapp" label="WhatsApp Number" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <BaseInputField name="socialLinks" label="Social Page / Website Links" placeholder="https://..." />
                          <div />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <BaseInputField name="addressAr" label="Arabic Address / العنوان بالعربية" required />
                          <BaseInputField name="addressEn" label="English Address" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <BaseInputField name="workingHoursAr" label="Arabic Working Hours / ساعات العمل بالعربية" required />
                          <BaseInputField name="workingHoursEn" label="English Working Hours" required />
                        </div>
            <div className="pt-4 border-t border-gray-50 flex justify-end">
              <Button type="submit" loading={saveMutation.isPending} className="px-6 h-10 rounded-xl">
                <Save className="mr-2 h-4 w-4" /> {t('saveChanges') || 'Save Changes'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}
