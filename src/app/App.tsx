import { Layout } from '@/shared/layouts/Layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Direct component imports
import Analytics from '@/features/analytics/pages/Analytics'
import Customers from '@/features/customers/pages/Customers'
import Dashboard from '@/features/dashboard/pages/Dashboard'
import Help from '@/features/help/pages/Help'
import Inventory from '@/features/inventory/pages/Inventory'
import Invoices from '@/features/invoices/pages/Invoices'
import Orders from '@/features/orders/pages/Orders'
import Payments from '@/features/payments/pages/Payments'
import Products from '@/features/products/pages/Products'
import Reports from '@/features/reports/pages/Reports'
import Settings from '@/features/settings/pages/Settings'
import Suppliers from '@/features/suppliers/pages/Suppliers'

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
    <h2 className="text-2xl font-semibold opacity-50">{title}</h2>
    <p className="text-muted-foreground">This page is under construction.</p>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
          <Route path="*" element={<Placeholder title="404 Not Found" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App


