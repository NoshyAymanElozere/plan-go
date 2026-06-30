import { Button } from '@/shared/components/button'
import { StatusDropdown } from '@/shared/components/StatusDropdown'
import { ColDef } from 'ag-grid-community'
import { Pencil, Trash2 } from 'lucide-react'

interface ColumnDefsProps {
    t: (key: string) => string
    toggleMutation: any
    setEditingItem: (item: any) => void
    setIsModalOpen: (open: boolean) => void
    setDeletingItem: (item: any) => void
}

export function getCountriesColumnDefs({
    t,
    toggleMutation,
    setEditingItem,
    setIsModalOpen,
    setDeletingItem
}: ColumnDefsProps): ColDef[] {
    return [
        {
            headerName: t('arabicName') || 'Arabic Name',
            valueGetter: (params) => {
                return params.data?.translations?.find((trans: any) => trans.language_id === 2)?.name || ''
            },
            filter: 'agTextColumnFilter',
            flex: 1
        },
        {
            headerName: t('englishName') || 'English Name',
            valueGetter: (params) => {
                return params.data?.translations?.find((trans: any) => trans.language_id === 1)?.name || params.data?.name || ''
            },
            filter: 'agTextColumnFilter',
            flex: 1
        },
        {
            headerName: 'Code',
            field: 'code',
            filter: 'agTextColumnFilter',
            width: 100
        },
        {
            headerName: 'Status',
            field: 'is_active',
            filter: 'agSetColumnFilter',
            filterParams: {
                valueFormatter: (params: any) => (params.value ? 'Active' : 'Inactive')
            },
            width: 150,
            cellRenderer: (params: any) => {
                const item = params.data
                if (!item) return null
                return (
                    <StatusDropdown
                        value={item.is_active}
                        onChange={() => toggleMutation.mutate(item.id)}
                        disabled={toggleMutation.isPending}
                    />
                )
            }
        },
        {
            headerName: 'Flag Image',
            field: 'image_url',
            filter: false,
            width: 130,
            cellRenderer: (params: any) => {
                const item = params.data
                if (!item || !item.image_url) return <span className="text-gray-300 text-xs">-</span>
                return (
                    <img
                        src={item.image_url}
                        alt="flag"
                        className="h-6 w-10 object-cover rounded border border-gray-100 mt-2"
                    />
                )
            }
        },
        {
            headerName: 'Actions',
            filter: false,
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
}
