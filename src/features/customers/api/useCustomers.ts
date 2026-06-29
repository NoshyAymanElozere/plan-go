import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { Customer, CustomerFormData, TableParams, PaginatedResponse } from '@/shared/types'
import { mockCustomers } from '@/shared/constants/mockData'
import { sleep } from '@/shared/utils/utils'

const QUERY_KEY = 'customers'

async function fetchCustomers(params: TableParams): Promise<PaginatedResponse<Customer>> {
  await sleep(400)
  let items = [...mockCustomers]
  if (params.search) {
    const q = params.search.toLowerCase()
    items = items.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.company ?? '').toLowerCase().includes(q)
    )
  }
  const total = items.length
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 10
  return {
    data: items.slice((page - 1) * pageSize, page * pageSize),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

async function createCustomer(data: CustomerFormData): Promise<Customer> {
  await sleep(600)
  return { id: String(Date.now()), ...data, totalOrders: 0, totalSpent: 0, createdAt: new Date().toISOString() }
}

async function updateCustomer(id: string, data: Partial<CustomerFormData>): Promise<Customer> {
  await sleep(600)
  const existing = mockCustomers.find((c) => c.id === id)!
  return { ...existing, ...data }
}

async function deleteCustomer(id: string): Promise<void> {
  await sleep(400)
}

export function useCustomers(params: TableParams) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => fetchCustomers(params),
  })
}

export function useCreateCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); toast.success('Customer created') },
    onError: () => toast.error('Failed to create customer'),
  })
}

export function useUpdateCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerFormData> }) => updateCustomer(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); toast.success('Customer updated') },
    onError: () => toast.error('Failed to update customer'),
  })
}

export function useDeleteCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); toast.success('Customer deleted') },
    onError: () => toast.error('Failed to delete customer'),
  })
}
