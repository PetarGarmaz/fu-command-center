"use client"

import { useState, useEffect } from "react"
import Dashboard from '@/components/Dashboard'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import React from 'react'

const HomePage = () => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setMounted(true);
		}, 1000);
	}, [])
	
	if(!mounted) {
		return (
			<div className='bg-radial-[at_50%_0%] from-red-900/20 to-transparent min-h-screen'></div>
		)
	};

	return (
		<div className='flex flex-col bg-radial-[at_50%_0%] from-red-900/20 to-transparent min-h-screen'>
			<Navbar/>
			<Dashboard/>
			<Footer/>
		</div>
	)
}

export default HomePage