import React from 'react'
import { AgGridReact, type AgGridReactProps } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community'
import { useTranslation } from 'react-i18next'
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/utils/utils'

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule])

// Modern theme with light and dark color schemes
const customTheme = themeQuartz
  .withParams({
    browserColorScheme: 'light',
    accentColor: '#7266F0',
    backgroundColor: '#FFFFFF',
    foregroundColor: '#1a1f36',
    borderColor: '#e4e7ec',
    borderRadius: 10,
    headerBackgroundColor: '#f8f9fc',
    headerTextColor: '#64748b',
    headerFontWeight: 600,
    headerFontSize: 13,
    fontSize: 14,
    rowBorder: { color: '#f1f3f9', width: 1, style: 'solid' },
    columnBorder: false,
    rowHoverColor: 'rgba(114, 102, 240, 0.04)',
    selectedRowBackgroundColor: 'rgba(114, 102, 240, 0.08)',
    rangeSelectionBackgroundColor: 'rgba(114, 102, 240, 0.12)',
    cellHorizontalPadding: 16,
    headerColumnResizeHandleColor: '#7266F0',
    fontFamily: "'Cairo', 'Plus Jakarta Sans', sans-serif",
    wrapperBorderRadius: 12,
    spacing: 6,
    oddRowBackgroundColor: '#fafafd',
  }, 'light')
  .withParams({
    browserColorScheme: 'dark',
    accentColor: '#9b8afb',
    backgroundColor: '#0f1629',
    foregroundColor: '#e2e8f0',
    borderColor: '#1e2a4a',
    borderRadius: 10,
    headerBackgroundColor: '#131b32',
    headerTextColor: '#7c8db5',
    headerFontWeight: 600,
    headerFontSize: 13,
    fontSize: 14,
    rowBorder: { color: '#1a2440', width: 1, style: 'solid' },
    columnBorder: false,
    rowHoverColor: 'rgba(155, 138, 251, 0.06)',
    selectedRowBackgroundColor: 'rgba(155, 138, 251, 0.1)',
    rangeSelectionBackgroundColor: 'rgba(155, 138, 251, 0.15)',
    cellHorizontalPadding: 16,
    headerColumnResizeHandleColor: '#9b8afb',
    fontFamily: "'Cairo', 'Plus Jakarta Sans', sans-serif",
    wrapperBorderRadius: 12,
    spacing: 6,
    oddRowBackgroundColor: '#111a30',
  }, 'dark')

const CustomLoadingOverlay = () => {
  return (
    <div className="absolute inset-0 flex flex-col bg-card/60 backdrop-blur-[1px] z-50 p-4">
      <div className="w-full space-y-4 animate-pulse">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex gap-4 items-center py-3 border-b border-border/10">
            <div className="h-4 bg-muted/80 rounded-md flex-1" />
            <div className="h-4 bg-muted/80 rounded-md flex-1" />
            <div className="h-4 bg-muted/80 rounded-md flex-1" />
            <div className="h-4 bg-muted/80 rounded-md flex-1" />
            <div className="h-4 bg-muted/80 rounded-md flex-1" />
          </div>
        ))}
      </div>
    </div>
  )
}

interface GenericDataGridProps<TData = any> extends AgGridReactProps<TData> {
  loading?: boolean
  height?: string | number
  onViewRow?: (data: TData) => void
  isServerSide?: boolean
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  paginationLinks?: Array<{ url: string | null; label: string; active: boolean }>
}

export function GenericDataGrid<TData = any>({
  rowData,
  columnDefs,
  loading = false,
  height = 600,
  onViewRow,
  isServerSide = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  paginationLinks,
  ...props
}: GenericDataGridProps<TData>) {
  const { i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const [gridApi, setGridApi] = React.useState<any>(null)
  const [columns, setColumns] = React.useState<any[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const onGridReady = (params: any) => {
    setGridApi(params.api)
    const allCols = params.api.getColumns() || []
    setColumns(
      allCols.map((col: any) => ({
        id: col.getColId(),
        name: col.getColDef().headerName || col.getColId(),
        visible: col.isVisible()
      }))
    )
    if (props.onGridReady) {
      props.onGridReady(params)
    }
  }

  const toggleColumn = (colId: string) => {
    if (!gridApi) return
    const col = columns.find((c) => c.id === colId)
    if (!col) return
    const nextVisible = !col.visible
    gridApi.setColumnsVisible([colId], nextVisible)
    setColumns((prev) =>
      prev.map((c) => (c.id === colId ? { ...c, visible: nextVisible } : c))
    )
  }

  const defaultColDef = React.useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      filter: true,
      sortable: true,
      resizable: true,
      ...props.defaultColDef
    }
  }, [props.defaultColDef])

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex justify-end relative z-10">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-card text-foreground hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 active:scale-95 shadow-sm"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
            <span>تعديل الأعمدة / Columns</span>
          </button>

          {isOpen && (
            <div className={`absolute top-full mt-2 w-60 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-md p-2.5 shadow-xl shadow-black/10 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${isRtl ? 'left-0' : 'right-0'}`}>
              <div className="px-2.5 py-2 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/80 border-b border-border/40 mb-2">
                إظهار وإخفاء الأعمدة
              </div>
              <div className="max-h-64 overflow-y-auto space-y-0.5 pr-1">
                {columns.map((col) => (
                  <label
                    key={col.id}
                    className="flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-150 cursor-pointer text-xs font-semibold text-foreground/90 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={col.visible}
                      onChange={() => toggleColumn(col.id)}
                      className="accent-[#7266F0] h-4 w-4 rounded-md border-border/60 cursor-pointer"
                    />
                    <span>{col.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full animate-fade-in" style={{ height }}>
        <AgGridReact
          theme={customTheme}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          enableRtl={isRtl}
          loading={loading}
          loadingOverlayComponent={CustomLoadingOverlay}
          pagination={isServerSide ? false : (props.pagination ?? true)}
          paginationPageSize={props.paginationPageSize ?? 10}
          paginationPageSizeSelector={props.paginationPageSizeSelector ?? [10, 20, 50, 100]}
          onGridReady={onGridReady}
          onRowDoubleClicked={(event) => {
            if (onViewRow && event.data) {
              onViewRow(event.data)
            }
            if (props.onRowDoubleClicked) {
              props.onRowDoubleClicked(event)
            }
          }}
          {...props}
        />
      </div>

      {isServerSide && (
        <div className="flex items-center justify-between px-4 py-3 bg-card border border-border/60 rounded-2xl mt-2" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="text-xs font-bold text-muted-foreground">
            {isRtl ? `الصفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
          </div>
          <div className="flex items-center gap-1.5">
            {paginationLinks && paginationLinks.length > 0 ? (
              paginationLinks.map((link, idx) => {
                const isPrev = link.label.includes('Previous') || link.label.includes('&laquo;')
                const isNext = link.label.includes('Next') || link.label.includes('&raquo;')

                let cleanLabel = link.label
                  .replace('&laquo; ', '')
                  .replace(' &raquo;', '')
                  .replace('Previous', '')
                  .replace('Next', '')

                const pageMatch = link.url ? link.url.match(/page=(\d+)/) : null
                const pageNum = pageMatch ? parseInt(pageMatch[1], 10) : null

                return (
                  <button
                    key={idx}
                    onClick={() => pageNum && onPageChange?.(pageNum)}
                    disabled={!link.url}
                    className={cn(
                      "h-8 min-w-8 px-2 flex items-center justify-center rounded-lg border text-xs font-bold transition-all duration-200 disabled:opacity-50",
                      link.active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/60 text-foreground hover:bg-primary/5 hover:border-primary/30"
                    )}
                  >
                    {isPrev ? (
                      isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
                    ) : isNext ? (
                      isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                    ) : (
                      cleanLabel
                    )}
                  </button>
                )
              })
            ) : (
              <>
                <button
                  onClick={() => onPageChange?.(Math.max((currentPage || 1) - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-border/60 text-foreground hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 disabled:opacity-50"
                >
                  {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
                {Array.from({ length: Number(totalPages) || 1 }).map((_, idx) => {
                  const pageNum = idx + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange?.(pageNum)}
                      className={cn(
                        "h-8 min-w-8 px-2 flex items-center justify-center rounded-lg border text-xs font-bold transition-all duration-200",
                        currentPage === pageNum
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border/60 text-foreground hover:bg-primary/5 hover:border-primary/30"
                      )}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  onClick={() => onPageChange?.(Math.min((currentPage || 1) + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-border/60 text-foreground hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 disabled:opacity-50"
                >
                  {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
