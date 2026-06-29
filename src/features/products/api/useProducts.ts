import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { Product, ProductFormData, TableParams, PaginatedResponse } from '@/shared/types'
import { mockProducts } from '@/shared/constants/mockData'
import { sleep } from '@/shared/utils/utils'

const QUERY_KEY = 'products'

// Simulate API call
async function fetchProducts(params: TableParams): Promise<PaginatedResponse<Product>> {
  await sleep(400)
  let items = [...mockProducts]
  if (params.search) {
    const q = params.search.toLowerCase()
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    )
  }
  const total = items.length
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 10
  const start = (page - 1) * pageSize
  return {
    data: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

async function createProduct(data: ProductFormData & { imageUrl?: string }): Promise<Product> {
  await sleep(600)
  const newProduct: Product = {
    id: String(mockProducts.length + 1),
    name: data.name,
    sku: data.sku,
    category: data.category,
    price: data.price,
    cost: data.cost,
    stock: data.stock,
    minStock: data.minStock,
    unit: data.unit,
    status: 'active',
    description: data.description,
    imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=250',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  }
  mockProducts.unshift(newProduct) // Place at the start of the list
  return newProduct
}

async function updateProduct(id: string, data: Partial<ProductFormData>): Promise<Product> {
  await sleep(600)
  const existing = mockProducts.find((p) => p.id === id)!
  return { ...existing, ...data, updatedAt: new Date().toISOString() }
}

async function deleteProduct(id: string): Promise<void> {
  await sleep(400)
  const index = mockProducts.findIndex((p) => p.id === id)
  if (index !== -1) {
    mockProducts.splice(index, 1)
  }
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useProducts(params: TableParams) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => fetchProducts(params),
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Product created successfully')
    },
    onError: () => toast.error('Failed to create product'),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductFormData> }) =>
      updateProduct(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Product updated successfully')
    },
    onError: () => toast.error('Failed to update product'),
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Product deleted')
    },
    onError: () => toast.error('Failed to delete product'),
  })
}
