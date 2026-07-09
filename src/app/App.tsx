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
import TouristDestinationsPage from '@/features/settings/pages/touristdestinations/TouristDestinationsPage'
import TouristDestinationFormPage from '@/features/settings/pages/touristdestinations/TouristDestinationFormPage'
import TouristDestinationDetailsPage from '@/features/settings/pages/touristdestinations/TouristDestinationDetailsPage'

import TravelPackagesPage from '@/features/settings/pages/travelpackages/TravelPackagesPage'
import TravelPackageFormPage from '@/features/settings/pages/travelpackages/TravelPackageFormPage'
import TravelPackageDetailsPage from '@/features/settings/pages/travelpackages/TravelPackageDetailsPage'
import TouristProgramsPage from '@/features/settings/pages/touristprograms/TouristProgramsPage'
import TouristProgramFormPage from '@/features/settings/pages/touristprograms/TouristProgramFormPage'
import TouristProgramDetailsPage from '@/features/settings/pages/touristprograms/TouristProgramDetailsPage'
import GlobalSettingsPage from '@/features/settings/pages/globalsettings/GlobalSettingsPage'

import { ProtectedRoute, PublicRoute } from '@/shared/components/RouteGuards'

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
    <h2 className="text-2xl font-semibold opacity-50">{title}</h2>
    <p className="text-muted-foreground">This page is under construction.</p>
  </div>
)

function App() {
  return (
    <BrowserRouter basename="/plan-go">
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="reports" element={<Reports />} />
            <Route path="analytics" element={<Analytics />} />
            {/*  start settings routes  */}
            <Route path="settings" element={<Settings />}>
              <Route index element={<Navigate to="countries" replace />} />
              <Route path="countries" element={<CountriesPage />} />
               <Route path="cities" element={<CitiesPage />} />
              <Route path="touristprograms" element={<TouristProgramsPage />} />
              <Route path="touristprograms/new" element={<TouristProgramFormPage />} />
              <Route path="touristprograms/:id" element={<TouristProgramDetailsPage />} />
              <Route path="touristprograms/:id/edit" element={<TouristProgramFormPage />} />
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
              <Route path="touristdestinations" element={<TouristDestinationsPage />} />
              <Route path="touristdestinations/new" element={<TouristDestinationFormPage />} />
              <Route path="touristdestinations/:id" element={<TouristDestinationDetailsPage />} />
              <Route path="touristdestinations/:id/edit" element={<TouristDestinationFormPage />} />

              <Route path="travelpackages" element={<TravelPackagesPage />} />
              <Route path="travelpackages/new" element={<TravelPackageFormPage />} />
              <Route path="travelpackages/:id" element={<TravelPackageDetailsPage />} />
              <Route path="travelpackages/:id/edit" element={<TravelPackageFormPage />} />
              <Route path="footer" element={<FooterPage />} />
              <Route path="globalsettings" element={<GlobalSettingsPage />} />
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


