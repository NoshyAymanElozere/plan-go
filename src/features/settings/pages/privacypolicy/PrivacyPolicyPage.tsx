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
  titleAr: z.string().min(1, 'Arabic title is required'),
  titleEn: z.string().min(1, 'English title is required'),
  contentAr: z.string().min(1, 'Arabic content is required'),
  contentEn: z.string().min(1, 'English content is required')
});

export default function PrivacyPolicyPage() {
  const { t } = useTranslation()
  const { data: itemData, isLoading } = useSettingsSingle('privacypolicy')
  const saveMutation = useSaveSettingsSingle('privacypolicy')

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
        <CardTitle className="text-lg font-bold text-gray-800">{t('privacyPolicy') || 'PrivacyPolicy'}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                          <BaseInputField name="titleAr" label="Arabic Title / العنوان بالعربية" required />
                          <BaseInputField name="titleEn" label="English Title" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <BaseInputField name="contentAr" label="Arabic Content / المحتوى بالعربية" required />
                          <BaseInputField name="contentEn" label="English Content" required />
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
