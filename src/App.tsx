import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { DisciplinesSection } from './components/DisciplinesSection';
import { PricingSection } from './components/PricingSection';
import { LifecycleSection } from './components/LifecycleSection';
import { TermsSection } from './components/TermsSection';
import { IntakeConsoleSection } from './components/IntakeConsoleSection';
import { Footer } from './components/Footer';
import { SpecModal } from './components/SpecModal';
import { AuthModal } from './components/AuthModal';
import { PrivacyModal } from './components/PrivacyModal';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { BusinessDashboard } from './components/dashboards/BusinessDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { PaymentResult } from './components/PaymentResult';
import { DISCIPLINES, PRICING_TIERS, LIFECYCLE_PHASES, GOVERNANCE_TERMS } from './data/studioData';
import { Discipline, DisciplineId, PricingMode, User } from './types';
import { api } from './services/api';

export default function App() {
  const [selectedSpec, setSelectedSpec] = useState<Discipline | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  const [prefilledDiscipline, setPrefilledDiscipline] = useState<DisciplineId>('web');
  const [prefilledEntity, setPrefilledEntity] = useState<'business' | 'student' | 'individual'>('business');
  const [prefilledTier, setPrefilledTier] = useState<string>('');

  // Detect PayMongo return redirect: /payment/success|failed?project_id=N
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const paymentMatch = path.match(/^\/payment\/(success|failed)/);
  const paymentStatus = paymentMatch ? (paymentMatch[1] as 'success' | 'failed') : null;
  const paymentProjectId =
    typeof window !== 'undefined'
      ? Number(new URLSearchParams(window.location.search).get('project_id')) || null
      : null;

  useEffect(() => {
    const user = api.auth.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handlePaymentReturn = () => {
    // Clean the URL back to root and open the dashboard.
    window.history.replaceState({}, '', '/');
    if (api.auth.getCurrentUser()) {
      setDashboardOpen(true);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSpec = (discipline: Discipline) => {
    setSelectedSpec(discipline);
  };

  const handleSelectForCommission = (disciplineId: DisciplineId) => {
    setSelectedSpec(null);
    setPrefilledDiscipline(disciplineId);
    setTimeout(() => {
      scrollTo('inquiry');
    }, 100);
  };

  const handleSelectTier = (tierId: string, mode: PricingMode) => {
    const tier = PRICING_TIERS.find((t) => t.id === tierId);
    setPrefilledTier(tier ? tier.title : tierId);
    setPrefilledEntity(mode === 'student' ? 'student' : 'business');
    if (tierId === 'robotics') {
      setPrefilledDiscipline('robotics');
    } else if (tierId === 'prototype') {
      setPrefilledDiscipline('web');
    } else {
      setPrefilledDiscipline('ai');
    }
    scrollTo('inquiry');
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setDashboardOpen(true);
  };

  const handleLogout = () => {
    api.auth.logout();
    setCurrentUser(null);
    setDashboardOpen(false);
  };

  // PayMongo return page: render the payment result instead of the landing page.
  if (paymentStatus) {
    return (
      <PaymentResult
        status={paymentStatus}
        projectId={paymentProjectId}
        onReturn={handlePaymentReturn}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] font-sans antialiased selection:bg-[#333538] selection:text-white flex flex-col">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onOpenSignIn={() => setAuthModalOpen(true)}
        onOpenCommission={() => scrollTo('inquiry')}
        onOpenDashboard={() => setDashboardOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="w-full pt-16 flex-grow flex flex-col">
        {/* 1. Hero Section */}
        <HeroSection
          onRequestCommission={() => scrollTo('inquiry')}
          onExploreDisciplines={() => scrollTo('disciplines')}
        />

        {/* 2. Four Core Disciplines Showcase */}
        <DisciplinesSection
          disciplines={DISCIPLINES}
          onSelectSpec={handleSelectSpec}
        />

        {/* 3. Triple Pricing Tiers with Interactive Switch */}
        <PricingSection
          tiers={PRICING_TIERS}
          onSelectTier={handleSelectTier}
        />

        {/* 4. Engineering Lifecycle */}
        <LifecycleSection
          phases={LIFECYCLE_PHASES}
        />

        {/* 5. Terms of Commission & Governance */}
        <TermsSection
          terms={GOVERNANCE_TERMS}
        />

        {/* 6. Commission Intake Console & Inquiry Terminal */}
        <IntakeConsoleSection
          prefilledDiscipline={prefilledDiscipline}
          prefilledEntity={prefilledEntity}
          prefilledTier={prefilledTier}
          currentUser={currentUser}
          onAuthSuccess={handleAuthSuccess}
          onLogout={handleLogout}
          onRegisterClick={() => setAuthModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={scrollTo}
        onOpenPrivacy={() => setPrivacyOpen(true)}
      />

      {/* Interactive Modals */}
      <SpecModal
        discipline={selectedSpec}
        onClose={() => setSelectedSpec(null)}
        onSelectForCommission={handleSelectForCommission}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <PrivacyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />

      {/* Dedicated Minimalist Dashboards */}
      {dashboardOpen && currentUser && (
        currentUser.role === 'admin' ? (
          <AdminDashboard
            user={currentUser}
            onLogout={handleLogout}
            onClose={() => setDashboardOpen(false)}
          />
        ) : currentUser.role === 'student' ? (
          <StudentDashboard
            user={currentUser}
            onLogout={handleLogout}
            onClose={() => setDashboardOpen(false)}
          />
        ) : (
          <BusinessDashboard
            user={currentUser}
            onLogout={handleLogout}
            onClose={() => setDashboardOpen(false)}
          />
        )
      )}
    </div>
  );
}
