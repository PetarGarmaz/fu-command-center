import MissionCard from '@/components/MissionCard'
import React, { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import FilterNoMatch from '@/components/FilterNoMatch';
import PaginationBar from '@/components/PaginationBar';

const Upcoming = ({upcomingMissions}) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		if(upcomingMissions.length > 0) {
			setMounted(true);
		}
	}, [upcomingMissions]);

	if(!mounted) {
		return (
			<section id="upcoming" className='mt-20'>
				<h2 className='lg:text-4xl text-2xl uppercase font-bold tracking-wider'>No upcoming missions</h2>
				<p className='text-neutral-500 lg:text-lg text-base font-semibold'>There are currently no upcoming mission in the near future. Check back later, or tell Bizo to make something.</p>
			</section>
		);
	};

	return (
		<section id="upcoming" className='mt-20'>
			<div className='flex items-center gap-5'>
				<CalendarDays className='w-15 h-15'/>

				<div>
					<h2 className='lg:text-4xl text-2xl uppercase font-bold tracking-wider'>Upcoming missions</h2>
					<p className='text-neutral-500 lg:text-lg text-base font-semibold'>Review mission details for future Friday operations.</p>
				</div>
			</div>

			<FilterBar type={"upcoming"}/>

			{upcomingMissions.length > 0 ? (
				<div className='mt-10 grid lg:grid-cols-3 grid-cols-1 gap-5'>
					{upcomingMissions.map((mission, index) => (
						<MissionCard key={index} mission={mission}/>
					))}
				</div>
			) : (
				<FilterNoMatch/>
			)}

			<PaginationBar type={"upcoming"}/>
		</section>
	)
}

export default Upcoming