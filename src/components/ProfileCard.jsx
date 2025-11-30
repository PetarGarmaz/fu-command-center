import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import {roleData} from "@/utilities/roles.js"
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, ChevronRight, FilePen, CheckCircle2, ShieldHalf, Mail, MailCheck, Ellipsis, EllipsisVertical} from 'lucide-react';
import { userStore } from '@/stores/userStore';
import MissionOptions from '@/components/MissionOptions'
import ClientOnly from "@/components/ClientOnly";

const ProfileCard = ({mission}) => {
	const [creator, setCreator] = useState();
	const [description, setDescription] = useState();
	const [shortDescription, setShortDescription] = useState();
	const [missionRoles, setMissionRoles] = useState();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		if(mission) {
			setCreator(userStore.allUsers.find(u => u.id == mission.creator));
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
			<div></div>
		);
	};

	return (
		<div className="rounded-lg backdrop-blur-lg bg-linear-to-b from-neutral-800/60 to-neutral-950/60 border transition duration-300 border-neutral-800/30 hover:from-red-600/10 hover:to-red-900/10 hover:border-red-800/30" >
			
			{/*Mission information*/}
			<div className='relative px-5 py-5 '>
				<div className={`flex ${mission.type !== "optional" && "hidden"} bg-cyan-500/20 border w-fit border-cyan-500 rounded-full px-2 text-cyan-500 text-sm font-semibold mb-5`}>OPTIONAL MISSION</div>
					<div className={`flex ${mission.type !== "training" && "hidden"} bg-amber-500/20 border w-fit border-amber-500 rounded-full px-2 text-amber-500 text-sm font-semibold mb-5`}>TRAINING MISSION</div>
				
				<div className='flex items-start justify-between'>
					<h2 className='uppercase lg:text-3xl text-xl font-bold'>{mission.title}</h2>
					<MissionOptions mission={mission}/>
				</div>

				{/*Short briefing*/}
				<div>
					<h3 className='lg:text-xl text-lg mt-5 font-semibold uppercase tracking-wide'>{description.title}:</h3>
					<div dangerouslySetInnerHTML={{ __html: shortDescription }} className=''/>
				</div>

				{/*Short status*/}
				{mission.statusDesc && (
					<div className={`flex mt-5 gap-2 bg-neutral-800/50 border border-neutral-800 rounded-md text-lg p-3 ${mission.status ? "text-red-500 " : "text-emerald-500"}`}>
						<p>{mission.statusDesc !== "" ? mission.statusDesc : "Unknown outcome"}</p>
					</div>
				)}
									
				{/*Other information: Host, map, date, time*/}
				<div className='mt-5 grid grid-cols-2 lg:flex gap-5'>
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
						<ClientOnly>
							<p className='lg:block hidden'>{new Date(mission.date).toLocaleDateString("en-GB", {weekday: "long", year: "numeric", month: "long", day: "numeric"})}</p>
							<p className='lg:hidden'>{new Date(mission.date).toLocaleDateString("en-GB", {year: "numeric", month: "numeric", day: "numeric"})}</p>
						</ClientOnly>
					</div>
					<div className='flex gap-2'>
						<Clock className=''/>
						<ClientOnly>
							<p>{new Date(mission.date).toLocaleTimeString("en-GB", {hour: "2-digit",minute: "2-digit",})}</p>
						</ClientOnly>
					</div>
					{mission.faction && (
						<div className='flex gap-2'>
							<ShieldHalf className=''/>
							<p>{mission.faction}</p>
						</div>
					)}
				</div>

				{/*Roles*/}
				<div className='mt-5 flex gap-5'>
					{mission.roles.length > 0 && (
						<div className='grid grid-cols-2 lg:flex gap-5'>
							{missionRoles.map((role, index) => (
								<div key={index} className='flex gap-2'>
									<img src={role.icon} alt="" className='w-6 h-6'/>
									<p className='self-center text-sm'>{role.name} <span>[{role.slots <= 1 ? `${role.slots} Slot` : `${role.slots} Slots`}]</span></p>
								</div>
							))}
						</div>
					)}
				</div>

				{/*View button*/}
				<div className='mt-5 lg:mx-20 items-center'>
					<a href={`/missions/${mission.slug}`} className={`flex items-center justify-center py-2 rounded-lg bg-neutral-800/50 border transition duration-300 tracking-wide font-semibold text-lg border-red-800/30 hover:bg-red-600/20`}>View details <ChevronRight className="w-6 h-6 ml-2" /></a>
				</div>
			</div>
		</div>
	)
}

export default observer(ProfileCard)