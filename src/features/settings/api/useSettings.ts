import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { sleep } from '@/shared/utils/utils'

// Initial mock data
const initialData: Record<string, any[]> = {
  countries: [
    { id: '1', nameAr: 'مصر', nameEn: 'Egypt', descAr: 'جمهورية مصر العربية', descEn: 'Arab Republic of Egypt', countryCode: 'EG', phoneCode: '+20', flag: '🇪🇬' },
    { id: '2', nameAr: 'المملكة العربية السعودية', nameEn: 'Saudi Arabia', descAr: 'المملكة العربية السعودية', descEn: 'Kingdom of Saudi Arabia', countryCode: 'SA', phoneCode: '+966', flag: '🇸🇦' }
  ],
  cities: [
    { id: '1', nameAr: 'القاهرة', nameEn: 'Cairo', descAr: 'عاصمة مصر', descEn: 'Capital of Egypt' },
    { id: '2', nameAr: 'الرياض', nameEn: 'Riyadh', descAr: 'عاصمة السعودية', descEn: 'Capital of Saudi Arabia' }
  ],
  currencies: [
    { id: '1', nameAr: 'جنيه مصري', nameEn: 'Egyptian Pound', descAr: 'العملة الرسمية لمصر', descEn: 'Official currency of Egypt' },
    { id: '2', nameAr: 'ريال سعودي', nameEn: 'Saudi Riyal', descAr: 'العملة الرسمية للسعودية', descEn: 'Official currency of Saudi Arabia' }
  ],
  triptypes: [
    { id: '1', nameAr: 'ترفيهي', nameEn: 'Leisure', descAr: 'رحلات ترفيهية وسياحية', descEn: 'Leisure and tourism trips' },
    { id: '2', nameAr: 'عمل', nameEn: 'Business', descAr: 'رحلات عمل واجتماعات', descEn: 'Business and corporate trips' }
  ],
  travelertypes: [
    { id: '1', nameAr: 'عائلة', nameEn: 'Family', descAr: 'مسافرون بصحبة العائلة', descEn: 'Travelers with family' },
    { id: '2', nameAr: 'فردي', nameEn: 'Solo', descAr: 'مسافرون بمفردهم', descEn: 'Solo travelers' }
  ],
  hotelcategories: [
    { id: '1', nameAr: '5 نجوم', nameEn: '5 Stars', descAr: 'فنادق فاخرة', descEn: 'Luxury hotels' },
    { id: '2', nameAr: '4 نجوم', nameEn: '4 Stars', descAr: 'فنادق ممتازة', descEn: 'Excellent hotels' }
  ],
  groundservices: [
    { id: '1', nameAr: 'توصيل من المطار', nameEn: 'Airport Pickup', descAr: 'خدمة نقل من المطار للفندق', descEn: 'Airport to hotel transfer', price: 50 },
    { id: '2', nameAr: 'جولة سياحية', nameEn: 'City Tour', descAr: 'جولة سياحية مع مرشد', descEn: 'Guided city sightseeing tour', price: 120 }
  ],
  facilities: [
    { id: '1', nameAr: 'واي فاي مجاني', nameEn: 'Free Wi-Fi', descAr: 'إنترنت لاسلكي مجاني', descEn: 'Complimentary wireless internet' },
    { id: '2', nameAr: 'حمام سباحة', nameEn: 'Swimming Pool', descAr: 'حمام سباحة خارجي', descEn: 'Outdoor swimming pool' }
  ],
  propertytypes: [
    { id: '1', nameAr: 'فندق', nameEn: 'Hotel', descAr: 'منشأة فندقية تقليدية', descEn: 'Standard hotel property' },
    { id: '2', nameAr: 'شقة مفروشة', nameEn: 'Apartment', descAr: 'شقة سكنية مؤثثة', descEn: 'Furnished residential apartment' }
  ],
  ratings: [
    { id: '1', nameAr: 'ممتاز', nameEn: 'Excellent', descAr: 'تقييم 5/5', descEn: '5/5 rating' },
    { id: '2', nameAr: 'جيد جداً', nameEn: 'Very Good', descAr: 'تقييم 4/5', descEn: '4/5 rating' }
  ]
}

const initialSingleEntities: Record<string, any> = {
  aboutus: {
    titleAr: 'من نحن',
    titleEn: 'About Us',
    contentAr: 'نحن شركة رائدة في تقديم أفضل خدمات السفر والحلول الرقمية.',
    contentEn: 'We are a leading provider of premium travel services and digital solutions.',
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500'
  },
  privacypolicy: {
    titleAr: 'سياسة الخصوصية',
    titleEn: 'Privacy Policy',
    contentAr: 'نحن نلتزم بحماية بياناتك الشخصية وخصوصيتك بأقصى درجة.',
    contentEn: 'We commit to protecting your personal data and privacy with the highest standards.'
  },
  termsconditions: {
    titleAr: 'الشروط والأحكام',
    titleEn: 'Terms & Conditions',
    contentAr: 'باستخدامك لموقعنا، فإنك توافق على كافة الشروط والأحكام الخاصة بنا.',
    contentEn: 'By using our site, you agree to all our terms and conditions.'
  },
  support: {
    email: 'support@donezo.com',
    phone: '+966-500000000',
    whatsapp: '+966-500000000',
    socialLinks: 'https://twitter.com/donezo',
    addressAr: 'الرياض، المملكة العربية السعودية',
    addressEn: 'Riyadh, Saudi Arabia',
    workingHoursAr: 'الأحد - الخميس من 9 ص حتى 5 م',
    workingHoursEn: 'Sun - Thu 9 AM - 5 PM'
  },
  footer: {
    aboutAr: 'شريكك المثالي لإدارة رحلاتك وتطوير أعمالك السياحية بكل سهولة وأمان.',
    aboutEn: 'Your ideal partner to manage trips and develop your tourism business easily and securely.',
    copyrightAr: 'جميع الحقوق محفوظة © 2026 دونيزو',
    copyrightEn: 'All rights reserved © 2026 Donezo',
    socialLinks: 'https://linkedin.com/company/donezo',
    email: 'info@donezo.com',
    phone: '+966-110000000'
  }
}

// LocalStorage helpers to simulate database
function getStorageData(key: string, isSingle = false) {
  const data = localStorage.getItem(`settings_${key}`)
  if (data) return JSON.parse(data)
  const initial = isSingle ? initialSingleEntities[key] : initialData[key]
  localStorage.setItem(`settings_${key}`, JSON.stringify(initial))
  return initial
}

function setStorageData(key: string, data: any) {
  localStorage.setItem(`settings_${key}`, JSON.stringify(data))
}

export function useSettingsList(moduleKey: string, search = '') {
  return useQuery({
    queryKey: ['settings', moduleKey, search],
    queryFn: async () => {
      await sleep(200)
      const list = getStorageData(moduleKey) || []
      if (search) {
        const q = search.toLowerCase()
        return list.filter((item: any) =>
          (item.nameAr || '').toLowerCase().includes(q) ||
          (item.nameEn || '').toLowerCase().includes(q) ||
          (item.descAr || '').toLowerCase().includes(q) ||
          (item.descEn || '').toLowerCase().includes(q)
        )
      }
      return list
    }
  })
}

export function useSettingsSingle(moduleKey: string) {
  return useQuery({
    queryKey: ['settings_single', moduleKey],
    queryFn: async () => {
      await sleep(250)
      return getStorageData(moduleKey, true)
    }
  })
}

export function useSaveSettingsSingle(moduleKey: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      await sleep(300)
      setStorageData(moduleKey, data)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings_single', moduleKey] })
      toast.success('Settings saved successfully')
    },
    onError: () => toast.error('Failed to save settings')
  })
}

export function useCreateSettingsItem(moduleKey: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      await sleep(300)
      const list = getStorageData(moduleKey) || []
      const newItem = { ...data, id: String(Date.now()) }
      list.unshift(newItem)
      setStorageData(moduleKey, list)
      return newItem
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings', moduleKey] })
      toast.success('Item added successfully')
    },
    onError: () => toast.error('Failed to add item')
  })
}

export function useUpdateSettingsItem(moduleKey: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await sleep(300)
      const list = getStorageData(moduleKey) || []
      const idx = list.findIndex((item: any) => item.id === id)
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data }
        setStorageData(moduleKey, list)
      }
      return list[idx]
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings', moduleKey] })
      toast.success('Item updated successfully')
    },
    onError: () => toast.error('Failed to update item')
  })
}

export function useDeleteSettingsItem(moduleKey: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await sleep(200)
      const list = getStorageData(moduleKey) || []
      const updated = list.filter((item: any) => item.id !== id)
      setStorageData(moduleKey, updated)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings', moduleKey] })
      toast.success('Item deleted successfully')
    },
    onError: () => toast.error('Failed to delete item')
  })
}
