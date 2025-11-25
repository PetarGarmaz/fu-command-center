"use client"

import { useState, useEffect } from "react"
import React from 'react'
import { FileX } from 'lucide-react';

const Custom404 = () => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setMounted(true);
		}, 500);
	}, [])
	
	if(!mounted) {
		return (
			<div className='bg-radial-[at_50%_0%] from-red-900/20 to-transparent min-h-screen'></div>
		)
	};

	return (
		<div className='flex flex-col bg-radial-[at_50%_0%] from-red-900/20 to-transparent w-screen h-screen'>
			<section className='fade-opacity relative p-10 w-8/12 rounded-lg backdrop-blur-lg bg-black/30 border border-red-900/30 my-auto mx-auto overflow-hidden'>
				{/*Special line*/}
				<div className='absolute bg-linear-to-r top-0 left-0 h-1 w-full from-red-900 via-amber-800 to-red-900 z-20'></div>

				<div className='mx-auto'>
					<div className="flex justify-center mb-6">
						<div className="w-20 h-20 rounded-full bg-black/30 flex items-center justify-center">
							<FileX className="w-10 h-10 text-white" />
						</div>
					</div>
					<h1 className='text-center text-3xl text-white font-semibold uppercase tracking-wide'>Error: 404</h1>
					<p className='text-center text-lg text-white mt-5'>This page doesnt exist</p>
					<a href='/' className='rounded-lg flex place-self-center my-5 mx-auto py-2 px-5 hover:bg-neutral-800 transition duration-300 text-lg'>← Back to Dashboard</a>
				</div>
			</section>
		</div>
	)
}

export default Custom404