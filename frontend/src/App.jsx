import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';

import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import StatesPage from './pages/StatesPage';
import StateDetailPage from './pages/StateDetailPage';
import HiddenGemsPage from './pages/HiddenGemsPage';
import TripPlannerPage from './pages/TripPlannerPage';
import BudgetCalculatorPage from './pages/BudgetCalculatorPage';
import CultureExplorerPage from './pages/CultureExplorerPage';
import InteractiveMapPage from './pages/InteractiveMapPage';
import SavedItemsPage from './pages/SavedItemsPage';

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#090A0B] text-[#DADCD3]">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 relative overflow-x-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/destinations" element={<PageTransition><DestinationsPage /></PageTransition>} />
            <Route path="/destinations/:id" element={<PageTransition><DestinationDetailPage /></PageTransition>} />
            <Route path="/states" element={<PageTransition><StatesPage /></PageTransition>} />
            <Route path="/states/:stateId" element={<PageTransition><StateDetailPage /></PageTransition>} />
            <Route path="/hidden-gems" element={<PageTransition><HiddenGemsPage /></PageTransition>} />
            <Route path="/plan-trip" element={<PageTransition><TripPlannerPage /></PageTransition>} />
            <Route path="/budget-calculator" element={<PageTransition><BudgetCalculatorPage /></PageTransition>} />
            <Route path="/culture" element={<PageTransition><CultureExplorerPage /></PageTransition>} />
            <Route path="/map" element={<PageTransition><InteractiveMapPage /></PageTransition>} />
            <Route path="/saved" element={<PageTransition><SavedItemsPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <AuthModal />
    </div>
  );
}
