import Mission from '@/components/Mission'
import { supabase } from "@/utilities/supabaseClient";
import html2md from "html-to-md";

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const { data, error } = await supabase.from("missions").select("*");
	const post = data.find(mission => mission.slug === slug);

	const description = html2md(post?.sections[0].description);
	const shortDescription = description.slice(0, 250);

	return {
		title: post?.title,
		description: shortDescription,
		openGraph: {
			title: post?.title,
			description: shortDescription,
			url: `https://fu-command-center.vercel.app/missions/${slug}`,
			images: [
				{
					url: post?.image ?? "https://fu-command-center.vercel.app/fu_placeholder.jpg",
					width: 1200,
					height: 630,
				},
			],
			type: "website",
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