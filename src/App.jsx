import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import Login from "./Pages/LoginPage/Login";
import Signup from "./Pages/SignUpPage/SignUp";
import { ContactPage } from "./Pages/ContactUsPage/ContactUs";
import { AboutPage } from "./Pages/AboutUsPage/AboutUs";
import { CalculatorsPage } from "./Pages/CalculatorPage/CalculatorPage";
import NetWorkingCapitalPage from "./Pages/CalculatorPage/NetWorkingCapitalPage.jsx";
import DealAffordabilityPage from "./Pages/CalculatorPage/DealAffordabilityPage.jsx";
import ExitValuePage from "./Pages/CalculatorPage/ExitValuePage.jsx";
import BuyingPowerPage from "./Pages/CalculatorPage/BuyingPowerPage.jsx";
import MarketplacePage from "./Pages/MarketplacePage/MarketplacePage.jsx";
import ListingDetailPage from "./Pages/ListingDetailPage/ListingDetailPage.jsx";
import SellerDashboardPage from "./Pages/SellerDashboardPage/SellerDashboardPage.jsx";
import AcquisitionsPage from "./Pages/AcquisitionsPage/AcquisitionsPage.jsx";
import DealRoomPage from "./Pages/DealRoomPage/DealRoomPage.jsx";
import MessagesPage from "./Pages/MessagesPage/MessagesPage.jsx";
import ListBusinessPage from "./Pages/ListBusinessPage/ListBusinessPage.jsx";
import ProfilePage from "./Pages/ProfilePage/ProfilePage.jsx";
import FavoritesPage from "./Pages/FavoritesPage/FavoritesPage.jsx";
import AdminReviewsPage from "./Pages/AdminReviewsPage/AdminReviewsPage.jsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.jsx";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/calculators" element={<CalculatorsPage />} />
        <Route path="/calculators/net-working-capital" element={<NetWorkingCapitalPage />} />
        <Route path="/calculators/deal-affordability" element={<DealAffordabilityPage />} />
        <Route path="/calculators/exit-value" element={<ExitValuePage />} />
        <Route path="/calculators/buying-power" element={<BuyingPowerPage />} />
        <Route path="/market-place" element={<MarketplacePage />} />
        <Route path="/listings/:id" element={<ListingDetailPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/seller-dashboard" element={<SellerDashboardPage />} />
        <Route path="/acquisitions" element={<AcquisitionsPage />} />
        <Route path="/deal-room/:dealId" element={<DealRoomPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/list-my-business" element={<ListBusinessPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/admin/reviews" element={<AdminReviewsPage />} />
      </Routes>
    </>
  );
}

export default App;
