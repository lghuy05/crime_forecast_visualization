import React from 'react'
import Header from './Layout/Header'
import Footer from './Layout/Footer'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
