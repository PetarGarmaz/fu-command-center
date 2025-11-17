'use client';

import Link from 'next/link';
import { Discord, Mail, Github } from 'lucide-react';

const Footer = () => {
	return (
		<footer className="backdrop-blur-2xl bg-black/20 border-t border-red-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
					{/* Brand Section */}
					<div className="space-y-3 sm:space-y-4 text-center md:text-left">
						<div className="flex items-center gap-2">
							<img src="fu_logo.png" alt="fu logo" className="w-10 object-contain"/>
							<img src="/FUCC - Logo Icon Nav.png" alt="" className='w-10 object-contain'/>
							<h3 className='flex-col my-auto font-semibold text-lg leading-none tracking-wide'>FU COMMAND CENTER<br/><span className='font-normal text-xs uppercase text-neutral-600'>Freelancers Union scheduling system</span></h3>
						</div>
						<p className="text-sm">
							<span>View, search, and schedule mission briefings for the Freelancers Union Arma Division.</span> <br /><br />
							<span>Allow members to quickly access upcoming operations, review details, and stay organized for deployment.</span>
						</p>
					</div>

					{/* Quick Links */}
					<div className="text-center md:text-left">
						<h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">NAVIGATION LINKS:</h3>
						<ul className="space-y-1 sm:space-y-2">
							<li><Link href="/#featured" className="hover:text-red-600 transition text-sm">Featured Mission</Link></li>
							<li><Link href="/#upcoming" className="hover:text-red-600 transition text-sm">Upcoming Missions</Link></li>
							<li><Link href="/#archived" className="hover:text-red-600 transition text-sm">Archived Missions</Link></li>
							<li><Link href="https://wiki.fugaming.org/arma/home" className="hover:text-red-600 transition text-sm">FU Wiki</Link></li>
						</ul>
					</div>

					{/* Contact Info */}
					<div className="text-center md:text-left">
						<h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4"></h3>
						<div className='flex flex-col space-y-2 sm:space-y-3 '>
							<Link href="mailto:petar.garmaz@gmail.com" className='nav-link flex gap-2  hover:text-red-600 transition justify-center md:justify-start'>
								<Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
								<span className="text-xs sm:text-sm break-all">petar.garmaz@gmail.com</span>
							</Link>
							<Link href="https://discord.com/users/229026532914364416" className='flex gap-2 hover:text-red-600 transition justify-center md:justify-start'>
								<Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
								<span className="text-xs sm:text-sm">Find me on Discord</span>
							</Link>
							<Link href="https://github.com/PetarGarmaz" className='flex gap-2 hover:text-red-600 transition justify-center md:justify-start'>
								<Github className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
								<span className="text-xs sm:text-sm">Check me out on Github</span>
							</Link>
						</div>
					</div>

				</div>

				{/* Bottom Bar 
				<div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10">
					<div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
						<p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
						{t.footer.copyright.replace('{year}', currentYear)}
						</p>
						<div className="flex gap-4 sm:gap-6 text-xs sm:text-sm">
						<Link href="/politika-privatnosti" className="text-gray-400 hover:text-white transition">{t.footer.privacy}</Link>
						<Link href="/uvjeti-koristenja" className="text-gray-400 hover:text-white transition">{t.footer.terms}</Link>
						</div>
					</div>
				</div>*/}
			</div>
		</footer>
	);
}

export default Footer