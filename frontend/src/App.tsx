import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import ServiceDetail from "./pages/ServiceDetail";
import EmergencyPlumberNyc from "./pages/EmergencyPlumberNyc";
import EmergencyPlumberBrooklyn from "./pages/EmergencyPlumberBrooklyn";
import Admin from "./pages/Admin";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import { trackPageView } from "./lib/analytics";
import { initAutoClickTracking, trackRoute } from "./lib/track";

/**
 * Fires a GA4 page_view on the initial load and on every client-side route
 * change. Rendered AFTER <Routes /> so the active page's document.title effect
 * has already run by the time this effect reads it — giving accurate
 * page_title reporting per route.
 *
 * Also feeds the first-party pipeline (lib/track.ts → /api/track → Supabase
 * analytics_events): route-level page/service views, quote-form abandon on SPA
 * navigation, and — via the one-time click listener — tel:/sms:/outbound
 * clicks. GA4 is for humans in the GA dashboard; analytics_events is what the
 * co-founder agent reads via SQL.
 */
function RouteChangeTracker() {
  const location = useLocation();

  useEffect(() => {
    initAutoClickTracking();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname, location.search);
    trackRoute(location.pathname);
  }, [location.pathname, location.search]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/24-hour-plumber-nyc" element={<EmergencyPlumberNyc />} />
        <Route path="/emergency-plumber-brooklyn" element={<EmergencyPlumberBrooklyn />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <RouteChangeTracker />
    </BrowserRouter>
  );
}
