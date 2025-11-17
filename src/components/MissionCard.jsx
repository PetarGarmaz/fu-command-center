import React, { useEffect, useState } from 'react'
import {roleData} from "@/utilities/roles.js"
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import Link from 'next/link';

const MissionCard = ({mission}) => {
	const [thumbnail, setThumbnail] = useState();
	const [description, setDescription] = useState();
	const [shortDescription, setShortDescription] = useState();
	const [missionRoles, setMissionRoles] = useState();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		if(mission) {
			setThumbnail(mission.image ? mission.image : "/fu_placeholder.jpg");
			setDescription(mission.sections[0]);
			setShortDescription(mission.sections[0].description.slice(0,150));
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
		return null;
	};

	return (
		<div className='relative group rounded-lg backdrop-blur-lg bg-linear-to-b from-neutral-800/60 to-neutral-900/60 border border-red-900/30 overflow-hidden hover:from-red-700/10 hover:to-red-900/10 transition duration-300'>
			{/*Special line*/}
			<div className='absolute bg-linear-to-r top-0 left-0 h-1 w-full from-red-900 via-amber-800 to-red-900 z-20'></div>

			
			

			{/*Mission information*/}
			<div className='relative flex flex-col gap-0'>
				{/*Thumbnail*/}
				<div className={`w-full aspect-video group-hover:scale-110 transition duration-300 overflow-hidden bg-cover mask-[linear-gradient(to_bottom,black,transparent)]`} style={{ backgroundImage: `url(${thumbnail})`}}></div>
				
				{/*Mission information*/}
				<div className='relative px-5 py-5'>
					<h2 className=' uppercase mt-5 text-3xl font-bold'>{mission.title}</h2>
					
					{/*Short briefing*/}
					<div>
						<h3 className='text-xl mt-5 font-semibold uppercase tracking-wide'>{description.title}:</h3>
						<p className=''>{shortDescription}...</p>
					</div>
					
					{/*Other information: Host, map, date, time*/}
					<div className='mt-5'>
						<h3 className='text-xl font-semibold uppercase tracking-wide'>INFORMATION:</h3>
						<div className='grid grid-cols-2 mt-2 gap-2 tracking-wide'>
							<div className='flex gap-2 bg-neutral-800/50 border border-neutral-800 rounded-md p-1'>
								<User />
								<p className='text-sm'>{mission.host}</p>
							</div>
							<div className='flex gap-2 bg-neutral-800/50 border border-neutral-800 rounded-md p-1'>
								<MapPin />
								<p className='text-sm'>{mission.map}</p>
							</div>
							<div className='flex gap-2 bg-neutral-800/50 border border-neutral-800 rounded-md p-1'>
								<Calendar />
								<p className='text-sm'>{mission.date}</p>
							</div>
							<div className='flex gap-2 bg-neutral-800/50 border border-neutral-800 rounded-md p-1'>
								<Clock />
								<p className='text-sm'>20:00 GMT+1</p>
							</div>
						</div>
					</div>

					{/*Roles*/}
					{mission.roles.length > 0 && (
						<div className='mt-5'>
							<h3 className='text-xl font-semibold uppercase tracking-wide'>Roles:</h3>
							<div className='grid grid-cols-2 mt-2 gap-2'>
								{missionRoles.map((role, index) => (
									<div key={index} className='flex gap-2 bg-neutral-800/50 border border-neutral-800 rounded-md p-1'>
										<img src={role.icon} alt="" className='w-6 h-6'/>
										<p className='self-center text-sm'>{role.name} <span>[{role.slots <= 1 ? `${role.slots} Slot` : `${role.slots} Slots`}]</span></p>
									</div>
								))}
							</div>
						</div>
					)}

					{/*View button*/}
					<div className='mt-5 flex mx-auto'>
						<Link href={`/missions/${mission.slug}`} className='mx-20 py-2 w-full rounded-lg text-center bg-red-900 hover:bg-amber-600 transition duration-300 uppercase tracking-wide font-semibold text-lg drop-shadow-red-800'>View details</Link>
					</div>

				</div>
			</div>
		</div>
	)
}

export default MissionCard