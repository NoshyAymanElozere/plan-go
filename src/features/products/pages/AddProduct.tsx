import React, { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/card'
import { Button } from '@/shared/components/button'
import { BaseInputField } from '@/shared/components/base-input-field'
import { useCreateProduct } from '@/features/products/api/useProducts'

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.preprocess(
    (v) => Number(v),
    z.number().positive('Price must be a positive number')
  ),
  cost: z.preprocess(
    (v) => Number(v),
    z.number().nonnegative('Cost must be zero or positive')
  ),
  stock: z.preprocess(
    (v) => Number(v),
    z.number().int().nonnegative('Stock must be an integer')
  ),
  minStock: z.preprocess(
    (v) => Number(v),
    z.number().int().nonnegative('Min stock must be an integer')
  ),
  unit: z.string().min(1, 'Unit is required'),
  description: z.string().optional()
})

type ProductFormData = z.infer<typeof productSchema>

interface AddProductProps {
  onBack: () => void
  onSuccess: () => void
}

export default function AddProduct({ onBack, onSuccess }: AddProductProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const createProductMutation = useCreateProduct()

  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      category: '',
      price: 0,
      cost: 0,
      stock: 0,
      minStock: 0,
      unit: 'pcs',
      description: ''
    }
  })

  // Handle local mock image file upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploading(true)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setUploading(false)
        toast.success('Product image uploaded successfully!')
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (data: ProductFormData) => {
    createProductMutation.mutate({
      ...data,
      imageUrl: imagePreview || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=250'
    }, {
      onSuccess: () => {
        onSuccess()
      }
    })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="h-9 w-9 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create a listing in your e-commerce inventory catalog.</p>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main info */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40">
              <CardHeader className="border-b border-gray-50 dark:border-zinc-800/40 py-4 px-6">
                <CardTitle className="text-sm font-bold text-gray-800 dark:text-gray-200">Catalog Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <BaseInputField name="name" label="Product Name" placeholder="e.g. Wireless Headset Pro" />
                <div className="grid grid-cols-2 gap-4">
                  <BaseInputField name="sku" label="SKU / Barcode" placeholder="WRL-1082" />
                  <BaseInputField name="category" label="Category" placeholder="e.g. Accessories" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <BaseInputField name="price" label="Sales Price" type="number" step="0.01" />
                  <BaseInputField name="cost" label="Wholesale Cost" type="number" step="0.01" />
                  <BaseInputField name="unit" label="Stock Unit" placeholder="pcs" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <BaseInputField name="stock" label="Initial Stock Level" type="number" />
                  <BaseInputField name="minStock" label="Minimum Threshold" type="number" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar: Image Upload */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40">
              <CardHeader className="border-b border-gray-50 dark:border-zinc-800/40 py-4 px-6">
                <CardTitle className="text-sm font-bold text-gray-800 dark:text-gray-200">Product Media</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="w-full flex flex-col items-center">
                  {imagePreview ? (
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-850 group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setImagePreview(null)}
                          className="h-10 w-10 rounded-full bg-white text-rose-600 flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="w-full aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800 hover:border-main dark:hover:border-main transition-colors flex flex-col items-center justify-center p-6 cursor-pointer bg-gray-50/50 dark:bg-zinc-800/10">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Upload className="h-8 w-8 text-gray-400 mb-3" />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 text-center">
                        {uploading ? 'Processing Image...' : 'Click to Upload Product Image'}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                type="submit"
                loading={createProductMutation.isPending}
                className="w-full bg-main hover:opacity-90 text-white py-2.5 rounded-xl font-bold"
              >
                Publish Product
              </Button>
              <button
                type="button"
                onClick={onBack}
                className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel Setup
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
