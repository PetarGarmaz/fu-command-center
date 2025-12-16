"use client"

import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { userStore } from '@/stores/userStore'
import { missionStore } from '@/stores/missionStore'
import { User, FilePen, CheckCircle2, Mail, MailCheck, EllipsisVertical, Trash} from 'lucide-react';
import MissionStatusDialog from '@/components/MissionStatusDialog';

const MissionOptions = ({mission}) => {
	const [creator, setCreator] = useState();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [menu, setMenu] = useState(false);
	const [statusMenu, setStatusMenu] = useState(false);

	const handleDelete = () => {
		if (confirm("You're about to delete a mission, please confirm!")) {
			missionStore.deleteMission(mission.id);
		};
	};

	const handlePosting = async () => {
		setIsSubmitting(true);

		await missionStore.handleDiscordMessage(mission);
		alert("You've posted the discord message!");

		setIsSubmitting(false);
	};

	useEffect(() => {
		if(!mission) return;

		setCreator(userStore.allUsers.find(u => u.id == mission.creator));
	}, [mission]);

	if (!mission) {
		return (
			<div></div>
		);
	};

	if(userStore.currentUser?.id !== mission.creator && !userStore.currentUser?.isAdmin) {
		return (
			<div></div>
		);
	};	

	return (	
		<div className='relative space-y-2'>
			<MissionStatusDialog menu={statusMenu} setMenu={setStatusMenu} store={missionStore} mission={mission}/>
			
			<button type='button' onClick={() => setMenu(!menu)} aria-haspopup="true" className='cursor-pointer rounded-lg h-10 w-10 p-2 overflow-hidden bg-neutral-800 hover:bg-neutral-700 disabled:border-red-900/20 disabled:bg-red-900/10 disabled:text-neutral-500 transition duration-300' >
				<EllipsisVertical className='w-full h-full rounded-lg'/>
			</button>

			{/*Mission options*/}
			{menu && (
				<div className='absolute right-0 top-full w-60 rounded-lg overflow-hidden bg-linear-to-b from-neutral-800 to-neutral-900 transition duration-300 z-50' >
					<div className='p-3 space-y-3 w-full'>
						<a href={`/profile/${creator.username}`} className={`flex items-center w-full p-2 rounded-lg transition duration-300 tracking-wide hover:bg-neutral-700`}><User className="w-6 h-6 mr-2" /> View profile (<span className='capitalize'>{creator.username}</span>)</a>
						<button type='button' onClick={() => setStatusMenu(true)} className={`flex items-center w-full p-2 rounded-lg transition duration-300 tracking-wide hover:bg-neutral-700`}><CheckCircle2 className="w-6 h-6 mr-2" /> Change status</button>
						<a href={`/edit-mission/${mission.slug}`} className={`flex items-center w-full p-2 rounded-lg transition duration-300 tracking-wide hover:bg-neutral-700`}><FilePen className="w-6 h-6 mr-2" /> Edit mission</a>
						<button type='button' onClick={handleDelete} className={`flex items-center w-full p-2 rounded-lg transition duration-300 tracking-wide bg-red-900/30 hover:bg-red-900`}><Trash className="w-6 h-6 mr-2" /> Remove mission</button>
						<hr />
						
						<button type='button' disabled={mission.isPosted || isSubmitting} onClick={handlePosting} className={`flex items-center w-full p-2 rounded-lg transition duration-300 tracking-wide hover:bg-neutral-700 disabled:hover:bg-transparent disabled:text-neutral-500`}>{mission.isPosted ? <MailCheck className="w-6 h-6 mr-2" /> : <Mail className="w-6 h-6 mr-2" />} {mission.isPosted ? "Briefing posted" : "Post briefing"} </button>
					</div>
				</div>
			)}
		</div>
	)
}

export default observer(MissionOptions)