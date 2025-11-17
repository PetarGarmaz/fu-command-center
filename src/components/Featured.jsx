import React, {useEffect, useState} from 'react'
import {roleData} from "@/utilities/roles.js"
import { Calendar, Clock, MapPin, User, Target} from 'lucide-react';
import Link from 'next/link';

const Featured = ({mission}) => {
	const [thumbnail, setThumbnail] = useState();
	const [description, setDescription] = useState();
	const [shortDescription, setShortDescription] = useState();
	const [missionRoles, setMissionRoles] = useState();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		if(mission) {
			setThumbnail(mission.image ? mission.image : "/fu_placeholder.jpg");
			setDescription(mission.sections[0]);
			setShortDescription(mission.sections[0].description.slice(0,250));
			setMissionRoles(mission.roles.map(role => {
				const data = roleData[role.name]
				return {
					name: data.name,
					icon: data.icon,
					slots: role.slots
				}
			}));

			setMounted(true);
		}
	}, [mission]);

	if (!mounted) {
		return (
			<section id='featured' className='relative rounded-lg backdrop-blur-lg bg-black/30 border border-red-900/30 my-5 overflow-hidden'>
				{/*Special line*/}
				<div className='absolute bg-linear-to-r top-0 left-0 h-1 w-full from-red-900 via-amber-800 to-red-900 z-20'></div>

				<div className='mt-5 mx-auto'>
					<div className="flex justify-center mb-6">
						<div className="w-20 h-20 rounded-full bg-black/30 flex items-center justify-center">
							<Target className="w-10 h-10 text-zinc-400" />
						</div>
					</div>
					<h1 className='text-center text-3xl text-zinc-400 font-semibold uppercase tracking-wide'>No missions scheduled</h1>
					<p className='text-center text-lg text-zinc-400 mt-5'>No operations are currently scheduled for this week. Check back soon for new mission briefings, or schedule your own mission.</p>

					{/*Create a mission button*/}
					<div className='my-10 flex mx-auto'>
						<Link href="/" className='mx-20 py-3 w-full rounded-lg text-center bg-red-900 hover:bg-amber-600 transition duration-300 uppercase tracking-wide font-bold text-xl drop-shadow-red-800'>Host a mission</Link>
					</div>
				</div>
			</section>
		);
	};

	return (
		<section id='featured' className='relative group rounded-lg backdrop-blur-lg bg-black/30 border border-red-900/30 hover:bg-red-700/10 my-5 overflow-hidden transition duration-300'>
			{/*Special line*/}
			<div className='absolute bg-linear-to-r top-0 left-0 h-1 w-full from-red-900 via-amber-800 to-red-900 z-20'></div>

			<div className='grid grid-cols-1 grid-rows-2 gap-0'>
				{/*Thumbnail*/}
				<div className={`overflow-hidden bg-cover bg-center group-hover:scale-110 transition duration-300 aspect-10/5 mask-[linear-gradient(to_bottom,black,transparent)]`} style={{ backgroundImage: `url(${thumbnail})`}}></div>

				{/*Mission information*/}
				<div className='relative px-5 py-5'>
					<div className='flex bg-red-900/20 border w-fit border-red-900 rounded-full px-2 text-red-900 text-sm font-semibold'>FEATURED THIS WEEK</div>
					<h1 className=' uppercase mt-10 text-5xl font-bold'>{mission.title}</h1>
					
					{/*Short briefing*/}
					<div className='mt-10'>
						<h2 className='text-2xl font-semibold uppercase tracking-wide'>{description.title}:</h2>
						<p className=''>{shortDescription}...</p>
					</div>
					
					{/*Other information: Host, map, date, time*/}
					<div className='mt-10'>
						<h2 className='text-2xl font-semibold uppercase tracking-wide'>INFORMATION:</h2>
						<div className='grid grid-cols-2 mt-2 gap-5 tracking-wide'>
							<div className='flex gap-5 bg-neutral-800/50 border border-neutral-800 rounded-md p-2'>
								<User className='text-red-800'/>
								<p>{mission.host}</p>
							</div>
							<div className='flex gap-5 bg-neutral-800/50 border border-neutral-800 rounded-md p-2'>
								<MapPin className='text-red-800'/>
								<p>{mission.map}</p>
							</div>
							<div className='flex gap-5 bg-neutral-800/50 border border-neutral-800 rounded-md p-2'>
								<Calendar className='text-red-800'/>
								<p>{mission.date}</p>
							</div>
							<div className='flex gap-5 bg-neutral-800/50 border border-neutral-800 rounded-md p-2'>
								<Clock className='text-red-800'/>
								<p>20:00 GMT+1</p>
							</div>
						</div>
					</div>

					{/*Roles*/}
					{mission.roles.length > 0 && (
						<div className='mt-10'>
							<h2 className='text-2xl font-semibold uppercase tracking-wide'>Roles:</h2>
							<div className='grid grid-cols-2 mt-2 gap-5'>
								{missionRoles.map((role, index) => (
									<div key={index} className='flex gap-5 bg-neutral-800/50 border border-neutral-800 rounded-md p-2'>
										<img src={role.icon} alt="" className='w-8'/>
										<p className='self-center'>{role.name} <span>[{role.slots <= 1 ? `${role.slots} Slot` : `${role.slots} Slots`}]</span></p>
									</div>
								))}
							</div>
						</div>
					)}

					{/*View button*/}
					<div className='mt-10 flex mx-auto'>
						<Link href={`/missions/${mission.slug}`} className='mx-20 py-3 w-full rounded-lg text-center bg-red-900 hover:bg-amber-600 transition duration-300 uppercase tracking-wide font-bold text-xl'>View mission briefing</Link>
					</div>

				</div>
			</div>
		</section>
	)
}

export default Featured