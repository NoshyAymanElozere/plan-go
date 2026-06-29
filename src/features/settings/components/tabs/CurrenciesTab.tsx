import React from 'react'
import { CrudModulePanel } from '../CrudModulePanel'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'

const schema = z.object({
  nameAr: z.string().min(1, 'Arabic name is required'),
  nameEn: z.string().min(1, 'English name is required'),
  descAr: z.string().optional(),
  descEn: z.string().optional()
})

export default function CurrenciesTab() {
  const { t } = useTranslation()
  return (
    <CrudModulePanel
      moduleKey="currencies"
      label={t('currencies') || 'Currencies'}
      schema={schema}
    />
  )
}
