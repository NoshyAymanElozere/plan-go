import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { Order, TableParams, PaginatedResponse, DashboardStats, RevenueData } from '@/shared/types'
import { mockOrders, mockDashboardStats, mockRevenueData } from '@/shared/constants/mockData'
import { sleep } from '@/shared/utils/utils'

const ORDERS_KEY = 'orders'
const STATS_KEY = 'dashboardStats'
const REVENUE_KEY = 'revenueData'

async function fetchOrders(params: TableParams): Promise<PaginatedResponse<Order>> {
  await sleep(400)
  let items = [...mockOrders]
  if (params.search) {
    const q = params.search.toLowerCase()
    items = items.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q)
    )
  }
  const total = items.length
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 10
  return {
    data: items.slice((page - 1) * pageSize, page * pageSize),
    total, page, pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  await sleep(300)
  return mockDashboardStats
}

async function fetchRevenueData(): Promise<RevenueData[]> {
  await sleep(350)
  return mockRevenueData
}

async function updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
  await sleep(400)
  const order = mockOrders.find((o) => o.id === id)!
  return { ...order, status }
}

export function useOrders(params: TableParams) {
  return useQuery({ queryKey: [ORDERS_KEY, params], queryFn: () => fetchOrders(params) })
}

export function useDashboardStats() {
  return useQuery({ queryKey: [STATS_KEY], queryFn: fetchDashboardStats })
}

export function useRevenueData() {
  return useQuery({ queryKey: [REVENUE_KEY], queryFn: fetchRevenueData })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) => updateOrderStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [ORDERS_KEY] }); toast.success('Order status updated') },
    onError: () => toast.error('Failed to update order'),
  })
}
