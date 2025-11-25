import React from 'react'
import NewMission from '@/components/NewMission'

const EditMissionPage = async ({params}) => {
	const {slug} = await params;

	return (
		<section id="edit-mission" className='bg-radial-[at_100%_100%] from-red-900/30 to-transparent min-h-screen'>
			<NewMission type={"edit"} slug={slug}/>
		</section>
	)
}

export default EditMissionPage