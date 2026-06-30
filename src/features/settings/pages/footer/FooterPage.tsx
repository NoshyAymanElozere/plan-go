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
  aboutAr: z.string().min(1, 'Arabic description is required'),
  aboutEn: z.string().min(1, 'English description is required'),
  copyrightAr: z.string().min(1, 'Arabic copyright is required'),
  copyrightEn: z.string().min(1, 'English copyright is required'),
  socialLinks: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required')
});

export default function FooterPage() {
  const { t } = useTranslation()
  const { data: itemData, isLoading } = useSettingsSingle('footer')
  const saveMutation = useSaveSettingsSingle('footer')

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
        <CardTitle className="text-lg font-bold text-gray-800">{t('footer') || 'Footer'}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                          <BaseInputField name="aboutAr" label="Arabic About Description / نبذة بالعربية" required />
                          <BaseInputField name="aboutEn" label="English About Description" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <BaseInputField name="copyrightAr" label="Arabic Copyright / حقوق النشر بالعربية" required />
                          <BaseInputField name="copyrightEn" label="English Copyright text" required />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <BaseInputField name="socialLinks" label="Social Page URL" placeholder="https://..." />
                          <BaseInputField name="email" label="Contact Email" required />
                          <BaseInputField name="phone" label="Contact Phone" required />
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
