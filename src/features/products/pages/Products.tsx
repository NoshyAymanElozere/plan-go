import React, { useState } from 'react'
import { Plus, Download, Filter, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/button'
import { SearchInput } from '@/shared/components/input'
import { Badge } from '@/shared/components/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty, TableSkeleton,
} from '@/shared/components/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/shared/components/dropdown-menu'
import { Pagination, PageSizeSelector } from '@/shared/components/pagination'
import { ConfirmDialog } from '@/shared/components/dialog'
import { useTableState } from '@/shared/hooks/useTableState'
import { useProducts, useDeleteProduct } from '@/features/products/api/useProducts'
import { formatCurrency, formatDate } from '@/shared/utils/utils'
import type { Product } from '@/shared/types'
import AddProduct from './AddProduct'

export default function Products() {
  // HMR Trigger Comment to force reload
  const [view, setView] = useState<'list' | 'add'>('list')
  const table = useTableState({ sortBy: 'name', sortOrder: 'asc' })
  const { data, isLoading, refetch } = useProducts(table)
  const deleteMutation = useDeleteProduct()

  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)

  const products = data?.data ?? []
  const totalPages = data?.totalPages ?? 1

  if (view === 'add') {
    return (
      <AddProduct
        onBack={() => setView('list')}
        onSuccess={() => {
          setView('list')
          refetch()
        }}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={() => setView('add')}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-xl border border-border/60 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-80">
          <SearchInput
            placeholder="Search products..."
            value={table.search}
            onChange={(e) => table.setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton rows={5} cols={7} />
            ) : products.length === 0 ? (
              <TableEmpty message="No products found matching your search." />
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[250px]">
                        {product.description ?? 'No description'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(product.price)}</TableCell>
                  <TableCell className="text-right">
                    <span className={product.stock <= product.minStock ? 'text-destructive font-semibold' : ''}>
                      {product.stock} {product.unit}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === 'active' ? 'success' :
                        product.status === 'out_of_stock' ? 'destructive' :
                        'secondary'
                      }
                      className="capitalize"
                    >
                      {product.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem danger onClick={() => setDeleteProduct(product)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Container */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="text-sm text-muted-foreground">
          Showing {products.length > 0 ? (table.page - 1) * table.pageSize + 1 : 0} to{' '}
          {Math.min(table.page * table.pageSize, data?.total ?? 0)} of {data?.total ?? 0} entries
        </div>
        <div className="flex items-center gap-6">
          <PageSizeSelector pageSize={table.pageSize} onChange={table.setPageSize} />
          <Pagination page={table.page} totalPages={totalPages} onPageChange={table.setPage} />
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteProduct}
        onOpenChange={(v) => !v && setDeleteProduct(null)}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteProduct?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteProduct) {
            deleteMutation.mutate(deleteProduct.id as string, {
              onSuccess: () => setDeleteProduct(null),
            })
          }
        }}
      />
    </div>
  )
}
