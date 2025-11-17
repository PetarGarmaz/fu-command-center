import ArchiveCard from '@/components/ArchiveCard'
import React, { useEffect, useState } from 'react'
import { Archive } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import FilterNoMatch from '@/components/FilterNoMatch';
import PaginationBar from '@/components/PaginationBar';

const Archived = ({archivedMissions}) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		if(archivedMissions.length > 0) {
			setMounted(true);
		}
	}, [archivedMissions]);

	if(!mounted) {
		return (
			<section id="archived" className='mt-20'>
				<h2 className='text-4xl uppercase font-bold tracking-wider'>No archived missions</h2>
				<p className='text-neutral-500 text-lg font-semibold'>There are currently no archived missions.</p>
			</section>
		);
	};

	return (
		<section id="archived" className='mt-20'>
			<div className='flex items-center gap-5'>
				<Archive className='w-15 h-15'/>

				<div>
					<h2 className='text-4xl uppercase font-bold tracking-wider'>Archived missions</h2>
					<p className='text-neutral-500 text-lg font-semibold'>Review mission details for archived missions that were already played.</p>
				</div>
			</div>

			<FilterBar type={"archived"}/>

			{archivedMissions.length > 0 ? (
				<div className='mt-10 grid grid-cols-1 gap-5'>
					{archivedMissions.map((mission, index) => (
						<ArchiveCard key={index} mission={mission}/>
					))}
				</div>
			) : (
				<FilterNoMatch/>
			)}

			<PaginationBar type={"archived"}/>
		</section>
	)
}

export default Archived