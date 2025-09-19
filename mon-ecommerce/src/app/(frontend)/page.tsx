import Header from './components/Header'
import HeroSlider from './components/HeroSlider'
import FeaturedProducts from './components/FeaturedProducts'
import RepriseSection from './components/RepriseSection'
import Footer from './components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSlider />
        <FeaturedProducts />
        <RepriseSection />
      </main>
      <Footer />
    </div>
  )
}
