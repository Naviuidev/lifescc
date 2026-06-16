import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ContactUsPage from './pages/ContactUsPage.jsx'
import BookAppointmentPage from './pages/BookAppointmentPage.jsx'
import AboutUsPage from './pages/AboutUsPage.jsx'
import FranchisePage from './pages/FranchisePage.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import AdminDashboardHome from './pages/AdminDashboardHome.jsx'
import AdminSlotsPage from './pages/AdminSlotsPage.jsx'
import AdminChatbotUsersPage from './pages/AdminChatbotUsersPage.jsx'
import AdminSiteChatbotPage from './pages/AdminSiteChatbotPage.jsx'
import AdminContactsPage from './pages/AdminContactsPage.jsx'
import AdminSupportPage from './pages/AdminSupportPage.jsx'
import AdminReviewsPage from './pages/AdminReviewsPage.jsx'
import AdminVideosPage from './pages/AdminVideosPage.jsx'
import AdminVideoAddPage from './pages/AdminVideoAddPage.jsx'
import AdminFranchisesPage from './pages/AdminFranchisesPage.jsx'
import AdminServiceVerticalPage from './pages/AdminServiceVerticalPage.jsx'
import AdminBlogsPage from './pages/AdminBlogsPage.jsx'
import AdminBlogSubmissionsPage from './pages/AdminBlogSubmissionsPage.jsx'
import AdminBlogAnalyticsPage from './pages/AdminBlogAnalyticsPage.jsx'
import AdminBlogEditorPage from './pages/AdminBlogEditorPage.jsx'
import BlogListingPage from './pages/BlogListingPage.jsx'
import BlogPostPage from './pages/BlogPostPage.jsx'
import ReviewPage from './pages/ReviewPage.jsx'
import TestimonialsPage from './pages/TestimonialsPage.jsx'
import CoolsculptingPage from './pages/CoolsculptingPage.jsx'
import CryolipolysisPage from './pages/CryolipolysisPage.jsx'
import BmiPage from './pages/BmiPage.jsx'
import HifuLiposonixPage from './pages/HifuLiposonixPage.jsx'
import CoolMiniPage from './pages/CoolMiniPage.jsx'
import FigureCorrectionPage from './pages/FigureCorrectionPage.jsx'
import InchLossPage from './pages/InchLossPage.jsx'
import NonSurgicalLiposuctionPage from './pages/NonSurgicalLiposuctionPage.jsx'
import ZimmerPage from './pages/ZimmerPage.jsx'
import WeightLossTreatmentPage from './pages/WeightLossTreatmentPage.jsx'
import NonSurgicalHairReplacementPage from './pages/NonSurgicalHairReplacementPage.jsx'
import HairRegrowthPage from './pages/HairRegrowthPage.jsx'
import AntiHairFallPage from './pages/AntiHairFallPage.jsx'
import AntiDandruffPage from './pages/AntiDandruffPage.jsx'
import MesotherapyPage from './pages/MesotherapyPage.jsx'
import HairTransplantationTreatmentPage from './pages/HairTransplantationTreatmentPage.jsx'
import SkinTreatmentPage from './pages/SkinTreatmentPage.jsx'
import HydraFacialPage from './pages/HydraFacialPage.jsx'
import AntiAgeingPage from './pages/AntiAgeingPage.jsx'
import MedifacialPage from './pages/MedifacialPage.jsx'
import QlaserPage from './pages/QlaserPage.jsx'
import AcnePimpleTreatmentPage from './pages/AcnePimpleTreatmentPage.jsx'
import LaserHairRemovalPage from './pages/LaserHairRemovalPage.jsx'
import SkinPigmentationPage from './pages/SkinPigmentationPage.jsx'
import SkinTighteningPage from './pages/SkinTighteningPage.jsx'
import SkinLighteningPage from './pages/SkinLighteningPage.jsx'
import StretchMarksPage from './pages/StretchMarksPage.jsx'
import AcneScarPage from './pages/AcneScarPage.jsx'
import AntiTanPage from './pages/AntiTanPage.jsx'
import Program360WeightManagementPage from './pages/Program360WeightManagementPage.jsx'
import ProgramYoungAfter40Page from './pages/ProgramYoungAfter40Page.jsx'
import ProgramGlp1Page from './pages/ProgramGlp1Page.jsx'
import ProgramDiabetesManagementProgrammePage from './pages/ProgramDiabetesManagementProgrammePage.jsx'
import ProgramSuperWomanPage from './pages/ProgramSuperWomanPage.jsx'
import ProgramKidsNutritionPage from './pages/ProgramKidsNutritionPage.jsx'
import SiteChatbotWidget from './components/SiteChatbotWidget.jsx'
import { stripAppBase } from './utils/appBase.js'
import './App.css'

function AppRoutes() {
  const location = useLocation()
  const routePath = stripAppBase(location.pathname)
  const showPublicChatbot = !routePath.startsWith('/admin')
  const [chatbotEnabled, setChatbotEnabled] = useState(null)

  useEffect(() => {
    if (!showPublicChatbot) {
      setChatbotEnabled(null)
      return
    }

    let cancelled = false

    const loadStatus = () => {
      fetch('/api/public/site-chatbot-status')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (cancelled) return
          if (!data) {
            setChatbotEnabled(true)
            return
          }
          setChatbotEnabled(Boolean(data.enabled))
        })
        .catch(() => {
          if (!cancelled) setChatbotEnabled(true)
        })
    }

    loadStatus()
    const onFocus = () => loadStatus()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)

    return () => {
      cancelled = true
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [showPublicChatbot])

  useEffect(() => {
    const hasHash = Boolean(location.hash && location.hash.length > 1)
    if (location.pathname === '/contact-us' && hasHash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname, location.hash])

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/franchise" element={<FranchisePage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/book-an-appointment" element={<BookAppointmentPage />} />
        <Route path="/reviews" element={<ReviewPage />} />
        <Route path="/blog" element={<BlogListingPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/coolsculpting" element={<CoolsculptingPage />} />
        <Route path="/cryolipolysis" element={<CryolipolysisPage />} />
        <Route path="/bmi" element={<BmiPage />} />
        <Route path="/hifu-liposonix" element={<HifuLiposonixPage />} />
        <Route path="/cool-mini" element={<CoolMiniPage />} />
        <Route path="/figure-correction" element={<FigureCorrectionPage />} />
        <Route path="/inch-loss" element={<InchLossPage />} />
        <Route path="/non-surgical-liposuction" element={<NonSurgicalLiposuctionPage />} />
        <Route path="/zimmer" element={<ZimmerPage />} />
        <Route path="/programs/360-weight-management" element={<Program360WeightManagementPage />} />
        <Route path="/programs/young-after-40" element={<ProgramYoungAfter40Page />} />
        <Route path="/programs/glp-1" element={<ProgramGlp1Page />} />
        <Route path="/programs/diabetes-management-programme" element={<ProgramDiabetesManagementProgrammePage />} />
        <Route path="/programs/super-woman" element={<ProgramSuperWomanPage />} />
        <Route path="/programs/kids-nutrition" element={<ProgramKidsNutritionPage />} />
        <Route path="/weight-loss-treatment" element={<WeightLossTreatmentPage />} />
        <Route path="/non-surgical-hair-replacement" element={<NonSurgicalHairReplacementPage />} />
        <Route path="/hair-regrowth" element={<HairRegrowthPage />} />
        <Route path="/anti-hair-fall" element={<AntiHairFallPage />} />
        <Route path="/anti-dandruff" element={<AntiDandruffPage />} />
        <Route path="/mesotherapy" element={<MesotherapyPage />} />
        <Route path="/hair-transplantation-treatment" element={<HairTransplantationTreatmentPage />} />
        <Route path="/hydrafacial" element={<HydraFacialPage />} />
        <Route path="/anti-ageing" element={<AntiAgeingPage />} />
        <Route path="/medifacial" element={<MedifacialPage />} />
        <Route path="/qlaser" element={<QlaserPage />} />
        <Route path="/acne-pimple-treatment" element={<AcnePimpleTreatmentPage />} />
        <Route path="/laser-hair-removal" element={<LaserHairRemovalPage />} />
        <Route path="/skin-pigmentation" element={<SkinPigmentationPage />} />
        <Route path="/skin-tightening" element={<SkinTighteningPage />} />
        <Route path="/skin-lightening" element={<SkinLighteningPage />} />
        <Route path="/stretch-marks" element={<StretchMarksPage />} />
        <Route path="/acne-scar" element={<AcneScarPage />} />
        <Route path="/anti-tan" element={<AntiTanPage />} />
        <Route path="/skin/hydra-facial" element={<Navigate to="/hydrafacial" replace />} />
        <Route path="/skin/hydrafacial" element={<Navigate to="/hydrafacial" replace />} />
        <Route path="/skin/anti-ageing" element={<Navigate to="/anti-ageing" replace />} />
        <Route path="/skin/medifacial" element={<Navigate to="/medifacial" replace />} />
        <Route path="/skin/qlaser" element={<Navigate to="/qlaser" replace />} />
        <Route path="/skin/acne-pimple-treatment" element={<Navigate to="/acne-pimple-treatment" replace />} />
        <Route path="/skin/laser-hair-removal" element={<Navigate to="/laser-hair-removal" replace />} />
        <Route path="/skin/skin-pigmentation" element={<Navigate to="/skin-pigmentation" replace />} />
        <Route path="/skin/skin-tightening" element={<Navigate to="/skin-tightening" replace />} />
        <Route path="/skin/skin-lightening" element={<Navigate to="/skin-lightening" replace />} />
        <Route path="/skin/stretch-marks" element={<Navigate to="/stretch-marks" replace />} />
        <Route path="/skin/acne-scar" element={<Navigate to="/acne-scar" replace />} />
        <Route path="/skin/anti-tan" element={<Navigate to="/anti-tan" replace />} />
        <Route path="/skin/:slug" element={<SkinTreatmentPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardHome />} />
          <Route path="slots" element={<AdminSlotsPage />} />
          <Route path="chatbot-users" element={<AdminChatbotUsersPage />} />
          <Route path="site-chatbot" element={<AdminSiteChatbotPage />} />
          <Route path="franchises" element={<AdminFranchisesPage />} />
          <Route path="contacts" element={<AdminContactsPage />} />
          <Route path="services/:vertical" element={<AdminServiceVerticalPage />} />
          <Route path="support" element={<AdminSupportPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="videos/add" element={<AdminVideoAddPage />} />
          <Route path="videos" element={<AdminVideosPage />} />
          <Route path="blogs/submissions" element={<AdminBlogSubmissionsPage />} />
          <Route path="blogs/analytics" element={<AdminBlogAnalyticsPage />} />
          <Route path="blogs/new" element={<AdminBlogEditorPage />} />
          <Route path="blogs/:id/edit" element={<AdminBlogEditorPage />} />
          <Route path="blogs" element={<AdminBlogsPage />} />
        </Route>
      </Routes>
      {showPublicChatbot && chatbotEnabled ? <SiteChatbotWidget /> : null}
    </>
  )
}

function App() {
  return <AppRoutes />
}

export default App
