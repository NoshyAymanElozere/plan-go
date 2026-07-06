import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/card'
import { Button } from '@/shared/components/button'
import { BaseInputField } from '@/shared/components/base-input-field'
import { BaseTextAreaField } from '@/shared/components/base-textarea-field'
import { TouristDestinationSelect } from '@/shared/components/selects/TouristDestinationSelect'
import { TouristAttractionSelect } from '@/shared/components/selects/TouristAttractionSelect'
import { GroundServiceSelect } from '@/shared/components/selects/GroundServiceSelect'
import { useTravelPackage } from '../../api/useTravelPackages'
import { schema, getInitialValues } from './validationSchema'
import { ArrowLeft, Edit3, DollarSign, ImageIcon } from 'lucide-react'

export default function TravelPackageDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { i18n, t } = useTranslation()

  const { data: travelPackage, isLoading } = useTravelPackage(id ? Number(id) : null) as any

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: getInitialValues(null)
  })

  const { control, reset, setValue } = methods

  const selectedDestinationId = travelPackage?.tourist_destination_id

  useEffect(() => {
    if (travelPackage) {
      const initial = getInitialValues(travelPackage)
      reset(initial)
      
      const attractionIds = travelPackage.attractions?.map((a: any) => String(a.id)) || []
      const groundServiceIds = travelPackage.ground_handling_services?.map((g: any) => String(g.id)) || []
      setValue('attractions', attractionIds)
      setValue('ground_handling_services', groundServiceIds)
    }
  }, [travelPackage, reset, setValue])

  const calculatedBasePrice = travelPackage?.price || 0
  const finalPrice = travelPackage?.final_price || 0
  const isRtl = i18n.language === 'ar'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main" />
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40 px-6 py-5">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings/travelpackages')}
              className="h-8 w-8 rounded-lg"
            >
              <ArrowLeft className={isRtl ? 'rotate-180 h-4 w-4' : 'h-4 w-4'} />
            </Button>
            <CardTitle className="text-lg font-bold text-foreground">
              {travelPackage?.translations?.find((trans: any) => trans.language_id === (isRtl ? 2 : 1))?.name || travelPackage?.name || t('travelPackage')}
            </CardTitle>
          </div>
          <Button
            type="button"
            onClick={() => navigate(`/settings/travelpackages/${id}/edit`)}
            className="h-9 px-4 rounded-xl flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" /> {t('edit') || 'Edit'}
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          
          {/* Images Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                {t('mainImage') || 'Main Image'}
              </label>
              {travelPackage?.image_url ? (
                <img
                  src={travelPackage.image_url}
                  alt="main"
                  className="h-40 w-full object-cover rounded-xl border border-gray-200"
                />
              ) : (
                <div className="h-40 w-full rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-300">
                  <ImageIcon className="h-8 w-8 mb-2" />
                  <span className="text-xs">{t('noImage') || 'No main image'}</span>
                </div>
              )}
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                {t('gallery') || 'Gallery'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {travelPackage?.gallery && travelPackage.gallery.length > 0 ? (
                  travelPackage.gallery.map((g: any, idx: number) => (
                    <div key={g.id || idx} className="h-40 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                      <img src={g.file_path} alt="gallery" className="w-full h-full object-cover" />
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 h-40 rounded-xl bg-gray-50/50 flex items-center justify-center border border-dashed border-gray-200 text-gray-400">
                    <span className="text-xs">{t('noImagesInGallery') || 'No images in gallery'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields (All Read-Only/Disabled) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInputField name="nameAr" label={t('arabicName') || 'Arabic Name'} disabled />
            <BaseInputField name="nameEn" label={t('englishName') || 'English Name'} disabled />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseTextAreaField name="descAr" label={t('arabicDescription') || 'Arabic Description'} disabled />
            <BaseTextAreaField name="descEn" label={t('englishDescription') || 'English Description'} disabled />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BaseInputField name="start_date" type="date" label={t('startDate') || 'Start Date'} disabled />
            <BaseInputField name="end_date" type="date" label={t('endDate') || 'End Date'} disabled />
            <BaseInputField name="duration" label={t('duration') || 'Duration'} disabled />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <BaseInputField name="number_of_individuals" type="number" label={t('numberOfIndividuals') || 'Number of Individuals'} disabled />
            
            <TouristDestinationSelect
              control={control}
              disabled
            />

            <div className="flex flex-col gap-1.5 justify-center items-start">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                {t('status') || 'Status'}
              </label>
              <div className="flex items-center h-10">
                <input
                  type="checkbox"
                  id="is_active_details"
                  className="h-4 w-4 text-main focus:ring-main border-gray-300 rounded cursor-not-allowed"
                  disabled
                  checked={travelPackage?.is_active ?? false}
                  readOnly
                />
                <label htmlFor="is_active_details" className="ml-2 mr-2 text-sm text-gray-600 cursor-not-allowed">
                  {t('active') || 'Active'}
                </label>
              </div>
            </div>
          </div>

          {/* Attractions and Ground Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TouristAttractionSelect
              control={control}
              touristDestinationId={selectedDestinationId}
              disabled
            />

            <GroundServiceSelect
              control={control}
              disabled
            />
          </div>

          {/* Pricing Details */}
          <div className="p-5 rounded-2xl bg-gray-50/50 border border-gray-150 space-y-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              {t('pricingDetails') || 'Pricing Details'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Calculated Base Price */}
              <div className="p-4 rounded-xl bg-white border border-gray-150 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {t('basePrice') || 'Base Calculated Price'}
                  </p>
                  <p className="text-xl font-bold text-gray-800 mt-1">
                    {Number(calculatedBasePrice || 0).toFixed(2)} USD
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>

              {/* Custom Override Price Input */}
              <div>
                <BaseInputField
                  name="custom_price"
                  type="number"
                  label={t('customPrice') || 'Custom Override Price'}
                  disabled
                />
              </div>

              {/* Final Calculated Price */}
              <div className="p-4 rounded-xl bg-main/5 border border-main/10 flex items-center justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-main uppercase tracking-wider">
                      {t('finalPrice') || 'Final Price to Show'}
                    </p>
                    {travelPackage?.is_custom_price_used && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-bold">
                        {t('overrideActive') || 'Override Active'}
                      </span>
                    )}
                  </div>
                  <p className="text-xl font-bold text-main mt-1">
                    {Number(finalPrice || 0).toFixed(2)} USD
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-main/10 border border-main/20 flex items-center justify-center text-main">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </FormProvider>
  )
}
