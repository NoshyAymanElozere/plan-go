import React, { useState } from 'react'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ColDef } from 'ag-grid-community'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/card'
import { Button } from '@/shared/components/button'
import { SearchInput } from '@/shared/components/input'
import ModalStatus from '@/shared/components/modal-status'
import { GenericDataGrid } from '@/shared/components/GenericDataGrid'
import {
  useCitiesList,
  useCreateCity,
  useUpdateCity,
  useDeleteCity,
  useToggleCityStatus
} from '../../api/useCities'
import { CitiesFormModal } from './CitiesFormModal'

export default function CitiesPage() {
  const { t, i18n } = useTranslation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const label = t('cities') || 'Cities'

  const { data: paginatedData, isLoading } = useCitiesList(page, undefined, search)
  const items = paginatedData?.data || []

  const createMutation = useCreateCity()
  const updateMutation = useUpdateCity()
  const deleteMutation = useDeleteCity()
  const toggleMutation = useToggleCityStatus()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deletingItem, setDeletingItem] = useState<any | null>(null)

  const handleSave = (formData: any) => {
    const payload = {
      country_id: Number(formData.country_id),
      is_active: formData.is_active,
      translations: [
        { language_id: 1, name: formData.nameEn },
        { language_id: 2, name: formData.nameAr }
      ]
    }

    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data: payload },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setEditingItem(null)
          }
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }

  const columnDefs: ColDef[] = [
    {
      headerName: t('arabicName') || 'Arabic Name',
      valueGetter: (params) => {
        return params.data?.translations?.find((trans: any) => trans.language_id === 2)?.name || ''
      },
      filter: true,
      flex: 1
    },
    {
      headerName: t('englishName') || 'English Name',
      valueGetter: (params) => {
        return params.data?.translations?.find((trans: any) => trans.language_id === 1)?.name || params.data?.name || ''
      },
      filter: true,
      flex: 1
    },
    {
      headerName: 'Country',
      valueGetter: (params) => {
        const country = params.data?.country
        if (!country) return '-'
        return country.translations?.find((trans: any) => trans.language_id === (i18n.language === 'ar' ? 2 : 1))?.name || country.name || '-'
      },
      filter: true,
      flex: 1
    },
    {
      headerName: 'Status',
      field: 'is_active',
      width: 150,
      cellRenderer: (params: any) => {
        const item = params.data
        if (!item) return null
        return (
          <button
            onClick={() => toggleMutation.mutate(item.id)}
            disabled={toggleMutation.isPending}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
              item.is_active
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            {item.is_active ? 'Active' : 'Inactive'}
          </button>
        )
      }
    },
    {
      headerName: 'Actions',
      width: 120,
      cellClass: 'flex items-center justify-end h-full',
      cellRenderer: (params: any) => {
        const item = params.data
        if (!item) return null
        return (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setEditingItem(item)
                setIsModalOpen(true)
              }}
            >
              <Pencil className="h-4 w-4 text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setDeletingItem(item)}
            >
              <Trash2 className="h-4 w-4 text-rose-500" />
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50 px-6 py-5">
        <CardTitle className="text-lg font-bold text-gray-800">{label}</CardTitle>
        <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="h-9 px-4 rounded-xl">
          <Plus className="mr-2 h-4 w-4" /> {t('add') || 'Add New'}
        </Button>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="flex max-w-sm">
          <SearchInput
            placeholder={`${t('search') || 'Search'} ${label}...`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>

        <div className="rounded-xl border border-border/60 overflow-hidden bg-white">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Loading cities...</div>
          ) : (
            <GenericDataGrid rowData={items} columnDefs={columnDefs} rowHeight={50} headerHeight={46} />
          )}
        </div>

        {/* Basic Pagination Controls */}
        {paginatedData?.last_page > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <span className="text-sm text-gray-500">
              Page {paginatedData.current_page} of {paginatedData.last_page}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === paginatedData.last_page}
                onClick={() => setPage((p) => Math.min(p + 1, paginatedData.last_page))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <CitiesFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingItem={editingItem}
        onSave={handleSave}
        loading={createMutation.isPending || updateMutation.isPending}
        label={label}
      />

      <ModalStatus
        open={!!deletingItem}
        onOpenChange={(v) => !v && setDeletingItem(null)}
        title={`${t('delete') || 'Delete'} ${label}`}
        description="Are you sure you want to delete this item? This action cannot be undone."
        agreeLabel={t('delete') || 'Delete'}
        cancelLabel={t('cancel') || 'Cancel'}
        onAgreeButtonClick={() => {
          if (deletingItem) {
            deleteMutation.mutate(deletingItem.id, {
              onSuccess: () => setDeletingItem(null)
            })
          }
        }}
        onCancelButtonClick={() => setDeletingItem(null)}
        loading={deleteMutation.isPending}
      />
    </Card>
  )
}
