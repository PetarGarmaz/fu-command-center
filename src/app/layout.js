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
