"use client"

import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { CheckCircle, PlusSquare, X} from 'lucide-react';
import { missionStore } from '@/stores/missionStore'
import { formStore } from '@/stores/formStore'
import { supabase } from "@/utilities/supabaseClient";

const NewMission = () => {
	const [creator, setCreator] = useState(null);

	async function signInWithDiscord() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'discord',
			options: {
				redirectTo: window.location.href
			}
		})
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		formStore.isSubmitting = true;

		try {
			const response = await missionStore.addMission(formStore.formData);

			if (response) {
				formStore.submitSuccess = true;

				//Clear form
				formStore.setFormData({
					title: "",
					creator: user,
					host: "",
					type: "Main",
					date: "2025-11-14",
					map: "",
					sections: [
						{ title: "Situation", description: "" }
					],
					image: "",
					status: "",
					statusDesc: "",
					roles: [],
					attachedMission: {}
				});
			};
		} catch (error) {
			console.error('Error submitting form:', error.message);
			alert(`Error submitting form: ${error.message}. Try again or contact Bizo.`);
		} finally {
			formStore.isSubmitting = false;
		}
	}

	const getUser = async () => {
		const { data: { user } } = await supabase.auth.getUser();
		setCreator(user);
	}

	useEffect(() => {
		getUser();		
	}, []);

	if(!creator) {
		return(
			<div className='container mx-auto py-20 px-40'>
				<section className='relative py-10 rounded-lg backdrop-blur-lg bg-black/30 border border-red-900/30 my-5 overflow-hidden'>
					{/*Special line*/}
					<div className='absolute bg-linear-to-r top-0 left-0 h-1 w-full from-red-900 via-amber-800 to-red-900 z-20'></div>

					<div className='mx-auto'>
						<div className="flex justify-center mb-6">
							<div className="w-20 h-20 rounded-full bg-neutral-600/30 flex items-center justify-center">
								<X className="w-10 h-10 text-zinc-400" />
							</div>
						</div>
						<h1 className='text-center text-3xl text-zinc-400 font-semibold uppercase tracking-wide'>NOT SIGNED IN</h1>
						<p className='text-center text-lg text-zinc-400 mt-5'>You cannot make missions if you aren't signed in.</p>

						<div className='grid grid-cols-2 gap-10 mx-10 mt-10'>
							<button type='button' onClick={() => signInWithDiscord()} className='bg-red-800/50 hover:bg-neutral-800/50 rounded-md p-2 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>Log In</button>
							<a href='/' className='text-center bg-neutral-700/50 hover:bg-neutral-500/50 rounded-md p-2 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>Back to Dashboard</a>
						</div>
					</div>
				</section>
			</div>
		)
	};

	if(formStore.submitSuccess) {
		return (
			<div className='container mx-auto py-20 px-40'>
				<section className='relative py-10 rounded-lg backdrop-blur-lg bg-black/30 border border-red-900/30 my-5 overflow-hidden'>
					{/*Special line*/}
					<div className='absolute bg-linear-to-r top-0 left-0 h-1 w-full from-red-900 via-amber-800 to-red-900 z-20'></div>

					<div className='mx-auto'>
						<div className="flex justify-center mb-6">
							<div className="w-20 h-20 rounded-full bg-neutral-600/30 flex items-center justify-center">
								<CheckCircle className="w-10 h-10 text-zinc-400" />
							</div>
						</div>
						<h1 className='text-center text-3xl text-zinc-400 font-semibold uppercase tracking-wide'>MISSION CREATED</h1>
						<p className='text-center text-lg text-zinc-400 mt-5'>You've successfully scheduled a mission.</p>

						<div className='grid grid-cols-2 gap-10 mx-10 mt-10'>
							<button type='button' onClick={() => formStore.setSubmitSuccess(false)} className='bg-red-800/50 hover:bg-neutral-800/50 rounded-md p-2 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>New Mission</button>
							<a href='/' className='text-center bg-neutral-700/50 hover:bg-neutral-500/50 rounded-md p-2 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>Back to Dashboard</a>
						</div>
					</div>
				</section>
			</div>
		)
	}

	return (
		<div className='container mx-auto py-20 px-40'>
			{/* Go back*/}
			<a href='/' className=' rounded-lg my-5 py-2 px-5 hover:bg-neutral-800 transition duration-300'>← Back to Dashboard</a>

			{/* Titles...*/}
			<div className='flex items-center gap-5 my-5'>
				<PlusSquare className='h-20 w-20'/>

				<div>
					<h1 className='text-4xl font-bold uppercase tracking-widest'>Create New Mission</h1>
					<p className='text-xl text-neutral-500 trakcing-wider'>Plan and schedule a new mission.</p>
				</div>
			</div>

			{/* Main form */}
			<form onSubmit={(e) => handleSubmit(e)} className='relative'>
				<div className='p-10 my-10 rounded-lg bg-black/30 border border-red-900/30 overflow-hidden'>
					<h2 className='text-3xl font-semibold uppercase tracking-wider'>Mission details</h2>

					<div className='mt-10 grid grid-cols-2 gap-10'>
						<div className='flex flex-col col-span-2 gap-2'>
							<label className='text-xl font-semibold uppercase tracking-wide'>Operation Name *</label>
							<input type="text" required id="title" name="title" value={formStore.formData.title} onChange={(e) => formStore.handleInputChange(e)} placeholder='Operation: Emerald, Operation: D-Day, etc...' className='bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-2 text-white text-lg '/>
						</div>

						<div className='flex flex-col gap-2'>
							<label className='text-xl font-semibold uppercase tracking-wide'>Host *</label>
							<input type="text" required id="host" name="host" value={formStore.formData.host} onChange={(e) => formStore.handleInputChange(e)} placeholder='Warlord Beezo, Sajfert, Slobodan Beast, Nameless Novichok, etc...' className='bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-2 text-white text-lg '/>
						</div>

						<div className='flex flex-col gap-2'>
							<label className='text-xl font-semibold uppercase tracking-wide'>Date *</label>
							<input type="date" required step="7" id="date" name="date" value={formStore.formData.date} onChange={(e) => formStore.handleInputChange(e)} placeholder='Warlord Beezo, Sajfert, Slobodan Beast, Nameless Novichok, etc...' className='bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-2 text-white text-lg '/>
						</div>

						<div className='flex flex-col gap-2'>
							<label className='text-xl font-semibold uppercase tracking-wide'>Terrain</label>
							<input type="text" id="terrain" name="terrain" value={formStore.formData.map} onChange={(e) => formStore.handleInputChange(e)} placeholder='Altis, Chernarus, Farabad, Sahrani, etc..' className='bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-2 text-white text-lg '/>
						</div>
					</div>
				</div>

				<div className='p-10 my-10 rounded-lg bg-black/30 border border-red-900/30 overflow-hidden'>
					<h2 className='text-3xl font-semibold uppercase tracking-wider'>Mission Briefing</h2>

						<div className='flex flex-col col-span-2 gap-10 mt-10'>
							{formStore.formData.sections.map((section, index) => (
								<div key={index} className='flex flex-col'>
									<label className='text-xl font-semibold uppercase tracking-wide'>Briefing Section {index + 1}</label>

									<label className='text-lg mt-2 font-semibold uppercase tracking-wide'>Title *</label>
									<div className='flex gap-2'>
										<input type="text" required id="briefing_title" name="briefing_title" value={section.title} onChange={(e) => formStore.handleBriefingChange(e, index)} placeholder='Situation, Mission, Objectives, Execution, Enemy forces, etc...' className='mt-2 w-full bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-2 text-white text-lg '/>
										
										{index > 0 && (
											<button type='button' onClick={() => formStore.removeSection(index)} className='place-self-center bg-red-800/30 hover:bg-red-600/50 rounded-md text-white transition duration-300 h-10 w-10'>
												<X className='place-self-center'/>
											</button>
										)}
									</div>

									<label className='text-lg mt-2 font-semibold uppercase tracking-wide'>Description *</label>
									<textarea id="briefing_desc" required name="briefing_desc" value={section.description} onChange={(e) => formStore.handleBriefingChange(e, index)} placeholder='Lorem ipsum dolor sit amet, consectetur adipiscing elit...' className='bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-2 text-white text-lg '/>
								</div>
							))}

							<button type='button' onClick={() => formStore.addSection()} className='mt-2 bg-black/50 hover:bg-neutral-800/50 rounded-md p-1 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>Add Section</button>
						</div>
				</div>

				<div className='p-10 my-10 rounded-lg bg-black/30 border border-red-900/30 overflow-hidden'>
					<h2 className='text-3xl font-semibold uppercase tracking-wider'>Roles</h2>

					<div className='flex flex-col gap-2 mt-10'>
						{formStore.formData.roles.map((role, index) => (
							<div key={index} className='flex gap-2'>
								<img src={Object.values(missionStore.availableRoles).find(roleData => roleData.key == role.name).icon} alt="" className='w-10 h-10'/>

								<select type="select" id="roles_name" name="roles_name" value={role.name} onChange={(e) => formStore.handleRolesChange(e, index)} className=' bg-zinc-900 border border-neutral-800 focus:border-red-800/30 rounded-md p-2 text-white text-lg focus:outline-none'>
									{Object.values(missionStore.availableRoles).map((roleData, roleIndex) => (
										<option key={roleIndex} value={roleData.key}>{roleData.name}</option>
									))}
								</select>

								<input type="number" required min="1" max="5" id="roles_slots" name="roles_slots" value={role.slots} onChange={(e) => formStore.handleRolesChange(e, index)} placeholder='0' className='bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-2 text-white text-lg '/>
							
								<button type='button' onClick={() => formStore.removeRole(index)} className='place-self-center bg-red-800/30 hover:bg-red-600/50 rounded-md text-white transition duration-300 h-10 w-10'>
									<X className='place-self-center'/>
								</button>
							</div>
						))}
						<button type='button' onClick={() => formStore.addRole()} className='mt-2 bg-black/50 hover:bg-neutral-800/50 rounded-md p-1 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>Add Role</button>
					</div>
				</div>

				
				<div className='grid grid-cols-5 mt-20 gap-10'>
					<button type='submit' className='col-span-4 bg-red-800/30 hover:bg-red-500/70 rounded-md p-2 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>Create Mission</button>
					<a href='/' className='text-center bg-black/50 hover:bg-neutral-800/50 rounded-md p-2 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>Cancel</a>
				
				</div>
			</form>
		</div>
	)
}

export default observer(NewMission)