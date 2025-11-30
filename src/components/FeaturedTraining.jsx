import React, {useEffect, useState} from 'react'
import {roleData} from "@/utilities/roles.js"
import { Calendar, Clock, MapPin, User, Target, ShieldHalf} from 'lucide-react';
import Link from 'next/link';
import MissionOptions from '@/components/MissionOptions'
import ClientOnly from "@/components/ClientOnly";

const FeaturedTraining = ({mission}) => {
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

	if (!mounted) return null;

	return (
		<section id='featured' className='relative group rounded-lg backdrop-blur-lg bg-black/30 border border-amber-700/30 hover:bg-amber-500/10 my-5 overflow-hidden transition duration-300'>
			{/*Special line*/}
			<div className='absolute bg-amber-500 top-0 left-0 h-1 w-full z-20'></div>

			<div className='grid lg:grid-cols-3 lg:grid-rows-1 gap-0'>
				{/*Thumbnail*/}
				<div className=' overflow-hidden col-span-1'>
					<img src={thumbnail} alt="" className='h-full group-hover:scale-110 transition duration-300 object-cover'/>
				</div>

				{/*Mission information*/}
				<div className='relative px-5 py-5 lg:col-span-2 col-span-1'>
					<div className={`flex bg-amber-500/20 border w-fit border-amber-500 rounded-full px-2 text-amber-500 text-sm font-semibold`}>TRAINING MISSION</div>
					<div className='flex items-start justify-between gap-5'>
						<h1 className=' uppercase mt-5 text-2xl tracking-wider font-bold'>{mission.title}</h1>
						<MissionOptions mission={mission}/>
					</div>
					
					{/*Short briefing*/}
					<div className='mt-5'>
						<h2 className='text-xl font-semibold uppercase tracking-wide'>{description.title}:</h2>
						<div dangerouslySetInnerHTML={{ __html: shortDescription }} className=''/>						
					</div>
					
					{/*Other information: Host, map, date, time*/}
					<div className='mt-5'>
						<h2 className='text-xl font-semibold uppercase tracking-wide'>INFORMATION:</h2>
						<div className='grid grid-cols-2 mt-2 gap-2 tracking-wide'>
							<div className='flex gap-2 bg-neutral-800/50 border border-neutral-800 rounded-md p-1'>
								<User className=' place-self-center'/>
								<p className='text-zinc-400'>{mission.host}</p>
							</div>
							<div className='flex gap-2 bg-neutral-800/50 border border-neutral-800 rounded-md p-1'>
								<MapPin className=' place-self-center'/>
								<p className='text-zinc-400'>{mission.map}</p>
							</div>
							<div className='flex gap-2 bg-neutral-800/50 border border-neutral-800 rounded-md p-1'>
								<Calendar className='place-self-center'/>
								<ClientOnly>
									<p className='text-zinc-400'>{new Date(mission.date).toLocaleDateString("en-GB", {year: "numeric", month: "numeric", day: "numeric"})}</p>
								</ClientOnly>
							</div>
							<div className='flex gap-2 bg-neutral-800/50 border border-neutral-800 rounded-md p-1'>
								<Clock className=' place-self-center'/>
								<ClientOnly>
									<p className='text-zinc-400'>{new Date(mission.date).toLocaleTimeString("en-GB", {hour: "2-digit",minute: "2-digit",})}</p>
								</ClientOnly>
							</div>
							{mission.faction && (
								<div className='flex gap-2 bg-neutral-800/50 border border-neutral-800 rounded-md p-1'>
									<ShieldHalf className=' place-self-center'/>
									<p className='text-zinc-400'>{mission.faction}</p>
								</div>
							)}
						</div>
					</div>

					{/*Roles*/}
					{mission.roles.length > 0 && (
						<div className='mt-5'>
							<h2 className='text-xl font-semibold uppercase tracking-wide'>Roles:</h2>
							<div className='grid grid-cols-2 mt-2 gap-2'>
								{missionRoles.map((role, index) => (
									<div key={index} className='flex gap-2 bg-neutral-800/50 border border-neutral-800 rounded-md p-1'>
										<img src={role.icon} alt="" className='w-6 h-6 place-self-center'/>
										<p className='self-center'>{role.name} <span>[{role.slots <= 1 ? `${role.slots} Slot` : `${role.slots} Slots`}]</span></p>
									</div>
								))}
							</div>
						</div>
					)}

					{/*View button*/}
					<div className='mt-10 flex mx-auto'>
						<Link href={`/missions/${mission.slug}`} className='py-3 w-full rounded-lg text-center bg-amber-900 hover:bg-amber-600 transition duration-300 uppercase tracking-wide font-bold lg:text-xl text-base'>View details</Link>
					</div>

				</div>
			</div>
		</section>
	)
}

export default FeaturedTraining