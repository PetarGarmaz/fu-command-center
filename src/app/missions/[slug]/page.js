import Mission from '@/components/Mission'
import { supabase } from "@/utilities/supabaseClient";

export async function generateMetadata({ params }) {
	const { data: post, error } = await supabase.from("missions").select("*").eq("slug", params.slug).single();

	return {
		title: post.title,
		description: post.sections[0].description,
		openGraph: {
			title: post.title,
			description: post.sections[0].description,
			url: `https://fu-command-center.vercel.app/missions/${params.slug}`,
			images: [
				{
					url: post.image ?? "https://fu-command-center.vercel.app/fu_placeholder.jpg",
					width: 1200,
					height: 630,
				},
			],
			type: "article",
		},
	};
}

const MissionPage = async({params}) => {
	const {slug} = await params;

	return (
		<div className='bg-radial-[at_50%_0%] from-red-900/20 to-transparent min-h-screen'>
			<Mission slug={slug}/>
		</div>
	)
}

export default MissionPage