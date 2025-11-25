import Profile from '@/components/Profile'

const ProfilePage = async ({params}) => {
	const {slug} = await params;

	return (
		<div className='bg-radial-[at_50%_0%] from-red-900/20 to-transparent min-h-screen'>
			<Profile slug={slug}/>
		</div>
	)
}

export default ProfilePage