'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Slide {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  ctaText: string
  ctaLink: string
}

const slides: Slide[] = [
  {
    id: '1',
    title: 'NOUVELLES COLLECTIONS',
    subtitle: 'Découvrez les dernières tendances',
    description: 'Des sneakers exclusives pour tous les styles. Qualité premium et confort inégalé.',
    image: '/api/placeholder/1200/800',
    ctaText: 'Découvrir',
    ctaLink: '/products'
  },
  {
    id: '2',
    title: 'AIR MAX 90',
    subtitle: 'Légende intemporelle',
    description: 'Le modèle qui a révolutionné le monde des sneakers. Disponible dans de nouvelles couleurs.',
    image: '/api/placeholder/1200/800',
    ctaText: 'Acheter maintenant',
    ctaLink: '/products?category=homme'
  },
  {
    id: '3',
    title: 'COLLECTION FEMME',
    subtitle: 'Style et performance',
    description: 'Des sneakers conçues pour les femmes actives. Élégance et confort réunis.',
    image: '/api/placeholder/1200/800',
    ctaText: 'Voir la collection',
    ctaLink: '/products?category=femme'
  }
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl md:text-2xl text-orange-400 mb-6 font-medium">
                    {slide.subtitle}
                  </h2>
                  <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                    {slide.description}
                  </p>
                  <a
                    href={slide.ctaLink}
                    className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
                  >
                    {slide.ctaText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200"
        aria-label="Slide précédent"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200"
        aria-label="Slide suivant"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? 'bg-orange-500 scale-125'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
