import { Button } from '@/shared/components/button'
import { StatusDropdown } from '@/shared/components/StatusDropdown'
import { ColDef } from 'ag-grid-community'
import { Pencil, Trash2, Eye, ImageIcon, Info } from 'lucide-react'

interface ColumnDefsProps {
  t: (key: string) => string
  i18n: any
  toggleMutation: any
  navigate: (path: string) => void
  setDeletingItem: (item: any) => void
}

export function getTravelPackagesColumnDefs({
  t,
  i18n,
  toggleMutation,
  navigate,
  setDeletingItem
}: ColumnDefsProps): ColDef[] {
  return [
    {
      headerName: t('image') || 'Image',
      filter: false,
      width: 80,
      cellRenderer: (params: any) => {
        const url = params.data?.image_url || params.data?.image?.file_path
        return (
          <div className="flex items-center justify-center h-full w-full py-1">
            {url ? (
              <img src={url} alt="package" className="h-8 w-8 object-cover rounded-lg border border-border" />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-border">
                <ImageIcon className="h-4 w-4" />
              </div>
            )}
          </div>
        )
      }
    },
    {
      headerName: t('arabicName') || 'Arabic Name',
      valueGetter: (params) => {
        return params.data?.translations?.find((trans: any) => trans.language_id === 2)?.name || ''
      },
      filter: false,
      flex: 1
    },
    {
      headerName: t('englishName') || 'English Name',
      valueGetter: (params) => {
        return params.data?.translations?.find((trans: any) => trans.language_id === 1)?.name || params.data?.name || ''
      },
      filter: false,
      flex: 1
    },
    {
      headerName: t('finalPrice') || 'Final Price',
      filter: false,
      width: 150,
      cellRenderer: (params: any) => {
        const data = params.data
        if (!data) return null
        return (
          <div className="flex items-center gap-1.5 h-full">
            <span className="font-semibold text-foreground">{data.final_price}</span>
            {data.is_custom_price_used && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold">
                <Info className="h-3 w-3" />
                {t('overrideActive') || 'Override'}
              </span>
            )}
          </div>
        )
      }
    },
    {
      headerName: t('duration') || 'Duration',
      field: 'duration',
      filter: false,
      flex: 1
    },
    {
      headerName: t('status') || 'Status',
      field: 'is_active',
      filter: 'agSetColumnFilter',
      filterParams: {
        valueFormatter: (params: any) => (params.value ? t('active') || 'Active' : t('inactive') || 'Inactive')
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
      headerName: t('actions') || 'Actions',
      filter: false,
      width: 150,
      cellClass: 'flex items-center justify-start h-full',
      cellRenderer: (params: any) => {
        const item = params.data
        if (!item) return null
        return (
          <div className="flex items-center justify-start gap-1.5">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                navigate(`/settings/travelpackages/${item.id}`)
              }}
            >
              <Eye className="h-4 w-4 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                navigate(`/settings/travelpackages/${item.id}/edit`)
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
