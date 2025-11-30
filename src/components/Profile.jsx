
"use client"

import { observer } from 'mobx-react-lite'
import { missionStore } from '@/stores/missionStore'
import { userStore } from '@/stores/userStore'
import { useEffect, useState } from 'react'
import { Contact, ShieldUser, FileText } from 'lucide-react';

import FilterBar from '@/components/FilterBar';
import FilterNoMatch from '@/components/FilterNoMatch';
import PaginationBar from '@/components/PaginationBar';
import ProfileCard from '@/components/ProfileCard'

const Profile = ({slug}) => {
	const [mounted, setMounted] = useState(false);

	// EFFECT 1 — Load the mission when user found
	useEffect(() => {
		if (!userStore.loaded) return;

		const foundUser = userStore.allUsers.find(u => u.username == slug);
		if (foundUser) {
			missionStore.setCurrentProfile(foundUser)
		}
	}, [userStore.allUsers, slug]);

	// EFFECT 2 — React to user loaded
	useEffect(() => {
		if (!missionStore.currentProfile) return;

		missionStore.getProfileMissions();
		const timer = setTimeout(() => setMounted(true), 500);
		return () => clearTimeout(timer);
	}, [missionStore.currentProfile, missionStore.missions.length]);

	if(!mounted) {
		return null
	};

	if(!missionStore.currentProfile) {
		return (
			<section className='fade-opacity container mx-auto px-5 py-10'>
				<div className='container relative rounded-lg backdrop-blur-lg bg-black/30 border border-red-900/30 mb-5 mt-32 overflow-hidden'>
					{/*Special line*/}
					<div className='absolute bg-linear-to-r top-0 left-0 h-1 w-full from-red-900 via-amber-800 to-red-900 z-20'></div>

					<div className='mt-5 mx-auto p-10'>
						<div className="flex justify-center mb-6">
							<div className="w-20 h-20 rounded-full bg-black/30 flex items-center justify-center">
								<p  className="text-4xl text-zinc-400">🦗</p>
							</div>
						</div>
						<h1 className='text-center text-3xl text-zinc-400 font-semibold uppercase tracking-wide'>{slug} isn't here</h1>
						<p className='text-center text-lg text-zinc-400 mt-5'>Noone here goes by that name. I don't know how you got here...</p>
					</div>
				</div>
			</section>
		)
	};

	return (
		<section className='fade-opacity container mx-auto px-5 py-10'>
			{/* Go back*/}
			<a href='/' className='rounded-lg my-5 py-2 px-5 hover:bg-neutral-800 transition duration-300 text-lg'>← Back to Dashboard</a>

			{/* Titles...*/}
			<div className='flex items-center gap-5 my-5'>
				<Contact className='w-15 h-15'/>

				<div>
					<h1 className='lg:text-4xl text-2xl font-bold uppercase tracking-widest'>{missionStore.currentProfile?.username}'s Profile</h1>
					<p className='lg:text-xl text-lg text-neutral-500 trakcing-wider'>View missions that {missionStore.currentProfile?.username} has scheduled.</p>
				</div>
			</div>

			{missionStore.profileMissions.length > 0 ? (
				<>
					<div className='grid lg:grid-cols-2 grid-cols-1 gap-5 mb-10'>
						<div className='flex bg-neutral-800 border border-neutral-600 rounded-lg px-5 py-2 gap-5'>
							<ShieldUser className='w-8 h-8 place-self-center text-blue-400'/>
							<div className='flex flex-col place-self-center gap-1'>
								<p className='uppercase text-neutral-400 text-sm tracking-wider'>Clearance Level</p>
								<p className='capitalize tracking-wider'>{missionStore.currentProfile.isMember ? (missionStore.currentProfile.isAdmin ? "Officer" : "Member") : "Guest"}</p>
							</div>
						</div>

						<div className='flex bg-neutral-800 border border-neutral-600 rounded-lg px-5 py-2 gap-5'>
							<FileText className='w-8 h-8 place-self-center text-amber-400'/>
							<div className='flex flex-col place-self-center gap-1'>
								<p className='uppercase text-neutral-400 text-sm tracking-wider'>Missions created</p>
								<p className='capitalize tracking-wider'>{missionStore.profileMissions.length}</p>
							</div>
						</div>
					</div>

					<FilterBar type={"profile"}/>

					{missionStore.profileMissions.length > 0 ? (
						<div className='mt-10 grid grid-cols-1 gap-5'>
							{missionStore.profileMissions.map((mission, index) => (
								<ProfileCard key={index} mission={mission}/>
							))}
						</div>
					) : (
						<FilterNoMatch/>
					)}

					<PaginationBar type={"profile"}/>
				</>
			) : (
				<div className='container relative rounded-lg backdrop-blur-lg bg-black/30 border border-red-900/30 mb-5 mt-32 overflow-hidden'>
					{/*Special line*/}
					<div className='absolute bg-linear-to-r top-0 left-0 h-1 w-full from-red-900 via-amber-800 to-red-900 z-20'></div>

					<div className='mt-5 mx-auto p-10'>
						<div className="flex justify-center mb-6">
							<div className="w-20 h-20 rounded-full bg-black/30 flex items-center justify-center">
								<p  className="text-4xl text-zinc-400">🦗</p>
							</div>
						</div>
						<h1 className='text-center text-3xl text-zinc-400 font-semibold uppercase tracking-wide'>No missions scheduled</h1>
						<p className='text-center text-lg text-zinc-400 mt-5'><span className='capitalize'>{missionStore.currentProfile?.username}</span> hasn't made any missions. Make sure to poke them on discord to make one.</p>
					</div>
				</div>
			)}
		</section>
	)
}

export default observer(Profile)