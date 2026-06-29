import React, { useState } from 'react'
import { mockCustomers } from '@/shared/constants/mockData'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/table'
import { Badge } from '@/shared/components/badge'
import { Input } from '@/shared/components/input'
import { Search, Plus, Filter, Download } from 'lucide-react'
import { formatCurrency } from '@/shared/utils/utils'

export default function Customers() {
  const [search, setSearch] = useState('')
  const filtered = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your client base.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs">
            <Download className="h-4 w-4" /> Export
          </button>
          <button className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-main text-white text-sm font-semibold hover:opacity-90 transition-colors shadow-sm">
            <Plus className="h-4 w-4" /> Add Customer
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search customers..."
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
            <TableHead>Customer</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Orders</TableHead>
            <TableHead className="text-right">Total Spent</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800">{customer.name}</span>
                  <span className="text-xs text-gray-400">{customer.email}</span>
                </div>
              </TableCell>
              <TableCell>
                {customer.city}, {customer.country}
              </TableCell>
              <TableCell className="capitalize">{customer.type}</TableCell>
              <TableCell className="text-right font-semibold text-gray-700">{customer.totalOrders}</TableCell>
              <TableCell className="text-right font-bold text-main">{formatCurrency(customer.totalSpent)}</TableCell>
              <TableCell>
                <Badge
                  variant={customer.status === 'vip' ? 'default' : customer.status === 'active' ? 'success' : 'secondary'}
                  className="capitalize"
                >
                  {customer.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
