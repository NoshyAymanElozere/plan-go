import React from 'react'
import { CrudModulePanel } from '../CrudModulePanel'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'

const schema = z.object({
  nameAr: z.string().min(1, 'Arabic name is required'),
  nameEn: z.string().min(1, 'English name is required'),
  descAr: z.string().optional(),
  descEn: z.string().optional(),
  countryCode: z.string().min(1, 'Country code is required'),
  phoneCode: z.string().min(1, 'Phone code is required'),
  flag: z.string().optional()
})

export default function CountriesTab() {
  const { t } = useTranslation()
  return (
    <CrudModulePanel
      moduleKey="countries"
      label={t('countries') || 'Countries'}
      schema={schema}
    />
  )
}
