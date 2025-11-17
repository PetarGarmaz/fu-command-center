"use client"

import React from 'react'
import { useState } from 'react'
import { supabase } from "@/utilities/supabaseClient";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	
	async function signInWithDiscord() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'discord',
		})
	};

	async function signOut() {
		const { error } = await supabase.auth.signOut();
		const { data: { user } } = await supabase.auth.getUser(); 
		alert(user);
	};

	return (
		<nav className="backdrop-blur-2xl bg-black/20 border-b border-red-900">
			<div className="container mx-auto px-2">
				<div className="flex justify-between items-center h-24">
					<a href="/" className="flex gap-5  text-gray-300">
						<img src="/fu_logo.png" alt="" className='w-12 md:w-16 object-contain bg-radial from-red-800 to-75% to-transparent'/>
						<img src="/FUCC - Logo Icon Nav.png" alt="" className='w-12 md:w-16 object-contain'/>
						<div className='flex-col my-auto font-extrabold text-base md:text-2xl leading-none tracking-wide'>FU COMMAND CENTER<br/><span className='font-normal text-sm uppercase text-neutral-600'>Freelancers Union scheduling system</span>
						</div>
					</a>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center space-x-8">
						<a href="/#featured" className="text-gray-300 ">FEATURED MISSION</a>
						<a href="/#upcoming" className="text-gray-300 ">UPCOMING MISSIONS</a>
						<a href="/#archived" className="text-gray-300 ">ARCHIVED MISSIONS</a>
						<button type='button' onClick={() => signInWithDiscord()} className='cursor-pointer text-gray-300'>SIGN IN</button>
						<button type='button' onClick={() => signOut()} className='cursor-pointer text-gray-300'>SIGN OUT</button>
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden flex items-center space-x-4">				
						<button className="text-gray-600 dark:text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
							<div className="space-y-2">
								<div className={`w-8 h-0.5 bg-gray-800 dark:bg-gray-100 transition duration-300 ${isMenuOpen && "-rotate-45 translate-y-2.5"}`}/>
								<div className={`w-8 h-0.5 transition duration-200 ${isMenuOpen ? "translate-x-2 bg-transparent" : "bg-gray-800 dark:bg-gray-100"}`}/>
								<div className={`w-8 h-0.5 bg-gray-800 dark:bg-gray-100 transition duration-300 ${isMenuOpen && "rotate-45 -translate-y-2.5"}`}/>
							</div>
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && type == "home" && (
					<div className="md:hidden py-4">
						<div className="flex flex-col space-y-4">
						</div>
					</div>
				)}

				{isMenuOpen && type == "about" && (
					<div className="md:hidden py-4">
						<div className="flex flex-col space-y-4">
							{/*<a href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={() => setIsMenuOpen(false)} >{t('nav.home')}</a>*/}
						</div>
					</div>
				)}
			</div>
		</nav>
	);	
}

export default Navbar