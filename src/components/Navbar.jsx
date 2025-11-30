"use client"

import React from 'react'
import { observer } from 'mobx-react-lite'
import { useState, useEffect } from 'react'
import { Menu, LogOut, LogIn, X, FileText, ShieldUser } from 'lucide-react';
import { userStore } from '@/stores/userStore'

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	
	const handleSignOut = () => {
		setIsProfileOpen(false);
		setIsMenuOpen(false);
		userStore.signOut();
	}

	useEffect(() => {
		setMounted(true);	
	}, [userStore.allUsers.length, userStore.loaded]);

	if(!mounted) {
		return null
	};

	return (
		<nav className="fixed w-full fade-opacity backdrop-blur-2xl bg-black/40 border-b border-red-900 z-50">
			<div className={`fixed w-full h-screen bg-black/75 ${isMenuOpen || isProfileOpen ? "block" : "hidden"}`}></div>

			<div className="container mx-auto px-2">
				<div className="flex justify-between items-center h-24">
					<a href="/" className="flex gap-5  text-white">
						<img src="/fu_logo.png" alt="" className='max-md:hidden w-12 md:w-16 object-contain bg-radial from-red-800 to-75% to-transparent'/>
						<img src="/FUCC - Logo Icon Nav.png" alt="" className='w-12 md:w-16 object-contain'/>
						<div className='flex-col my-auto font-extrabold text-xl md:text-2xl leading-none tracking-wide'>FU COMMAND CENTER<br/><span className='max-md:hidden font-normal text-sm uppercase text-red-800'>Freelancers Union scheduling system</span>
						</div>
					</a>

					{/* Desktop Menu */}
					<div className="hidden xl:flex items-center space-x-5">
						<a href="/#featured" className="p-2 font-semibold hover:bg-neutral-500/40 rounded-lg text-white transition duration-300">FEATURED</a>
						<a href="/#upcoming" className="p-2 font-semibold hover:bg-neutral-500/40 rounded-lg text-white transition duration-300">UPCOMING</a>
						<a href="/#archived" className="p-2 font-semibold hover:bg-neutral-500/40 rounded-lg text-white transition duration-300">ARCHIVED</a>

						<div className='border-l border-white h-10'></div>

						{userStore.currentUser ? (
							<>
								<button type='button' onClick={() => setIsProfileOpen(true)} className='group cursor-pointer rounded-lg w-10 h-10 overflow-hidden'>
									<img src={userStore.currentUser.avatar_url} className='rounded-lg group-hover:scale-120 transition duration-300' />
								</button>
							</>
						) : (
							<button type='button' onClick={() => userStore.signInWithDiscord()} className='flex font-semibold cursor-pointer text-white gap-2 bg-black hover:bg-neutral-500/40 p-2 rounded-lg border border-white transition duration-300'>
								<LogIn/>
								SIGN IN
							</button>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className="xl:hidden flex items-center space-x-4">				
						<button type="button" className="flex font-semibold cursor-pointer text-white gap-2 bg-black hover:bg-neutral-500/40 p-2 rounded-lg border border-white transition duration-300" onClick={() => setIsMenuOpen(true)}>
							<Menu/>
						</button>
					</div>
				</div>

			</div>

			{/* Profile Menu - Desktop */}
			{userStore.currentUser && (
				<>
					<aside className={`fixed top-0 right-0 z-70 bg-neutral-900 w-96 h-screen overflow-hidden transition duration-300 ${!isProfileOpen && "sm:translate-x-96 translate-x-full"}`}>
						<div className="p-5 space-y-10">
							<div className='flex justify-end'>
								<button type="button" onClick={() => setIsProfileOpen(false)} className='font-semibold cursor-pointer text-white bg-black hover:bg-neutral-500/40 p-2 rounded-lg border border-white transition duration-300'>
									<X/>
								</button>
							</div>

							<div className='space-y-5'>
								<h2 className='uppercase text-neutral-400 tracking-wider'>Profile</h2>
								<div className='flex flex-col gap-5'>
									<div className='flex gap-5'>
										<img src={userStore.currentUser.avatar_url} className='rounded-full w-16 h-16 place-self-center' />
										<div className='flex flex-col place-self-center gap-2'>
											<p className='uppercase text-neutral-400 text-sm tracking-wider'>Operator ID</p>
											<p className='capitalize tracking-wider'>{userStore.currentUser.username}</p>
										</div>
									</div>
								</div>
							</div>

							<div className='space-y-5'>
								<div className='flex bg-neutral-800 border border-neutral-600 rounded-lg px-5 py-2 gap-5'>
									<ShieldUser className='w-8 h-8 place-self-center text-blue-400'/>
									<div className='flex flex-col place-self-center gap-1'>
										<p className='uppercase text-neutral-400 text-sm tracking-wider'>Clearance Level</p>
										<p className='capitalize tracking-wider'>{userStore.currentUser.isMember ? (userStore.currentUser.isAdmin ? "Officer" : "Member") : "Guest"}</p>
									</div>
								</div>

								<div className='flex bg-neutral-800 border border-neutral-600 rounded-lg px-5 py-2 gap-5'>
									<FileText className='w-8 h-8 place-self-center text-amber-400'/>
									<div className='flex flex-col place-self-center gap-1'>
										<p className='uppercase text-neutral-400 text-sm tracking-wider'>Missions created</p>
										<p className='capitalize tracking-wider'>{userStore.createdMissions}</p>
									</div>
								</div>
							</div>

							<hr className='border-gray-400'/>

							<div className='flex flex-col gap-5'>
								<h2 className='uppercase text-neutral-400 tracking-wider'>Actions</h2>
								{(userStore.currentUser.isMember || userStore.currentUser.isAdmin) && ( 
									<>
										<a href={`/profile/${userStore.currentUser.username}`} className="p-2 font-semibold bg-linear-to-r from-red-800/50 to-amber-700/50 hover:bg-white rounded-lg text-white transition duration-300 uppercase">My Missions</a>
										<a href="/create-mission" className="p-2 font-semibold bg-linear-to-r from-red-800/50 to-amber-700/50 hover:bg-white rounded-lg text-white transition duration-300 uppercase">Create mission</a>
									</>
								)}
								<button type='button' onClick={() => handleSignOut()} className='flex font-semibold cursor-pointer text-white gap-2 bg-black hover:bg-neutral-500/40 p-2 rounded-lg border border-white transition duration-300'>
									<LogOut/>
									SIGN OUT	
								</button>
							</div>
							
						</div>
					</aside>
				</>
			)}

			{/* Mobile Menu */}
			<aside className={`fixed top-0 right-0 z-70 bg-neutral-900 sm:w-96 w-full h-screen overflow-y-auto overscroll-contain transition duration-300 ${!isMenuOpen && "hidden"}`}>
				<div className="p-5 space-y-5">
					<div className='flex justify-end'>
						<button type="button" onClick={() => setIsMenuOpen(false)} className='font-semibold cursor-pointer text-white bg-black hover:bg-neutral-500/40 p-2 rounded-lg border border-white transition duration-300'>
							<X/>
						</button>
					</div>

					<div className=' space-y-10'>
						{userStore.currentUser && (
							<>
								<div className='space-y-5'>
									<h2 className='uppercase text-neutral-400 tracking-wider'>Profile</h2>
									<div className='flex flex-col gap-5'>
										<div className='flex gap-5'>
											<img src={userStore.currentUser.avatar_url} className='rounded-full w-16 h-16 place-self-center' />
											<div className='flex flex-col place-self-center gap-2'>
												<p className='uppercase text-neutral-400 text-sm tracking-wider'>Operator ID</p>
												<p className='capitalize tracking-wider'>{userStore.currentUser.username}</p>
											</div>
										</div>
									</div>
								</div>

								<div className='space-y-5'>
									<div className='flex bg-neutral-800 border border-neutral-600 rounded-lg px-5 py-2 gap-5'>
										<ShieldUser className='w-8 h-8 place-self-center text-blue-400'/>
										<div className='flex flex-col place-self-center gap-1'>
											<p className='uppercase text-neutral-400 text-sm tracking-wider'>Clearance Level</p>
											<p className='capitalize tracking-wider'>{userStore.currentUser.isMember ? (userStore.currentUser.isAdmin ? "Officer" : "Member") : "Guest"}</p>
										</div>
									</div>

									<div className='flex bg-neutral-800 border border-neutral-600 rounded-lg px-5 py-2 gap-5'>
										<FileText className='w-8 h-8 place-self-center text-amber-400'/>
										<div className='flex flex-col place-self-center gap-1'>
											<p className='uppercase text-neutral-400 text-sm tracking-wider'>Missions created</p>
											<p className='capitalize tracking-wider'>{userStore.createdMissions}</p>
										</div>
									</div>
								</div>

								<hr className='border-gray-400'/>
							</>
						)}

						<div className='space-y-5'>
							<h2 className='uppercase text-neutral-400 tracking-wider'>Navigation</h2>
							<div className='flex flex-col gap-5'>
								<a href="/#featured" className="p-2 font-semibold hover:bg-neutral-500/40 rounded-lg text-white transition duration-300">Featured</a>
								<a href="/#upcoming" className="p-2 font-semibold hover:bg-neutral-500/40 rounded-lg text-white transition duration-300">Upcoming</a>
								<a href="/#archived" className="p-2 font-semibold hover:bg-neutral-500/40 rounded-lg text-white transition duration-300">Archived</a>
							</div>
						</div>

						<hr className='border-gray-400'/>

						<div className='space-y-5'>
							<h2 className='uppercase text-neutral-400 tracking-wider'>Action</h2>
							<div className='flex flex-col gap-5'>
								{userStore.currentUser ? (
									<>
										{(userStore.currentUser.isMember || userStore.currentUser.isAdmin) && (
											<>
												<a href={`/profile/${userStore.currentUser.username}`} className="p-2 font-semibold bg-linear-to-r from-red-800/50 to-amber-700/50 hover:bg-white rounded-lg text-white transition duration-300 uppercase">My Missions</a>
												<a href="/create-mission" className="p-2 font-semibold bg-linear-to-r from-red-800/50 to-amber-700/50 hover:bg-white rounded-lg text-white transition duration-300 uppercase">Create mission</a>
											</>
										)}
										
										<button type='button' onClick={() => handleSignOut()} className='flex font-semibold cursor-pointer text-white gap-2 bg-black hover:bg-neutral-500/40 p-2 rounded-lg border border-white transition duration-300'>
											<LogOut className='place-self-center'/>
											<span className='place-self-center'>SIGN OUT</span>	
										</button>
									</>
								) : (
									<button type='button' onClick={() => userStore.signInWithDiscord()} className='flex font-semibold cursor-pointer text-white gap-2 bg-black hover:bg-neutral-500/40 p-2 rounded-lg border border-white transition duration-300'>
										<LogIn className='place-self-center'/>
										<span className='place-self-center'>SIGN IN</span>
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</aside>
			
		</nav>
	);	
}

export default observer(Navbar)