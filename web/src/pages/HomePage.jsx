import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import HomeHeroSlider from '../components/HomeHeroSlider.jsx'
import WeightLossTreatments from '../components/WeightLossTreatments.jsx'
import HomeWeightLossProgramsBand from '../components/HomeWeightLossProgramsBand.jsx'
import HomeHairTreatmentsSection from '../components/HomeHairTreatmentsSection.jsx'
import HomeAboutLifesccSection from '../components/HomeAboutLifesccSection.jsx'
import HomeSkinTreatmentsSection from '../components/HomeSkinTreatmentsSection.jsx'
import HappyClients from '../components/HappyClients.jsx'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main home-page__main">
        <div className="home-page__hero-wrap">
          <HomeHeroSlider />
        </div>
        <WeightLossTreatments />
        <HomeWeightLossProgramsBand />
        <HomeHairTreatmentsSection />
        <HomeAboutLifesccSection />
        <HomeSkinTreatmentsSection />
        <HappyClients />
      </main>
      <SiteFooter />
    </div>
  )
}
