import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='bg-gray-900'>
      <Navbar />
      <div className='py-24'>
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout
