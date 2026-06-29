import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { HorizontalTabs } from '../components/HorizontalTabs'

// Import Tab Components
import CountriesTab from '../components/tabs/CountriesTab'
import CitiesTab from '../components/tabs/CitiesTab'
import CurrenciesTab from '../components/tabs/CurrenciesTab'
import TripTypesTab from '../components/tabs/TripTypesTab'
import TravelerTypesTab from '../components/tabs/TravelerTypesTab'
import HotelCategoriesTab from '../components/tabs/HotelCategoriesTab'
import GroundServicesTab from '../components/tabs/GroundServicesTab'
import FacilitiesTab from '../components/tabs/FacilitiesTab'
import PropertyTypesTab from '../components/tabs/PropertyTypesTab'
import RatingsTab from '../components/tabs/RatingsTab'
import AboutUsTab from '../components/tabs/AboutUsTab'
import PrivacyPolicyTab from '../components/tabs/PrivacyPolicyTab'
import TermsConditionsTab from '../components/tabs/TermsConditionsTab'
import SupportTab from '../components/tabs/SupportTab'
import FooterTab from '../components/tabs/FooterTab'

export default function Settings() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('countries')

  // Define modules list for tabs trigger
  const tabsList = [
    { value: 'countries', label: t('countries') || 'Countries', component: <CountriesTab /> },
    { value: 'cities', label: t('cities') || 'Cities', component: <CitiesTab /> },
    { value: 'currencies', label: t('currencies') || 'Currencies', component: <CurrenciesTab /> },
    { value: 'triptypes', label: t('tripTypes') || 'Trip Types', component: <TripTypesTab /> },
    { value: 'travelertypes', label: t('travelerTypes') || 'Traveler Types', component: <TravelerTypesTab /> },
    { value: 'hotelcategories', label: t('hotelCategories') || 'Hotel Categories', component: <HotelCategoriesTab /> },
    { value: 'groundservices', label: t('groundServices') || 'Ground Services', component: <GroundServicesTab /> },
    { value: 'facilities', label: t('facilities') || 'Facilities', component: <FacilitiesTab /> },
    { value: 'propertytypes', label: t('propertyTypes') || 'Property Types', component: <PropertyTypesTab /> },
    { value: 'ratings', label: t('ratings') || 'Ratings', component: <RatingsTab /> },
    { value: 'aboutus', label: t('aboutUs') || 'About Us', component: <AboutUsTab /> },
    { value: 'privacypolicy', label: t('privacyPolicy') || 'Privacy Policy', component: <PrivacyPolicyTab /> },
    { value: 'termsconditions', label: t('termsConditions') || 'Terms & Conditions', component: <TermsConditionsTab /> },
    { value: 'support', label: t('support') || 'Support', component: <SupportTab /> },
    { value: 'footer', label: t('footer') || 'Footer', component: <FooterTab /> }
  ]

  const activeModule = tabsList.find((tab) => tab.value === activeTab)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t('settings') || 'Settings'}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {t('settingsSubtitle') || 'Configure lookup tables, legal documents, policies, and contact channels.'}
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full">
        {/* Reusable Horizontal Tabs Component */}
        <HorizontalTabs
          tabs={tabsList.map((tab) => ({ label: tab.label, value: tab.value }))}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Content Panel rendering selected Tab component */}
        <div className="space-y-6 w-full animate-fade-in">
          {activeModule ? activeModule.component : null}
        </div>
      </div>
    </div>
  )
}
