import React, { useState } from 'react'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/card'
import { Button } from '@/shared/components/button'
import { SearchInput } from '@/shared/components/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty, TableSkeleton
} from '@/shared/components/table'
import ModalStatus from '@/shared/components/modal-status'
import {
  useSettingsList,
  useCreateSettingsItem,
  useUpdateSettingsItem,
  useDeleteSettingsItem
} from '../../api/useSettings'
import { PropertyTypesFormModal } from './PropertyTypesFormModal'

export default function PropertyTypesPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const label = t('propertyTypes') || 'PropertyTypes'
  const { data: items = [], isLoading } = useSettingsList('propertytypes', search)

  const createMutation = useCreateSettingsItem('propertytypes')
  const updateMutation = useUpdateSettingsItem('propertytypes')
  const deleteMutation = useDeleteSettingsItem('propertytypes')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deletingItem, setDeletingItem] = useState<any | null>(null)

  const handleSave = (formData: any) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data: formData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setEditingItem(null)
          }
        }
      )
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }

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
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('arabicName') || 'Arabic Name'}</TableHead>
                <TableHead>{t('englishName') || 'English Name'}</TableHead>
                <TableHead>{t('description') || 'Description'}</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rows={4} cols={4} />
              ) : items.length === 0 ? (
                <TableEmpty message="No items found." />
              ) : (
                items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold text-gray-800">{item.nameAr}</TableCell>
                    <TableCell className="font-semibold text-gray-800">{item.nameEn}</TableCell>
                    <TableCell className="text-gray-500">{item.descEn || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="ghost" size="icon-sm" onClick={() => { setEditingItem(item); setIsModalOpen(true); }}>
                          <Pencil className="h-4.5 w-4.5 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => setDeletingItem(item)}>
                          <Trash2 className="h-4.5 w-4.5 text-rose-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <PropertyTypesFormModal
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
