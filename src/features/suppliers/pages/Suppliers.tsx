import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/table'
import { Badge } from '@/shared/components/badge'
import { Input } from '@/shared/components/input'
import { Search, Plus, Filter, Download } from 'lucide-react'

const mockSuppliers = [
  { id: '1', name: 'Global Logistics Solutions', contact: 'Alice Green', email: 'alice@globallogistics.com', phone: '+1-555-8888', category: 'Shipping', status: 'active', items: 25 },
  { id: '2', name: 'Apex Component Parts', contact: 'Marcus Stone', email: 'marcus@apexcomponents.com', phone: '+1-555-7777', category: 'Hardware', status: 'active', items: 114 },
  { id: '3', name: 'Z-Tech Memory & Electronics', contact: 'Kenji Sato', email: 'sato@ztech.co.jp', phone: '+81-3-5555', category: 'Electronics', status: 'active', items: 12 },
  { id: '4', name: 'Pioneer Packaging Corp', contact: 'Sarah Miller', email: 'smiller@pioneerpkg.com', phone: '+1-555-6666', category: 'Accessories', status: 'inactive', items: 8 }
]

export default function Suppliers() {
  const [search, setSearch] = useState('')
  const filtered = mockSuppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contact.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Suppliers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage external partners, manufacturers, and contacts.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs">
            <Download className="h-4 w-4" /> Export Partners
          </button>
          <button className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-main text-white text-sm font-semibold hover:opacity-90 transition-colors shadow-sm">
            <Plus className="h-4 w-4" /> Add Partner
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search suppliers..."
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
            <TableHead>Supplier Company</TableHead>
            <TableHead>Primary Contact</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Active SKUs</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((s) => (
            <TableRow key={s.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800">{s.name}</span>
                  <span className="text-xs text-gray-400">{s.phone}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">{s.contact}</span>
                  <span className="text-xs text-gray-400">{s.email}</span>
                </div>
              </TableCell>
              <TableCell>{s.category}</TableCell>
              <TableCell className="text-right font-semibold text-gray-700">{s.items}</TableCell>
              <TableCell>
                <Badge variant={s.status === 'active' ? 'success' : 'secondary'}>
                  {s.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
