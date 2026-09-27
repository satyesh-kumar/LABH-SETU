import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import FindSchemesPage from './pages/FindSchemesPage';
import CheckEligibilityPage from './pages/CheckEligibilityPage';
import EligibilityResultsPage from './pages/EligibilityResultsPage';
import SchemeDetailPage from './pages/SchemeDetailPage';
import DocumentReadinessPage from './pages/DocumentReadinessPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ApplicationPathwayPage from './pages/ApplicationPathwayPage';
import AssistantPage from './pages/AssistantPage';
import HelpPage from './pages/HelpPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/find-schemes" element={<FindSchemesPage />} />
          <Route path="/check-eligibility" element={<CheckEligibilityPage />} />
          <Route path="/results" element={<EligibilityResultsPage />} />
          <Route path="/schemes/:id" element={<SchemeDetailPage />} />
          <Route path="/documents" element={<DocumentReadinessPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/pathway/:applicationId" element={<ApplicationPathwayPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route
            path="*"
            element={
              <div className="max-w-xl mx-auto py-24 text-center space-y-4">
                <h1 className="text-3xl font-extrabold text-slate-900">404 - Page Not Found</h1>
                <p className="text-sm text-slate-500">The requested public page does not exist or has been relocated.</p>
                <a href="/" className="inline-block px-4 py-2 bg-gov-600 text-white rounded-md text-sm font-medium">Return to Home</a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
