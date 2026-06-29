import React, { useState } from 'react'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/card'
import { Button } from '@/shared/components/button'
import { SearchInput } from '@/shared/components/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty, TableSkeleton
} from '@/shared/components/table'
import { BaseInputField } from '@/shared/components/base-input-field'
import ModalStatus from '@/shared/components/modal-status'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useZodForm } from '@/shared/components/form-fields'

import {
  useSettingsList,
  useCreateSettingsItem,
  useUpdateSettingsItem,
  useDeleteSettingsItem
} from '../api/useSettings'

interface CrudModulePanelProps {
  moduleKey: string
  label: string
  schema: any
}

export function CrudModulePanel({ moduleKey, label, schema }: CrudModulePanelProps) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const { data: items = [], isLoading } = useSettingsList(moduleKey, search)

  const createMutation = useCreateSettingsItem(moduleKey)
  const updateMutation = useUpdateSettingsItem(moduleKey)
  const deleteMutation = useDeleteSettingsItem(moduleKey)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deletingItem, setDeletingItem] = useState<any | null>(null)

  const methods = useZodForm(
    schema,
    editingItem || { nameAr: '', nameEn: '', descAr: '', descEn: '' }
  )

  const openAddModal = () => {
    setEditingItem(null)
    methods.reset({ nameAr: '', nameEn: '', descAr: '', descEn: '', countryCode: '', phoneCode: '', flag: '', price: 0 })
    setIsModalOpen(true)
  }

  const openEditModal = (item: any) => {
    setEditingItem(item)
    methods.reset(item)
    setIsModalOpen(true)
  }

  const handleFormSubmit = methods.handleSubmit((formData: any) => {
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
  })

  return (
    <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50 px-6 py-5">
        <div>
          <CardTitle className="text-lg font-bold text-gray-800">{label}</CardTitle>
        </div>
        <Button onClick={openAddModal} className="h-9 px-4 rounded-xl">
          <Plus className="mr-2 h-4 w-4" /> {t('add') || 'Add New'}
        </Button>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Search */}
        <div className="flex max-w-sm">
          <SearchInput
            placeholder={`${t('search') || 'Search'} ${label}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table list */}
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('arabicName') || 'Arabic Name'}</TableHead>
                <TableHead>{t('englishName') || 'English Name'}</TableHead>
                {moduleKey === 'countries' && (
                  <>
                    <TableHead>Code</TableHead>
                    <TableHead>Phone Code</TableHead>
                    <TableHead>Flag</TableHead>
                  </>
                )}
                {moduleKey === 'groundservices' && <TableHead className="text-right">Price</TableHead>}
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rows={4} cols={moduleKey === 'countries' ? 6 : 4} />
              ) : items.length === 0 ? (
                <TableEmpty message="No items found." />
              ) : (
                items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold text-gray-800">{item.nameAr}</TableCell>
                    <TableCell className="font-semibold text-gray-800">{item.nameEn}</TableCell>
                    {moduleKey === 'countries' && (
                      <>
                        <TableCell className="font-mono text-xs">{item.countryCode}</TableCell>
                        <TableCell>{item.phoneCode}</TableCell>
                        <TableCell className="text-lg">{item.flag || '🏳️'}</TableCell>
                      </>
                    )}
                    {moduleKey === 'groundservices' && (
                      <TableCell className="text-right font-bold text-main">
                        ${item.price}
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="ghost" size="icon-sm" onClick={() => openEditModal(item)}>
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

      {/* Add / Edit Form Modal */}
      <ModalStatus
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingItem ? `${t('edit') || 'Edit'} ${label}` : `${t('add') || 'Add'} ${label}`}
        agreeLabel={t('save') || 'Save'}
        cancelLabel={t('cancel') || 'Cancel'}
        onAgreeButtonClick={handleFormSubmit}
        onCancelButtonClick={() => setIsModalOpen(false)}
        loading={createMutation.isPending || updateMutation.isPending}
      >
        <FormProvider {...methods}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <BaseInputField name="nameAr" label="Arabic Name / الاسم بالعربية" required />
              <BaseInputField name="nameEn" label="English Name" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <BaseInputField name="descAr" label="Arabic Description / الوصف بالعربية" />
              <BaseInputField name="descEn" label="English Description" />
            </div>

            {/* Country specifics */}
            {moduleKey === 'countries' && (
              <div className="grid grid-cols-3 gap-4">
                <BaseInputField name="countryCode" label="Country Code (e.g. US)" required />
                <BaseInputField name="phoneCode" label="Phone Code (e.g. +1)" required />
                <BaseInputField name="flag" label="Flag Emoji" placeholder="🇺🇸" />
              </div>
            )}

            {/* Ground services specifics */}
            {moduleKey === 'groundservices' && (
              <div className="max-w-[200px]">
                <BaseInputField type="number" name="price" label="Service Price ($)" required />
              </div>
            )}
          </div>
        </FormProvider>
      </ModalStatus>

      {/* Delete confirmation */}
      <ModalStatus
        open={!!deletingItem}
        onOpenChange={(v) => !v && setDeletingItem(null)}
        title={`${t('delete') || 'Delete'} ${label}`}
        description={`Are you sure you want to delete this item? This action cannot be undone.`}
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
