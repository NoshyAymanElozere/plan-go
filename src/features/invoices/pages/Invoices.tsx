import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/table'
import { Badge } from '@/shared/components/badge'
import { Input } from '@/shared/components/input'
import { Search, Plus, Filter, Download } from 'lucide-react'
import { formatCurrency } from '@/shared/utils/utils'

const mockInvoices = [
  { id: '1', invoiceNumber: 'INV-2026-085', customer: 'Acme Corporation', date: '2026-05-10', due: '2026-06-10', status: 'paid', amount: 2289.84 },
  { id: '2', invoiceNumber: 'INV-2026-084', customer: 'TechBridge LLC', date: '2026-05-11', due: '2026-06-11', status: 'paid', amount: 2858.80 },
  { id: '3', invoiceNumber: 'INV-2026-083', customer: 'Sarah Johnson', date: '2026-05-12', due: '2026-06-12', status: 'unpaid', amount: 140.78 },
  { id: '4', invoiceNumber: 'INV-2026-082', customer: 'Global Industries', date: '2026-05-13', due: '2026-06-13', status: 'overdue', amount: 15804.00 }
]

export default function Invoices() {
  const [search, setSearch] = useState('')
  const filtered = mockInvoices.filter(inv =>
    inv.customer.toLowerCase().includes(search.toLowerCase()) ||
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">Review billings, invoice status, and due dates.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs">
            <Download className="h-4 w-4" /> Export Invoices
          </button>
          <button className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-main text-white text-sm font-semibold hover:opacity-90 transition-colors shadow-sm">
            <Plus className="h-4 w-4" /> Issue Invoice
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search invoices..."
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
            <TableHead>Invoice ID</TableHead>
            <TableHead>Billed To</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-mono font-bold text-gray-800">{inv.invoiceNumber}</TableCell>
              <TableCell className="font-semibold text-gray-700">{inv.customer}</TableCell>
              <TableCell>{inv.date}</TableCell>
              <TableCell>{inv.due}</TableCell>
              <TableCell className="text-right font-bold text-gray-900">{formatCurrency(inv.amount)}</TableCell>
              <TableCell>
                <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'destructive' : 'warning'}>
                  {inv.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
