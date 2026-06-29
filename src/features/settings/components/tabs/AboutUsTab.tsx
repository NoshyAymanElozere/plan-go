import React from 'react'
import { SingleModulePanel } from '../SingleModulePanel'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'

const schema = z.object({
  titleAr: z.string().min(1, 'Arabic title is required'),
  titleEn: z.string().min(1, 'English title is required'),
  contentAr: z.string().min(1, 'Arabic content is required'),
  contentEn: z.string().min(1, 'English content is required'),
  imageUrl: z.string().optional()
})

export default function AboutUsTab() {
  const { t } = useTranslation()
  return (
    <SingleModulePanel
      moduleKey="aboutus"
      label={t('aboutUs') || 'About Us'}
      schema={schema}
    />
  )
}
