/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EmergencyBanner } from './components/EmergencyBanner';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { HealthGuidance } from './components/HealthGuidance';
import { FacilityFinder } from './components/FacilityFinder';
import { ReportExplainer } from './components/ReportExplainer';
import { RemindersManager } from './components/RemindersManager';
import { AboutPage } from './components/AboutPage';
import { Footer } from './components/Footer';
import { LanguageWelcomeModal } from './components/LanguageWelcomeModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);
  const [urgentTrigger, setUrgentTrigger] = useState<{
    isOpen: boolean;
    reason?: string;
    action?: string;
  }>({
    isOpen: false,
  });

  const handleOpenEmergency = () => {
    setUrgentTrigger({
      isOpen: true,
      reason: 'User activated emergency protocol.',
      action: 'If you or someone around you needs urgent medical help, call 112 immediately.',
    });
  };

  const handleCloseUrgent = () => {
    setUrgentTrigger({ isOpen: false });
  };

  const handleTriggerEmergencyFromChat = (reason: string, action?: string) => {
    setUrgentTrigger({
      isOpen: true,
      reason,
      action: action || 'Please dial 112 immediately or proceed to the nearest emergency department.',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Universal Emergency & Disclaimer Strip */}
      <EmergencyBanner
        urgentTrigger={urgentTrigger}
        onCloseUrgent={handleCloseUrgent}
      />

      {/* Primary Sticky Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergency={handleOpenEmergency}
      />

      {/* Main Routed Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeHero
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenEmergency={handleOpenEmergency}
          />
        )}

        {activeTab === 'guidance' && (
          <HealthGuidance
            onNavigateToFacilities={() => {
              setActiveTab('facilities');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onTriggerEmergency={handleTriggerEmergencyFromChat}
          />
        )}

        {activeTab === 'facilities' && <FacilityFinder />}

        {activeTab === 'explainer' && <ReportExplainer />}

        {activeTab === 'reminders' && <RemindersManager />}

        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Footer with Mandatory Disclaimers */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenEmergency={handleOpenEmergency}
        onOpenLanguageModal={() => setShowLanguageModal(true)}
      />

      {/* First-Visit / Explicit Language Selector Modal */}
      <LanguageWelcomeModal
        forceOpen={showLanguageModal}
        onCloseModal={() => setShowLanguageModal(false)}
      />
    </div>
  );
}
