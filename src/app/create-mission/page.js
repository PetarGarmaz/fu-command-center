import React from 'react'
import NewMission from '@/components/NewMission'

const CreateMissionPage = () => {
	return (
		<section id="create-mission" className='bg-radial-[at_100%_100%] from-red-900/30 to-transparent min-h-screen'>
			<NewMission type={"create"} slug={""}/>
		</section>
	)
}

export default CreateMissionPage