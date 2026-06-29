import React from 'react'
import { SingleModulePanel } from '../SingleModulePanel'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'

const schema = z.object({
  aboutAr: z.string().min(1, 'Arabic about text is required'),
  aboutEn: z.string().min(1, 'English about text is required'),
  copyrightAr: z.string().min(1, 'Arabic copyright is required'),
  copyrightEn: z.string().min(1, 'English copyright is required'),
  socialLinks: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required')
})

export default function FooterTab() {
  const { t } = useTranslation()
  return (
    <SingleModulePanel
      moduleKey="footer"
      label={t('footer') || 'Footer'}
      schema={schema}
    />
  )
}
