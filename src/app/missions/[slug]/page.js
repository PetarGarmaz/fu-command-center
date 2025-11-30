import Mission from '@/components/Mission'
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export async function generateMetadata({ params }) {
	const cookieStore = cookies();

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.SUPABASE_SERVICE_ROLE_KEY,
		{
			cookies: {
				get(name) {
				return cookieStore.get(name)?.value;
				},
			},
		}
	);

	const { slug } = params;
	const { data, error } = await supabase.from("missions").select("*").eq("slug", slug).single();

	const post = data;

	return {
		title: post?.title ?? "Mission",
		description: post?.sections?.[0]?.description ?? "Mission briefing",
		openGraph: {
			title: post?.title ?? "Mission",
			description: post?.sections?.[0]?.description ?? "Mission briefing",
			url: `https://fu-command-center.vercel.app/missions/${slug}`,
			images: [
			{
				url:
				post?.image ??
				"https://fu-command-center.vercel.app/fu_placeholder.jpg",
				width: 1200,
				height: 675,
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