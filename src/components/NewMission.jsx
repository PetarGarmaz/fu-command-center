"use client"

import React, { useState, useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { CheckCircle, PlusSquare, X, Upload} from 'lucide-react';
import { missionStore } from '@/stores/missionStore'
import { formStore } from '@/stores/formStore'
import { userStore } from '@/stores/userStore'
import { supabase } from "@/utilities/supabaseClient";
import RichTextEditor from '@/components/TextEditor';
import ClientOnly from "@/components/ClientOnly";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const NewMission = ({type, slug}) => {
	const [dragActive, setDragActive] = useState(false);
	const [selectedDate, setSelectedDate] = useState(Date.now());
	const [editMission, setEditMission] = useState(null);
	

	function isFriday(date) {
		return date.getDay() === 5;
	}

	const getNextAvailableFriday = () => {
		if(type !== "edit") {
			const date = new Date();
			const day = date.getDay();
			const daysUntilFriday = (5 - day + 7) % 7 || 7;
			date.setDate(date.getDate() + daysUntilFriday);

			while (missionStore.missions.some(m => m.date.split("T")[0] === toLocalYMD(date))) {
				date.setDate(date.getDate() + 7);
			};

			setSelectedDate(date);
		}
	}

	function toLocalYMD(date) {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, "0");
		const d = String(date.getDate()).padStart(2, "0");
		return `${y}-${m}-${d}`;
	}

	const isDateAvailable = (date) => {
		const isTaken = missionStore.missions.some((m) => m.date.split("T")[0] === toLocalYMD(date));

		if (formStore.formData.type === "main") {
			return isFriday(date) && !isTaken;
		}
		
		return !isTaken;
	};

	const handleImageUpload = (file) => {
		formStore.handleImageUpload(file, false);
	};

	const removeImage = () => {
		formStore.handleImageUpload(null, true);
	}

	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleImageUpload(e.dataTransfer.files);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		formStore.setIsSubmitting(true);

		try {
			const processedTime = new Date(selectedDate);
			var processedImage = "";

			//Send image to the database
			if(formStore.formData.image instanceof File) {
				const filePath = formStore.formData.image.name;

				const { error } = await supabase.storage.from("images").upload(filePath, formStore.formData.image, {cacheControl: '3600',upsert: true});
				
				if (error) {
					throw new TypeError("Image upload failed: " + error.message);
				} else {
					console.log(`Uploaded: ${filePath}`);

					// Get public URL
					const { data } = supabase.storage.from("images").getPublicUrl(filePath);
					processedImage = data.publicUrl;
					
					console.log("File available at:", data.publicUrl);
				};
			} else {
				processedImage = formStore.formData.image;
			}

			if(type == "edit") {
				const response = await missionStore.editMission(editMission.id, formStore.formData, userStore.currentUser, processedImage, processedTime.toISOString());

				if (response) {
					formStore.setSubmitSuccess(true);

					//Clear form
					formStore.setFormData({
						title: "",
						creator: {},
						host: "",
						type: "main",
						date: null,
						map: "",
						sections: [
							{ title: "Situation", description: "" }
						],
						image: "",
						status: false,
						statusDesc: "",
						roles: [],
						attachedMission: "",
						faction: ""
					});
				};
			} else {
				const response = await missionStore.addMission(formStore.formData, userStore.currentUser, processedImage, processedTime.toISOString());

				if (response) {
					formStore.setSubmitSuccess(true);

					//Clear form
					formStore.setFormData({
						title: "",
						creator: {},
						host: "",
						type: "main",
						date: null,
						map: "",
						sections: [
							{ title: "Situation", description: "" }
						],
						image: "",
						status: false,
						statusDesc: "",
						roles: [],
						attachedMission: "",
						faction: ""
					});
				};
			}
		} catch (error) {
			console.error('Error submitting form:', error.message);
			alert(`Error submitting form: ${error.message}. Try again or contact Bizo.`);
		} finally {
			formStore.setIsSubmitting(false);
		}
	}

	useEffect(() => {
		if(type == "edit") {
			const missionData = missionStore.missions.find(m => m.slug === slug);

			if(missionData) {
				formStore.setFormData({...formStore.formData, 
					title: missionData.title,
					host: missionData.host,
					type: missionData.type,
					date: missionData.date,
					map: missionData.map,
					sections: missionData.sections,
					status: missionData.status,
					statusDesc: missionData.statusDesc,
					roles: missionData.roles,
					attachedMission: missionData.attachedMission,
					faction: missionData.faction,
					image: missionData.image
				});

				setSelectedDate(new Date(missionData.date));
				setEditMission(missionData);
			}
		}

		getNextAvailableFriday();
	}, [formStore.type, missionStore.missions]);

	if(!userStore.currentUser) {
		return(
			<div className='fade-opacity-delay opacity-0 container mx-auto py-20 px-40'>
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
			<div className='fade-opacity container mx-auto py-20 lg:px-40 px-10 max-sm:px-5'>
				<section className='relative py-10 px-5 rounded-lg backdrop-blur-lg bg-black/30 border border-red-900/30 my-5 overflow-hidden'>
					{/*Special line*/}
					<div className='absolute bg-linear-to-r top-0 left-0 h-1 w-full from-red-900 via-amber-800 to-red-900 z-20'></div>

					<div className='mx-auto'>
						<div className="flex justify-center mb-6">
							<div className="w-20 h-20 rounded-full bg-neutral-600/30 flex items-center justify-center">
								<CheckCircle className="w-10 h-10 text-zinc-400" />
							</div>
						</div>
						<h1 className='text-center text-3xl text-zinc-400 font-semibold uppercase tracking-wide'>MISSION {type == "edit" ? "EDITED" : "CREATED"}</h1>
						<p className='text-center text-lg text-zinc-400 mt-5'>You've successfully scheduled a mission.</p>

						<div className='grid lg:grid-cols-2 grid-cols-1 gap-10 mx-10 mt-10'>
							<button type='button' onClick={() => formStore.setSubmitSuccess(false)} className='bg-red-800/50 hover:bg-neutral-800/50 rounded-md p-2 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>New Mission</button>
							<a href='/' className='text-center bg-neutral-700/50 hover:bg-neutral-500/50 rounded-md p-2 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>Back to Dashboard</a>
						</div>
					</div>
				</section>
			</div>
		)
	}

	return (
		<div className='fade-opacity container mx-auto py-20 lg:px-40 px-10 max-sm:px-5'>
			{/* Go back*/}
			<a href='/' className='rounded-lg my-5 py-2 px-5 hover:bg-neutral-800 transition duration-300 text-lg'>← Back to Dashboard</a>

			{/* Titles...*/}
			<div className='flex items-center gap-5 my-5'>
				<PlusSquare className='lg:h-20 lg:w-20 w-10 h-10'/>

				<div>
					<h1 className='lg:text-4xl text-2xl font-bold uppercase tracking-widest'>Create New Mission</h1>
					<p className='lg:text-xl text-lg text-neutral-500 trakcing-wider'>Plan and schedule a new mission.</p>
				</div>
			</div>

			{/* Main form */}
			<form onSubmit={(e) => handleSubmit(e)} className='relative'>
				<div className='lg:p-10 p-5 my-10 rounded-lg bg-black/30 border border-red-900/30 overflow-hidden'>
					<h2 className='text-3xl font-semibold uppercase tracking-wider'>Mission details</h2>

					<div className='mt-10 grid lg:grid-cols-2 grid-cols-1 gap-10'>
						{/* OPERATION NAME */}
						<div className='flex flex-col lg:col-span-2 gap-2'>
							<label className='text-xl font-semibold uppercase tracking-wide'>Operation Name *</label>
							<input type="text" required id="title" name="title" value={formStore.formData.title} onChange={(e) => formStore.handleInputChange(e)} placeholder='Operation: Emerald, Operation: D-Day, etc...' className='bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-2 text-white lg:text-lg '/>
						</div>

						{/* HOST */}
						<div className='flex flex-col gap-2'>
							<label className='text-xl font-semibold uppercase tracking-wide'>Host *</label>
							<input type="text" required id="host" name="host" value={formStore.formData.host} onChange={(e) => formStore.handleInputChange(e)} placeholder='Warlord Beezo, Sajfert, Slobodan Beast, Nameless Novichok, etc...' className='bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-2 text-white lg:text-lg '/>
						</div>

						{/* TYPE */}
						<div className='flex flex-col gap-2'>
							<label className='text-xl font-semibold uppercase tracking-wide'>Mission type *</label>
							<select type="select" id="type" name="type" value={formStore.formData.type} onChange={formStore.handleInputChange} className=' bg-zinc-900 border border-neutral-800 focus:border-red-800/30 rounded-md p-2 text-white lg:text-lg focus:outline-none'>
								<option value="main">Main</option>
								<option value="optional">Optional</option>
								<option value="training">Training</option>
							</select>
						</div>

						{/* DATE */}
						<div className='flex flex-col gap-2'>
							<label className='text-xl font-semibold uppercase tracking-wide'>Date *</label>
							<ClientOnly>
								<DatePicker required showTimeSelect timeFormat="HH:mm" dateFormat="EEEE, MMMM d, yyyy HH:mm" timeIntervals={30} timeInputLabel="Time" selected={selectedDate} onChange={(date) => setSelectedDate(date)} minDate={new Date()} maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))} filterDate={isDateAvailable} id="date" name="date" className='bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-2 text-white lg:text-lg w-full'/>
							
							</ClientOnly>
						</div>

						{/* Empty div to split up required from non required */}
						<div></div>

						{/* TERRAIN */}
						<div className='flex flex-col gap-2'>
							<label className='text-xl font-semibold uppercase tracking-wide'>Terrain</label>
							<input type="text" id="terrain" name="terrain" value={formStore.formData.map} onChange={(e) => formStore.handleInputChange(e)} placeholder='Altis, Chernarus, Farabad, Sahrani, etc..' className='bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-2 text-white lg:text-lg '/>
						</div>

						{/* FACTION */}
						<div className='flex flex-col gap-2'>
							<label className='text-xl font-semibold uppercase tracking-wide'>Faction</label>
							<input type="text" id="faction" name="faction" value={formStore.formData.faction} onChange={(e) => formStore.handleInputChange(e)} placeholder='NATO, CSAT, AAF, etc...' className='bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-2 text-white lg:text-lg '/>
						</div>
					</div>
				</div>

				{/* BRIEFING */}
				<div className='lg:p-10 p-5 my-10 rounded-lg bg-black/30 border border-red-900/30 overflow-hidden'>
					<h2 className='text-3xl font-semibold uppercase tracking-wider'>Mission Briefing</h2>


						<div className='flex flex-col gap-10 mt-10'>
							{formStore.formData.sections.map((section, index) => (
								<div key={index} className='flex flex-col'>
									<label className='text-xl font-semibold uppercase tracking-wide'>Briefing Section {index + 1}</label>

									<label className='lg:text-lg mt-2 font-semibold uppercase tracking-wide'>Title *</label>
									<div className='flex gap-2 items-center justify-between mt-2'>
										<input type="text" required id="briefing_title" name="briefing_title" value={section.title} onChange={(e) => formStore.handleBriefingChange(e, true, index)} placeholder='Situation, Mission, Objectives, Execution, Enemy forces, etc...' className='w-full bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-2 text-white lg:text-lg items-center justify-center'/>
										
										{index > 0 && (
											<button type='button' onClick={() => formStore.removeSection(index)} className='bg-red-800/30 hover:bg-red-600/50 rounded-md text-white transition duration-300 w-10 h-10 flex shrink-0 items-center justify-center'>
												<X className='w-6 h-6'/>
											</button>
										)}
									</div>

									<label className='lg:text-lg mt-2 font-semibold uppercase tracking-wide'>Description *</label>
									<RichTextEditor value={section.description} onChange={(e) => formStore.handleBriefingChange(e, false, index)} placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."/>
								</div>
							))}

							<button type='button' onClick={() => formStore.addSection()} className='mt-2 bg-black/50 hover:bg-neutral-800/50 rounded-md p-1 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>Add Section</button>
						</div>
				</div>

				{/* ROLES */}
				<div className='lg:p-10 p-5 my-10 rounded-lg bg-black/30 border border-red-900/30 overflow-hidden'>
					<h2 className='text-3xl font-semibold uppercase tracking-wider'>Roles</h2>

					<div className='flex flex-col gap-2 mt-10'>
						{formStore.formData.roles.map((role, index) => (
							<div key={index} className='flex gap-2 items-center justify-between'>
								<img src={Object.values(missionStore.availableRoles).find(roleData => roleData.key == role.name).icon} alt="" className='shrink-0 w-10 h-10'/>

								<select type="select" id="roles_name" name="roles_name" value={role.name} onChange={(e) => formStore.handleRolesChange(e, index)} className='w-full bg-zinc-900 border border-neutral-800 focus:border-red-800/30 rounded-md p-2 text-white lg:text-lg focus:outline-none'>
									{Object.values(missionStore.availableRoles).map((roleData, roleIndex) => (
										<option key={roleIndex} value={roleData.key}>{roleData.name}</option>
									))}
								</select>

								<input type="number" required min="1" max="50" id="roles_slots" name="roles_slots" value={role.slots} onChange={(e) => formStore.handleRolesChange(e, index)} placeholder='0' className='bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-2 text-white lg:text-lg '/>
							
								<button type='button' onClick={() => formStore.removeRole(index)} className='bg-red-800/30 hover:bg-red-600/50 rounded-md text-white transition duration-300 w-10 h-10 flex shrink-0 items-center justify-center'>
									<X className='h-6 w-6'/>
								</button>
							</div>
						))}
						<button type='button' onClick={() => formStore.addRole()} className='mt-2 bg-black/50 hover:bg-neutral-800/50 rounded-md p-1 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>Add Role</button>
					</div>
				</div>

				{/* IMAGE */}
				<div className='lg:p-10 p-5 my-10 rounded-lg bg-black/30 border border-red-900/30 overflow-hidden'>
					<h2 className='text-3xl font-semibold uppercase tracking-wider'>Mission thumbnail</h2>

					<div className='flex flex-col gap-2 mt-10 '>
						<label className='text-xl font-semibold uppercase tracking-wide'>Image upload</label>
						<div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`flex flex-col gap-2 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-red-800 bg-black/30' : 'border-gray-300 hover:border-gray-400'}`}>
							
							<Upload className="w-12 h-12 mx-auto mb-4" />
							<p className="mb-2">Drag and drop images here.</p>
							<p className="text-gray-500 text-sm mb-4">Maximum file size: 5MB. Allowed image types: .png, .jpg, .bmp, .gif</p>

							<input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files)} className="hidden" id="image"/>

							<button type="button" onClick={() => document.getElementById('image').click()} className='col-span-4 bg-red-800/30 hover:bg-red-500/70 rounded-md p-2 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>
								Select Image
							</button>
						</div>
					</div>

					{formStore.formData.image && (
						<div className='flex flex-col gap-2 mt-10 '>
							<label className='text-xl font-semibold uppercase tracking-wide'>Image preview</label>
							<button type="button" onClick={() => removeImage()} className='relative w-full group cursor-pointer hover:bg-red-800/30 rounded-lg'>
								<img src={formStore.formData.image instanceof File ? URL.createObjectURL(formStore.formData.image) : formStore.formData.image} alt="image preview" className='w-full object-cover rounded-lg group-hover:opacity-50 transition-all duration-300'/>
								<X className='absolute h-20 w-20 top-5 right-5 opacity-0 group-hover:opacity-100 bg-red-900 p-3 rounded-lg transition-all duration-300'/>
							</button>
						</div>
					)}
				</div>

				{/* SUBMIT */}
				<div className='grid grid-cols-5 mt-20 gap-10'>
					{type == "edit" ? (
						<button type='submit' disabled={formStore.isSubmitting} className='lg:col-span-4 col-span-5 bg-red-800/30 hover:bg-red-500/70 disabled:bg-red-900/10 disabled:text-neutral-500 rounded-md p-2 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>Edit Mission</button>
					) : (
						<button type='submit' disabled={formStore.isSubmitting} className='lg:col-span-4 col-span-5 bg-red-800/30 hover:bg-red-500/70 rounded-md p-2 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>Create Mission</button>
					)}
					<a href='/' disabled={formStore.isSubmitting} className='text-center lg:col-span-1 col-span-5 bg-black/50 hover:bg-neutral-800/50 rounded-md p-2 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>Cancel</a>
				
				</div>
			</form>
		</div>
	)
}

export default observer(NewMission)