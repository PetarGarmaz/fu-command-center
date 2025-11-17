"use client"

import { observer } from 'mobx-react-lite'
import Featured from '@/components/Featured'
import Upcoming from '@/components/Upcoming'
import Archived from '@/components/Archived'
import NewMission from "@/components/NewMission"
import { missionStore } from '@/stores/missionStore'

const Dashboard = () => {

	return (
		<div className='container mx-auto px-20 py-10'>
			<Featured mission={missionStore.featuredMission}/>
			<Upcoming upcomingMissions={missionStore.paginatedUpcomingMissions}/>
			<Archived archivedMissions={missionStore.paginatedArchivedMissions}/>
		</div>
	)
}

export default observer(Dashboard)