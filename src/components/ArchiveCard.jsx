import React, { useEffect, useState } from 'react'
import {roleData} from "@/utilities/roles.js"
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, ChevronRight} from 'lucide-react';
import Link from 'next/link';

const ArchiveCard = ({mission}) => {
	const [description, setDescription] = useState();
	const [shortDescription, setShortDescription] = useState();
	const [missionRoles, setMissionRoles] = useState();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		if(mission) {
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
		return null;
	};

	return (
		<div className={`relative rounded-lg backdrop-blur-lg bg-linear-to-b from-neutral-800/60 to-neutral-950/60 border overflow-hidden transition duration-300 ${mission.status.includes("fail") ? "border-red-900/30 hover:from-red-600/10 hover:to-red-900/10" : "border-emerald-900/30 hover:from-emerald-600/10 hover:to-emerald-900/10"}`}>

			{/*Mission information*/}
			<div className='grid grid-cols-4'>
				{/*Mission information*/}
				<div className='relative col-span-3 px-5 py-5'>
					<div className='flex items-center gap-5'>
						{mission.status.includes("fail") ? (
							<XCircle className=''/>
						) : (
							<CheckCircle className=''/>
						)}
						<h2 className='uppercase text-3xl font-bold'>{mission.title}</h2>
					</div>

					{/*Short briefing*/}
					<div>
						<h3 className='text-xl mt-5 font-semibold uppercase tracking-wide'>{description.title}:</h3>
						<p className=''>{shortDescription}...</p>
					</div>
					
					{/*Short status*/}
					<div className={`flex mt-5 gap-2 bg-neutral-800/50 border border-neutral-800 rounded-md text-lg p-3 ${mission.status.includes("fail") ? "text-red-500 " : "text-emerald-500"}`}>
						<p>{mission.statusDesc !== "" ? mission.statusDesc : "Mission success!"}</p>
					</div>
					
					{/*Other information: Host, map, date, time*/}
					<div className='mt-5 flex gap-5'>
						<div className='flex gap-2'>
							<User className=''/>
							<p>{mission.host}</p>
						</div>
						<div className='flex gap-2'>
							<MapPin className=''/>
							<p>{mission.map}</p>
						</div>
						<div className='flex gap-2'>
							<Calendar className=''/>
							<p>{mission.date}</p>
						</div>
						<div className='flex gap-2'>
							<Clock className=''/>
							<p>20:00 GMT+1</p>
						</div>
					</div>

					{/*Roles*/}
					<div className='mt-5 flex gap-5'>
						{mission.roles.length > 0 && (
							<div className='flex gap-5'>
								{missionRoles.map((role, index) => (
									<div key={index} className='flex gap-2'>
										<img src={role.icon} alt="" className='w-6 h-6'/>
										<p className='self-center text-sm'>{role.name} <span>[{role.slots <= 1 ? `${role.slots} Slot` : `${role.slots} Slots`}]</span></p>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/*View button*/}
				<div className='flex mt-5 items-center mx-10 place-self-center'>
					<Link href={`/missions/${mission.slug}`} className={`flex items-center py-2 px-10 w-full rounded-lg text-center bg-neutral-800/50 border  transition duration-300 tracking-wide font-semibold text-lg ${mission.status.includes("fail") ? "border-red-800/30 hover:bg-red-600/20" : "border-emerald-800/30 hover:bg-emerald-600/20"}`}>View details <ChevronRight className="w-4 h-4 ml-2" /></Link>
				</div>
			</div>
		</div>
	)
}

export default ArchiveCard