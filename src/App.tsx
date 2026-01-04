import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import SubsidiaryCompanies from "./pages/SubsidiaryCompanies";
import Services from "./pages/Services";
import About from "./pages/About";
import Partnership from "./pages/Partnership";
import Contact from "./pages/Contact";
import Client from "./pages/Client";
import LoginPage from "./components/Auth/Login";
import SignupPage from "./components/Auth/SignUp";
import OTPPage from "./components/Auth/Otp";
import AuthGuard from "./components/Auth/AuthRole";

// Dashboard imports
import AdminDashboard from "./features/admin/AdminDashboard";
import ClientDashboard from "./features/client/ClientDashboard";
import TriPartyDashboard from "./features/triparty/TriPartyDashboard";

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const hideNavigation =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/otp" ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/client/") ||
    location.pathname === "/client" ||
    location.pathname.startsWith("/triparty");

  return (
    <>
      <ScrollToTop />
      {!hideNavigation && <Navigation />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subsidiaries" element={<SubsidiaryCompanies />} />
        <Route path="/services" element={<Services />} />
        <Route path="/clients" element={<Client />} />
        <Route path="/about" element={<About />} />
        <Route path="/partnership" element={<Partnership />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth "*" ROUTE */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/otp" element={<OTPPage />} />

        {/* Dashboard Routes - Admin Portal */}

        <Route element={<AuthGuard allowedRoles={["admin"]} />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>

        {/* Dashboard Routes - Client Portal */}
        <Route element={<AuthGuard allowedRoles={["client"]} />}>
          <Route path="/client/*" element={<ClientDashboard />} />
        </Route>

        {/* Dashboard Routes - Tri-Party Portal (Abdullah Law Firm & Spectrum) */}
        <Route element={<AuthGuard allowedRoles={["triparty"]} />}>
          <Route path="/triparty/*" element={<TriPartyDashboard />} />
        </Route>

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isHomePage && !hideNavigation && <Footer />}
    </>
  );
};

const App = () => (
  <BrowserRouter
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
  >
    <AppContent />
  </BrowserRouter>
);

export default App;
