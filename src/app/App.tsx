import { Layout } from '@/shared/layouts/Layout'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

// Direct component imports
import Analytics from '@/features/analytics/pages/Analytics'
import Dashboard from '@/features/dashboard/pages/Dashboard'
import Help from '@/features/help/pages/Help'
import Reports from '@/features/reports/pages/Reports'
import Settings from '@/features/settings/pages/Settings'
import Login from '@/features/auth/pages/Login'

// Import sub-route pages directly
import CountriesPage from '@/features/settings/pages/countries/CountriesPage'
import CitiesPage from '@/features/settings/pages/cities/CitiesPage'
import CurrenciesPage from '@/features/settings/pages/currencies/CurrenciesPage'
import TripTypesPage from '@/features/settings/pages/triptypes/TripTypesPage'
import TravelerTypesPage from '@/features/settings/pages/travelertypes/TravelerTypesPage'
import HotelCategoriesPage from '@/features/settings/pages/hotelcategories/HotelCategoriesPage'
import GroundServicesPage from '@/features/settings/pages/groundservices/GroundServicesPage'
import FacilitiesPage from '@/features/settings/pages/facilities/FacilitiesPage'
import PropertyTypesPage from '@/features/settings/pages/propertytypes/PropertyTypesPage'
import RatingsPage from '@/features/settings/pages/ratings/RatingsPage'
import AboutUsPage from '@/features/settings/pages/aboutus/AboutUsPage'
import PrivacyPolicyPage from '@/features/settings/pages/privacypolicy/PrivacyPolicyPage'
import TermsConditionsPage from '@/features/settings/pages/termsconditions/TermsConditionsPage'
import SupportPage from '@/features/settings/pages/support/SupportPage'
import FooterPage from '@/features/settings/pages/footer/FooterPage'

import { ProtectedRoute, PublicRoute } from '@/shared/components/RouteGuards'

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
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Placeholder title="Products" />} />
            <Route path="customers" element={<Placeholder title="Customers" />} />
            <Route path="orders" element={<Placeholder title="Orders" />} />
            <Route path="inventory" element={<Placeholder title="Inventory" />} />
            <Route path="suppliers" element={<Placeholder title="Suppliers" />} />
            <Route path="invoices" element={<Placeholder title="Invoices" />} />
            <Route path="payments" element={<Placeholder title="Payments" />} />
            <Route path="reports" element={<Reports />} />
            <Route path="analytics" element={<Analytics />} />
            {/*  start settings routes  */}
            <Route path="settings" element={<Settings />}>
              <Route index element={<Navigate to="countries" replace />} />
              <Route path="countries" element={<CountriesPage />} />
              <Route path="cities" element={<CitiesPage />} />
              <Route path="currencies" element={<CurrenciesPage />} />
              <Route path="triptypes" element={<TripTypesPage />} />
              <Route path="travelertypes" element={<TravelerTypesPage />} />
              <Route path="hotelcategories" element={<HotelCategoriesPage />} />
              <Route path="groundservices" element={<GroundServicesPage />} />
              <Route path="facilities" element={<FacilitiesPage />} />
              <Route path="propertytypes" element={<PropertyTypesPage />} />
              <Route path="ratings" element={<RatingsPage />} />
              <Route path="aboutus" element={<AboutUsPage />} />
              <Route path="privacypolicy" element={<PrivacyPolicyPage />} />
              <Route path="termsconditions" element={<TermsConditionsPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="footer" element={<FooterPage />} />
            </Route>
            {/* end setting routes */}
            <Route path="help" element={<Help />} />
            <Route path="*" element={<Placeholder title="404 Not Found" />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App


