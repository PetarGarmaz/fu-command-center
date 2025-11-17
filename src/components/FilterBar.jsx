import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { Filter } from 'lucide-react';
import { missionStore } from '@/stores/missionStore'

const FilterBar = ({type}) => {
	const [searchbar, setSearchbar] = useState("");
	const [terrain, setTerrain] = useState("");
	const [role, setRole] = useState("");
	const [status, setStatus] = useState("");

	const handleInputChange = (e) => {
		let newSearch = searchbar;
		let newTerrain = terrain;
		let newRole = role;
		let newStatus = status;

		if(e.target.id == "search") {
			setSearchbar(e.target.value);
			newSearch = e.target.value;
		} else if (e.target.id == "terrain") {
			setTerrain(e.target.value);
			newTerrain = e.target.value;
		} else if (e.target.id == "roles") {
			setRole(e.target.value);
			newRole = e.target.value;
		} else if (e.target.id == "status") {
			setStatus(e.target.value);
			newStatus = e.target.value;
		};

		if(type == "upcoming") {
			missionStore.getFilteredUpcomingMissions(newSearch, newTerrain, newRole);
		} else if(type == "archived") {
			missionStore.getFilteredArchivedMissions(newSearch, newTerrain, newStatus);
		};
	}

	return (
		<div className='relative rounded-lg p-5 backdrop-blur-lg bg-black/30 border border-red-900/30 my-5 overflow-hidden grid grid-cols-5 gap-5'>
			{/*Filter icon and heading*/}
			<div className='flex my-auto ml-5 gap-5'>
				<Filter className='h-10 w-10'/>
				<h2 className='text-2xl'>Filters</h2>
			</div>

			{/*Searchbar*/}
			<div className='flex flex-col col-span-2 gap-2'>
				<label className='text-lg font-semibold uppercase tracking-widest'>SEARCH</label>
				<input type="text" id="search" name="search" value={searchbar} onChange={(e) => handleInputChange(e)} placeholder='Search by operation name or host name.' className='bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-1 text-white '/>
			</div>

			{/*Terrains*/}
			<div className='flex flex-col gap-2'>
				<label  className='text-lg font-semibold uppercase tracking-widest'>TERRAIN</label>

				<select type="select" id="terrain" name="terrain" value={terrain} onChange={(e) => handleInputChange(e)} className='bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-1 text-white '>
					<option value="">All</option>
					{missionStore.availableMaps.map((map, index) => (
						<option key={index} value={map}>{map}</option>
					))}
				</select>
			</div>

			{/*Roles*/}
			{type == "upcoming" && (
				<div className='flex flex-col gap-2'>
					<label className='text-lg font-semibold uppercase tracking-widest'>ROLES</label>
					<select type="select" id="roles" name="roles" value={role} onChange={(e) => handleInputChange(e)} className='bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-1 text-white '>
						<option value="">All</option>
						{Object.values(missionStore.availableRoles).map((role, index) => (
							<option key={index} value={role.key}>{role.name}</option>
						))}
					</select>
				</div>
			)}

			{/*Status*/}
			{type == "archived" && (
				<div className='flex flex-col gap-2'>
					<label className='text-lg font-semibold uppercase tracking-widest'>STATUS</label>
					<select type="select" id="status" name="status" value={status} onChange={(e) => handleInputChange(e)} className='bg-zinc-900 border border-neutral-800 focus:border-red-800/30 focus:outline-none rounded-md p-1 text-white '>
						<option value="">All</option>
						<option value="success">Success</option>
						<option value="failure">Failure</option>
					</select>
				</div>
			)}
		</div>
	)
}

export default observer(FilterBar)