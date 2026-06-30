import React from 'react'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Button } from '@/shared/components/button'
import { BaseInputField } from '@/shared/components/base-input-field'
import { useZodForm } from '@/shared/components/form-fields'
import { useLogin } from '../api/useAuth'

export default function Login() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const { mutate: login, isPending } = useLogin()

  const loginSchema = z.object({
    email: z.string().min(1, t('emailRequired')).email(t('invalidEmail')),
    password: z.string().min(1, t('passwordRequired'))
  })

  const methods = useZodForm(loginSchema, {
    email: '',
    password: ''
  })

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login(data)
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-100 p-4" 
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-[420px] bg-[#F8F9FA] rounded-[32px] shadow-xs px-8 py-10 flex flex-col items-center border border-gray-100/50">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-0.5 text-3xl font-black mb-8 select-none" dir="ltr">
          <span className="text-[#00D1C1]">Plan</span>
          <span className="text-[#7266F0] flex items-baseline">
            G
            <span className="text-[14px] leading-none font-bold align-super ml-0.5 relative -top-3">o</span>
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-[#111] mb-8 text-center">
          {t('loginTitle')}
        </h2>

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full space-y-6">
            
            {/* Email Field */}
            <div>
              <BaseInputField
                name="email"
                label={t('email') + ' *'}
                placeholder="admin@example.com"
                className="w-full h-12 px-4 rounded-xl border border-[#00D1C1]/60 focus:ring-[#00D1C1]/20 focus:border-[#00D1C1]/60 text-left font-semibold text-gray-800 placeholder-gray-300 transition-all outline-none"
                dir="ltr"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <BaseInputField
                name="password"
                label={t('password') + ' *'}
                type="password"
                placeholder="********"
                className="w-full h-12 px-4 rounded-xl border border-[#00D1C1]/60 focus:ring-[#00D1C1]/20 focus:border-[#00D1C1]/60 text-left font-bold text-gray-800 placeholder-gray-300 transition-all outline-none"
                dir="ltr"
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <a href="#" className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
                {isRtl ? 'نسيت كلمة المرور؟ ' : 'Forgot password? '}
                <span className="text-[#7266F0] underline">
                  {isRtl ? 'اعادة تعيين' : 'Reset'}
                </span>
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-[#7266F0] hover:bg-[#5e52dc] text-white rounded-xl font-bold text-base shadow-xs transition-colors mt-2"
            >
              {isPending ? (isRtl ? 'جاري التحميل...' : 'Loading...') : t('login')}
            </Button>

            {/* Signup Link */}
            <div className="text-center pt-2">
              <span className="text-xs font-semibold text-gray-400">
                {isRtl ? 'ليس لديك حساب ؟ ' : "Don't have an account? "}
                <a href="#" className="text-[#7266F0] hover:underline font-bold mr-1">
                  {isRtl ? 'انشاء حساب' : 'Sign up'}
                </a>
              </span>
            </div>

          </form>
        </FormProvider>
      </div>
    </div>
  )
}
