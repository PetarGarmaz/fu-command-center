import Dashboard from '@/components/Dashboard'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import React from 'react'

const HomePage = () => {
	return (
		<div className='bg-radial-[at_50%_0%] from-red-900/20 to-transparent min-h-screen'>
			<Navbar/>
			<Dashboard/>
			<Footer/>
		</div>
	)
}

export default HomePage