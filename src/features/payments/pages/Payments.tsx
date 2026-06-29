import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/table'
import { Badge } from '@/shared/components/badge'
import { Input } from '@/shared/components/input'
import { Search, Plus, Filter, Download } from 'lucide-react'
import { formatCurrency } from '@/shared/utils/utils'

const mockPayments = [
  { id: '1', ref: 'PAY-8809', customer: 'Acme Corporation', date: '2026-05-10', method: 'Bank Transfer', status: 'success', amount: 2289.84 },
  { id: '2', ref: 'PAY-8808', customer: 'TechBridge LLC', date: '2026-05-11', method: 'Credit Card', status: 'success', amount: 2858.80 },
  { id: '3', ref: 'PAY-8807', customer: 'Sarah Johnson', date: '2026-05-12', method: 'Stripe', status: 'processing', amount: 140.78 },
  { id: '4', ref: 'PAY-8806', customer: 'Michael Chen', date: '2026-05-09', method: 'PayPal', status: 'refunded', amount: 37.66 }
]

export default function Payments() {
  const [search, setSearch] = useState('')
  const filtered = mockPayments.filter(p =>
    p.customer.toLowerCase().includes(search.toLowerCase()) ||
    p.ref.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Payments</h1>
          <p className="text-sm text-gray-500 mt-1">Track financial inflows, gateways, and processing status.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs">
            <Download className="h-4 w-4" /> Export History
          </button>
          <button className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-main text-white text-sm font-semibold hover:opacity-90 transition-colors shadow-sm">
            <Plus className="h-4 w-4" /> Log Payment
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search payment logs..."
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
            <TableHead>Payment Ref</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Gateway / Method</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount Received</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono font-bold text-gray-800">{p.ref}</TableCell>
              <TableCell className="font-semibold text-gray-700">{p.customer}</TableCell>
              <TableCell>{p.method}</TableCell>
              <TableCell>{p.date}</TableCell>
              <TableCell className="text-right font-bold text-main">{formatCurrency(p.amount)}</TableCell>
              <TableCell>
                <Badge variant={p.status === 'success' ? 'success' : p.status === 'refunded' ? 'secondary' : 'warning'}>
                  {p.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
