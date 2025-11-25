
"use client"

import { observer } from 'mobx-react-lite'
import { missionStore } from '@/stores/missionStore'
import { userStore } from '@/stores/userStore'
import { useEffect, useState } from 'react'
import { NotebookText, Users, NotebookPen, Link2, Calendar } from 'lucide-react';
import {roleData} from "@/utilities/roles.js"

const Mission = ({slug}) => {
	const [mounted, setMounted] = useState(false);
	const [thumbnail, setThumbnail] = useState();
	const [mission, setMission] = useState(null);
	const [missionRoles, setMissionRoles] = useState();
	const [linkedMission, setLinkedMission] = useState(null);
	
	// EFFECT 1 — Load the mission when missions or slug changes
	useEffect(() => {
		const foundMission = missionStore.missions.find(m => m.slug === slug);
		if (foundMission) {
			setMission(foundMission);
		}
	}, [missionStore.missions, slug]);

	// EFFECT 2 — React to mission loaded
	useEffect(() => {
		if (!mission) return;

		//const foundLinkedMission = missionStore.missions.find(m => m.attachedMission === slug);
		//if(foundLinkedMission) {
		//	setLinkedMission (foundLinkedMission);
		//}

		setThumbnail(mission.image ? mission.image : null);

		setMissionRoles(
			mission.roles.map(role => {
				const data = roleData[role.name];
				return {
					name: data.name,
					icon: data.icon,
					slots: role.slots,
				};
			})
		);

		const timer = setTimeout(() => setMounted(true), 500);
		return () => clearTimeout(timer);
	}, [mission]);

	const handleDelete = (id) => {
		missionStore.deleteMission(id);
		window.location.assign("/");
	} 

	if(!mounted) {
		return (
			<div></div>
		);
	};

	return (
		<section className='fade-opacity container mx-auto px-5 py-10'>
		
			{/* Go back*/}
			<a href='/' className='rounded-lg my-5 py-2 px-5 hover:bg-neutral-800 transition duration-300 text-lg'>← Back to Dashboard</a>

			{/* Titles...*/}
			<div className='flex items-center gap-5 my-5'>
				<NotebookText className='w-15 h-15'/>

				<div>
					<h1 className='lg:text-4xl text-2xl font-bold uppercase tracking-widest'>{mission.title}</h1>
					<p className='lg:text-xl text-lg text-neutral-500 trakcing-wider'>View {mission.title} details, briefing and roles.</p>
				</div>
			</div>
			
			<div className='lg:mt-24 mt-16 mb-5 space-y-5'>
				{thumbnail && (
					<div className=' relative group rounded-lg backdrop-blur-lg bg-black/30 border border-red-900/30 hover:bg-red-700/10 overflow-hidden transition duration-300'>
						<img src={thumbnail} alt=""  />
					</div>
				)}

				<div className='relative group rounded-lg backdrop-blur-lg bg-black/30 border border-red-900/30 hover:bg-red-700/10 overflow-hidden transition duration-300'>
					<div className='lg:p-10 p-5 space-y-5'>
						<div className='flex gap-4 place-items-center'>
							<Calendar className='w-10 h-10'/>
							<h2 className='lg:text-2xl text-2xl font-bold uppercase tracking-wide'>MISSION DETAILS:</h2>
						</div>

						<div className='grid lg:grid-cols-4 grid-cols-1 mt-2 gap-5 tracking-wide text-lg'>
							<div className='p-3 gap-2 bg-neutral-800/50 border border-neutral-800 rounded-md'>
								<p className='text-neutral-500 uppercase'>Host</p>
								<p className=' font-bold'>{mission.host}</p>
							</div>
							<div className='p-3 gap-2 bg-neutral-800/50 border border-neutral-800 rounded-md'>
								<p className='text-neutral-500 uppercase'>Terrain</p>
								<p className=' font-bold'>{mission.map}</p>
							</div>
							<div className='p-3 gap-2 bg-neutral-800/50 border border-neutral-800 rounded-md'>
								<p className='text-neutral-500 uppercase'>Date</p>
								<p className='font-bold xl:block hidden'>{new Date(mission.date).toLocaleDateString("en-GB", {weekday: "long", year: "numeric", month: "long", day: "numeric"})}</p>
								<p className='font-bold xl:hidden'>{new Date(mission.date).toLocaleDateString("en-GB", {year: "numeric", month: "numeric", day: "numeric"})}</p>
							</div>
							<div className='p-3 gap-2 bg-neutral-800/50 border border-neutral-800 rounded-md'>
								<p className='text-neutral-500 uppercase'>Time</p>
								<p className='font-bold'>{new Date(mission.date).toLocaleTimeString("en-GB", {hour: "2-digit",minute: "2-digit",})}</p>
							</div>
							{mission.faction && (
								<div className='p-3 gap-2 bg-neutral-800/50 border border-neutral-800 rounded-md'>
									<p className='text-neutral-500 uppercase'>Faction</p>
									<p className=' font-bold'>{mission.faction}</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{linkedMission && (
					<div className='relative group rounded-lg backdrop-blur-lg bg-cyan-500/10 border border-cyan-500/40 hover:bg-cyan-500/30 overflow-hidden transition duration-300'>
						<a href={`/missions/${linkedMission.slug}`}>
							<div className='lg:p-10 p-5 space-y-10'>
								{/*Special line*/}
								<div className='absolute bg-cyan-500 top-0 left-0 h-1 w-full z-20'></div>

								<div className='flex bg-cyan-900/50 border w-fit border-cyan-500 rounded-full px-2 text-cyan-500 text-sm font-semibold'>OPTIONAL MISSION</div>

								<div className='flex gap-4 place-items-center'>
									<Link2 className='text-cyan-500 w-10 h-10'/>
									<h2 className='lg:text-3xl text-2xl font-bold uppercase tracking-wide '>{linkedMission.title}</h2>
								</div>

								<div className='space-y-10'>
									<div className=''>
										<h2 className='lg:text-2xl text-xl font-semibold uppercase tracking-wide'>{linkedMission.sections[0].title}</h2>
										<p className='mt-5 lg:text-lg tracking-wide whitespace-pre-wrap'>{linkedMission.sections[0].description.slice(0, 250)}...</p>
									</div>
								</div>
							</div>
						</a>
					</div>
				)}

				<div className='relative group rounded-lg backdrop-blur-lg bg-black/30 border border-red-900/30 hover:bg-red-700/10 overflow-hidden transition duration-300'>
					<div className='lg:p-10 p-5 space-y-10'>
						<div className='flex gap-4 place-items-center'>
							<NotebookPen className='w-10 h-10'/>
							<h2 className='lg:text-3xl text-2xl font-bold uppercase tracking-wide'>MISSION BRIEFING:</h2>
						</div>

						<div className='space-y-10'>
							{mission.sections.map((m, index) => (
								<div key={index} className=''>
									<h2 className='lg:text-2xl text-xl font-semibold uppercase tracking-wide'>{m.title}</h2>
									<div dangerouslySetInnerHTML={{ __html: m.description }} className='quill-content mt-5 lg:text-lg tracking-wide whitespace-pre-wrap'/>
								</div>
							))}
						</div>
					</div>
				</div>
			
				{mission.roles?.length > 0 && (
					<div className='relative group rounded-lg backdrop-blur-lg bg-black/30 border border-red-900/30 hover:bg-red-700/10 overflow-hidden transition duration-300'>
						<div className='lg:p-10 p-5 space-y-5'>
							<div className='flex gap-4'>
								<Users className='w-10 h-10'/>
								<h2 className='lg:text-3xl text-2xl font-bold uppercase tracking-wide'>ROLES:</h2>
							</div>
						
							<div className='grid lg:grid-cols-4 grid-cols-1 mt-2 gap-5 tracking-wide text-lg'>
								{missionRoles.map((role, index) => (
									<div key={index} className='flex p-3 bg-neutral-800/50 border border-neutral-800 rounded-md'>
										<div className=''>
											<p className='text-neutral-500 uppercase'>{role.name}</p>
											<p className='font-bold self-center'>{role.slots <= 1 ? `${role.slots} Slot` : `${role.slots} Slots`}</p>
										</div>

										<img src={role.icon} alt="" className='w-12 h-12 my-auto ml-auto'/>
									</div>

								))}
							</div>
						</div>
					</div>
				)}

				{userStore.currentUser?.id == mission.creator && (
					<div className='grid lg:grid-cols-2 grid-cols-1 gap-5'>
						<a href={`/edit-mission/${mission.slug}`} className='text-center bg-emerald-800/50 hover:bg-emerald-500/50 rounded-md p-2 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>Edit mission</a>
						<button type='button' onClick={() => handleDelete(mission.id)} className='cursor-pointer bg-red-800/30 hover:bg-red-500/70 rounded-md p-2 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>Delete mission</button>
					</div>
				)}
			</div>
		</section>
	)
}

export default observer(Mission)