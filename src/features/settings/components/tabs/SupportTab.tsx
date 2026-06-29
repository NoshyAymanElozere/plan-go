import React from 'react'
import { SingleModulePanel } from '../SingleModulePanel'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  whatsapp: z.string().min(1, 'WhatsApp number is required'),
  socialLinks: z.string().optional(),
  addressAr: z.string().min(1, 'Arabic address is required'),
  addressEn: z.string().min(1, 'English address is required'),
  workingHoursAr: z.string().min(1, 'Arabic working hours required'),
  workingHoursEn: z.string().min(1, 'English working hours required')
})

export default function SupportTab() {
  const { t } = useTranslation()
  return (
    <SingleModulePanel
      moduleKey="support"
      label={t('support') || 'Support'}
      schema={schema}
    />
  )
}
