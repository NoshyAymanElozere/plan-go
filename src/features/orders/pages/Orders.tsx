import React, { useState } from 'react'
import { mockOrders } from '@/shared/constants/mockData'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/table'
import { Badge } from '@/shared/components/badge'
import { Input } from '@/shared/components/input'
import { Search, Plus, Filter, Download } from 'lucide-react'
import { formatCurrency } from '@/shared/utils/utils'

export default function Orders() {
  const [search, setSearch] = useState('')
  const filtered = mockOrders.filter(o =>
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor sales and shipment processes.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs">
            <Download className="h-4 w-4" /> Export
          </button>
          <button className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-main text-white text-sm font-semibold hover:opacity-90 transition-colors shadow-sm">
            <Plus className="h-4 w-4" /> Create Order
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <button className="flex items-center gap-1 text-xs font-bold text-gray-600 border border-gray-200 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="h-3.5 w-3.5" /> Filters
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Info</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono font-bold text-gray-800">{order.orderNumber}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">{order.customerName}</span>
                  <span className="text-xs text-gray-400">{order.customerEmail}</span>
                </div>
              </TableCell>
              <TableCell>{order.createdAt}</TableCell>
              <TableCell className="text-right font-bold text-gray-900">{formatCurrency(order.total)}</TableCell>
              <TableCell>
                <Badge
                  variant={order.paymentStatus === 'paid' ? 'success' : order.paymentStatus === 'refunded' ? 'secondary' : 'warning'}
                  className="capitalize"
                >
                  {order.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={order.status === 'delivered' ? 'success' : order.status === 'pending' ? 'warning' : 'default'}
                  className="capitalize"
                >
                  {order.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
