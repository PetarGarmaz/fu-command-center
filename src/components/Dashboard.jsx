import { observer } from 'mobx-react-lite'
import Featured from '@/components/Featured'
import FeaturedOptional from '@/components/FeaturedOptional'
import Upcoming from '@/components/Upcoming'
import Archived from '@/components/Archived'
import { missionStore } from '@/stores/missionStore'


const Dashboard = () => {
	return (
		<div className='fade-opacity container mx-auto px-5 py-10'>
			<Featured mission={missionStore.featuredMission}/>
			<FeaturedOptional mission={missionStore.featuredMissionOptional}/>
			<Upcoming upcomingMissions={missionStore.paginatedUpcomingMissions}/>
			<Archived archivedMissions={missionStore.paginatedArchivedMissions}/>
		</div>
	)
}

export default observer(Dashboard)