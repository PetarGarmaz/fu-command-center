import { X } from 'lucide-react';
import React, { useState } from 'react'
import { createPortal } from "react-dom";

const MissionStatusDialog = ({menu, setMenu, store, mission}) => {
	const [newStatus, setNewStatus] = useState(true);
	const [newStatusDesc, setNewStatusDesc] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e) => {
		setIsSubmitting(true);

		await store.editMissionStatus(mission.id, mission, newStatus, newStatusDesc);

		setIsSubmitting(false);
	};

	return (
		<>
			{menu && createPortal(
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

					<div className="relative rounded-lg bg-neutral-800 font-bold">
						<div className='flex gap-20'>
							<h2 className='p-4 uppercase text-2xl tracking-wide'>Change Mission Status</h2>
							<button type='button' onClick={() => setMenu(false)} className={`flex items-center `}>
								<X className="w-10 h-10 mr-2 p-2 rounded-lg transition duration-300 hover:bg-neutral-700" />
							</button>
						</div>

						<hr />
						
						<form onSubmit={handleSubmit} className='flex flex-col p-4 gap-10'>
							<div className='flex flex-col gap-2'>
								<label className='text-xl font-semibold uppercase tracking-wide'>Mission Outcome</label>
								<div className='flex gap-5'>
									<div className='flex gap-4 bg-zinc-900 border border-neutral-800 py-2 px-4 rounded-md'>
										<input type="checkbox" id="outcome_success" name="outcome_success" checked={newStatus} onChange={(e) => setNewStatus(true)} className='w-6 h-6'/>
										<p className='font-normal'>Success</p>
									</div>

									<div className='flex gap-4 bg-zinc-900 border border-neutral-800 py-2 px-4 rounded-md'>
										<input type="checkbox" id="outcome_fail" name="outcome_fail" checked={!newStatus} onChange={(e) => setNewStatus(false)} className='w-6 h-6'/>
										<p className='font-normal'>Failure</p>
									</div>
								</div>
							</div>

							<div className='flex flex-col gap-2'>
								<label className='text-xl font-semibold uppercase tracking-wide'>Status Description</label>
								<input type="text" required id="status" name="status" value={newStatusDesc} onChange={(e) => setNewStatusDesc(e.target.value)} placeholder='Mission completed, Mission failed...' className='font-normal bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-2 text-white text-lg '/>
							</div>


							<div className='flex flex-col gap-2'>
								<button type='submit' disabled={isSubmitting} className='lg:col-span-4 col-span-5 bg-red-800/30 hover:bg-red-500/70 rounded-md p-2 text-white text-lg uppercase font-semibold tracking-wider transition duration-300'>Change Status</button>
							</div>
						</form>
					</div>
				</div>, document.body		
			)}
		</>
	)
}

export default MissionStatusDialog
