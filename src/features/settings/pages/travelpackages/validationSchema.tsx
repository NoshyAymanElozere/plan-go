import { z } from 'zod'

export const schema = z.object({
  nameAr: z.string().min(1, 'requiredField'),
  nameEn: z.string().min(1, 'requiredField'),
  descAr: z.string().min(1, 'requiredField'),
  descEn: z.string().min(1, 'requiredField'),
  tourist_destination_id: z.string().min(1, 'requiredField'),
  start_date: z.string().min(1, 'requiredField'),
  end_date: z.string().min(1, 'requiredField'),
  // duration: z.string().min(1, 'requiredField'),
  number_of_individuals: z.string().min(1, 'requiredField'),
  custom_price: z.string().optional(),
  is_active: z.boolean(),
  image: z.any().optional(),
  gallery: z.any().optional()
})

export type TravelPackagesFormValues = z.infer<typeof schema>

export const getInitialValues = (editingItem: any | null) => {
  if (!editingItem) {
    return {
      nameAr: '',
      nameEn: '',
      descAr: '',
      descEn: '',
      tourist_destination_id: '',
      start_date: '',
      end_date: '',
      // duration: '',
      number_of_individuals: '',
      custom_price: '',
      is_active: true,
      image: null,
      gallery: []
    }
  }

  const nameAr = editingItem.translations?.find((t: any) => t.language_id === 2)?.name || ''
  const nameEn = editingItem.translations?.find((t: any) => t.language_id === 1)?.name || editingItem.name || ''
  const descAr = editingItem.translations?.find((t: any) => t.language_id === 2)?.description || ''
  const descEn = editingItem.translations?.find((t: any) => t.language_id === 1)?.description || editingItem.description || ''

  return {
    nameAr,
    nameEn,
    descAr,
    descEn,
    tourist_destination_id: String(editingItem.tourist_destination_id || ''),
    start_date: editingItem.start_date || '',
    end_date: editingItem.end_date || '',
    // duration: editingItem.duration || '',
    number_of_individuals: String(editingItem.number_of_individuals || ''),
    custom_price: editingItem.custom_price ? String(editingItem.custom_price) : '',
    is_active: editingItem.is_active ?? true,
    image: editingItem.image_url || null,
    gallery: editingItem.gallery || []
  }
}
