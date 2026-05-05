import React from 'react'
import { Navbar } from '../../components/Navbar/Navbar'
import { Hero } from '../../components/Hero/Hero'
import { LogoBar } from '../../components/LogoBar/LogoBar'
import { Features } from '../../components/Features/Features'
import { Marketplace } from '../../components/Marketplace/Marketplace'
import { ListBusiness } from '../../components/Businesses/Business'
import { Valuation } from '../../components/Valuation/Valuation'
import { Testimonials } from '../../components/Testimontials/Testimontioals'
import { NewsLetter } from '../../components/NewsLetter/NewsLetter'
import { Footer } from '../../components/Footer/Footer'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <Navbar />
      <Hero />
      <LogoBar />
      <Features />
      <Marketplace />
      <ListBusiness />
      <Valuation />
      <Testimonials />
      <NewsLetter />
      <Footer />
    </div>
  )
}

export default HomePage