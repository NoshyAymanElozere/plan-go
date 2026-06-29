import React from 'react'
import { SingleModulePanel } from '../SingleModulePanel'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'

const schema = z.object({
  titleAr: z.string().min(1, 'Arabic title is required'),
  titleEn: z.string().min(1, 'English title is required'),
  contentAr: z.string().min(1, 'Arabic content is required'),
  contentEn: z.string().min(1, 'English content is required')
})

export default function PrivacyPolicyTab() {
  const { t } = useTranslation()
  return (
    <SingleModulePanel
      moduleKey="privacypolicy"
      label={t('privacyPolicy') || 'Privacy Policy'}
      schema={schema}
    />
  )
}
