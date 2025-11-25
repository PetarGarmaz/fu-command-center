'use client';

import Link from 'next/link';
import { Mail, Github, Users } from 'lucide-react';

const Footer = () => {
	return (
		<footer className="fade-opacity bottom-0 mt-auto backdrop-blur-2xl bg-black/20 border-t border-red-900">
			<div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
				{/* Contact Info */}
				<div className="grid grid-cols-1 md:grid-cols-3 place-self-center md:gap-10 gap-5">
					<Link href="mailto:petar.garmaz@gmail.com" className='nav-link flex gap-2 hover:text-red-600 transition items-center justify-center'>
						<Mail className="w-3 h-3 md:w-4 md:h-4 shrink-0 mt-0.5" />
						<span className="text-lg md:text-base break-all">petar.garmaz@gmail.com</span>
					</Link>
					<Link href="https://discord.com/users/229026532914364416" className='nav-link flex gap-2 group hover:text-red-600 transition justify-center items-center'>
						<Users className="w-3 h-3 md:w-4 md:h-4 shrink-0 mt-0.5" />
						<span className="text-lg md:text-base break-all">Find me on Discord</span>
					</Link>
					<Link href="https://github.com/PetarGarmaz" className='nav-link flex gap-2 hover:text-red-600 transition justify-center items-center'>
						<Github className="w-3 h-3 md:w-4 md:h-4 shrink-0 mt-0.5" />
						<span className="text-lg md:text-base break-all">Check me out on Github</span>
					</Link>

				</div>

				{/* Bottom Bar
				<div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white">
					<div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
						<p className="text-white text-xs sm:text-sm text-center md:text-left">Copyright © 2024 Freelancers Union</p>

						<div className="flex gap-4 sm:gap-6 text-xs sm:text-sm">
							<Link href="/privacy-policy" className="nav-link text-white hover:text-red-600 transition">Privacy policy</Link>
						</div>
					</div>
				</div> */}
			</div>
		</footer>
	);
}

export default Footer