import React, { useState } from 'react'
import { mockProducts } from '@/shared/constants/mockData'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/table'
import { Badge } from '@/shared/components/badge'
import { Input } from '@/shared/components/input'
import { Search, Plus, Filter, Download, AlertTriangle } from 'lucide-react'
import { formatCurrency } from '@/shared/utils/utils'

export default function Inventory() {
  const [search, setSearch] = useState('')
  const filtered = mockProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Control stock levels, warehouses, and reorder points.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs">
            <Download className="h-4 w-4" /> Export Stock
          </button>
          <button className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-main text-white text-sm font-semibold hover:opacity-90 transition-colors shadow-sm">
            <Plus className="h-4 w-4" /> Adjust Stock
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search stock list..."
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
            <TableHead>Item</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead className="text-right">Stock Level</TableHead>
            <TableHead className="text-right">Min Level</TableHead>
            <TableHead className="text-right">Cost Value</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((item) => {
            const isLow = item.stock <= item.minStock
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{item.name}</span>
                    <span className="text-xs text-gray-400">{item.category}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                <TableCell>Warehouse A</TableCell>
                <TableCell className="text-right font-semibold">
                  <span className={isLow ? 'text-rose-600 font-bold flex items-center justify-end gap-1' : ''}>
                    {isLow && <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />}
                    {item.stock} {item.unit}
                  </span>
                </TableCell>
                <TableCell className="text-right text-gray-400">{item.minStock} {item.unit}</TableCell>
                <TableCell className="text-right font-medium text-gray-900">{formatCurrency(item.cost * item.stock)}</TableCell>
                <TableCell>
                  <Badge variant={isLow ? 'destructive' : 'success'}>
                    {isLow ? 'Low Stock' : 'In Stock'}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
