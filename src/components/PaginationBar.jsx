import {ChevronLeft, ChevronRight} from 'lucide-react';
import { missionStore } from '@/stores/missionStore'

const PaginationBar = ({type}) => {

	if(type == "upcoming") {
		const pages = Array.from({ length: missionStore.totalUpcomingPages }, (_, i) => i + 1);

		return (
			<div className='flex mt-10 gap-2 justify-center'>
				<button type='button' disabled={missionStore.currentUpcomingPage == 1} onClick={() => missionStore.setCurrentUpcomingPage(Math.max(1, missionStore.currentUpcomingPage - 1))} className='cursor-pointer w-10 h-10 rounded-lg bg-black/30 hover:bg-neutral-800/50 transition duration-300 disabled:bg-neutral-900/70 disabled:text-neutral-600'>
					<ChevronLeft className='place-self-center'/>
				</button>

				{pages.map((page, index) => (
					<button type='button' key={index} onClick={() => missionStore.setCurrentUpcomingPage(page)} className={`cursor-pointer w-10 h-10 rounded-lg transition duration-300 ${page == missionStore.currentUpcomingPage ? "bg-red-800/30 hover:bg-red-600" : "bg-black/30 hover:bg-neutral-800/50"}`}>
						{page}
					</button>
				))}

				<button type='button' disabled={missionStore.currentUpcomingPage == missionStore.totalUpcomingPages || missionStore.totalUpcomingPages == 0} onClick={() => missionStore.setCurrentUpcomingPage(Math.max(missionStore.totalUpcomingPages, missionStore.currentUpcomingPage + 1))} className='cursor-pointer w-10 h-10 rounded-lg bg-black/30 hover:bg-neutral-800/50 transition duration-300 disabled:bg-neutral-900/70 disabled:text-neutral-600'>
					<ChevronRight className='place-self-center'/>
				</button>
			</div>
		)
	} else if (type == "archived") {
		const pages = Array.from({ length: missionStore.totalArchivedPages }, (_, i) => i + 1);

		return (
			<div className='flex mt-10 gap-2 justify-center'>
				<button type='button' disabled={missionStore.currentArchivedPage == 1} onClick={() => missionStore.setCurrentArchivedPage(Math.max(1, missionStore.currentArchivedPage - 1))} className='cursor-pointer w-10 h-10 rounded-lg bg-black/30 hover:bg-neutral-800/50 transition duration-300 disabled:bg-neutral-900/70 disabled:text-neutral-600'>
					<ChevronLeft className='place-self-center'/>
				</button>

				{pages.map((page, index) => (
					<button type='button' key={index} onClick={() => missionStore.setCurrentArchivedPage(page)} className={`cursor-pointer w-10 h-10 rounded-lg transition duration-300 ${page == missionStore.currentArchivedPage ? "bg-red-800/30 hover:bg-red-600" : "bg-black/30 hover:bg-neutral-800/50"}`}>
						{page}
					</button>
				))}

				<button type='button' disabled={missionStore.currentArchivedPage == missionStore.totalArchivedPages || missionStore.totalArchivedPages == 0} onClick={() => missionStore.setCurrentArchivedPage(Math.max(missionStore.totalArchivedPages, missionStore.currentArchivedPage + 1))} className='cursor-pointer w-10 h-10 rounded-lg bg-black/30 hover:bg-neutral-800/50 transition duration-300 disabled:bg-neutral-900/70 disabled:text-neutral-600'>
					<ChevronRight className='place-self-center'/>
				</button>
			</div>
		)
	}	
}

export default PaginationBar