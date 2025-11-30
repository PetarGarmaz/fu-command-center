import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "FUCC - FU Command Center",
	description: "View, search and schedule mission briefings for Freelancers Union Arma Division.",
	openGraph: {
		title: "FUCC - FU Command Center",
		description: "View, search and schedule mission briefings for Freelancers Union Arma Division.",
		url: "https://fu-command-center.vercel.app",
		siteName: "FUCC",
		images: [
		{
			url: "https://fu-command-center.vercel.app/FUCC - Logo Icon Nav.png",
			width: 512,
      		height: 512,
		},
		],
		type: "website",
	},
	twitter: {
		card: "summary",
		title: "FUCC - FU Command Center",
		description: "View, search and schedule mission briefings.",
		images: ["https://fu-command-center.vercel.app/FUCC - Logo Icon Nav.png"],
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="bg-linear-to-b from-black to-neutral-200 antialiased" >
				{children}
			</body>
		</html>
	);
}
