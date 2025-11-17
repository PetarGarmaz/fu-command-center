import React from 'react'
import { FilterX } from 'lucide-react';

const FilterNoMatch = () => {
	return (
		<section className='relative py-10 rounded-lg backdrop-blur-lg bg-black/30 border border-red-900/30 my-5 overflow-hidden'>
			{/*Special line*/}
			<div className='absolute bg-linear-to-r top-0 left-0 h-1 w-full from-red-900 via-amber-800 to-red-900 z-20'></div>

			<div className='mx-auto'>
				<div className="flex justify-center mb-6">
					<div className="w-20 h-20 rounded-full bg-black/30 flex items-center justify-center">
						<FilterX className="w-10 h-10 text-zinc-400" />
					</div>
				</div>
				<h1 className='text-center text-3xl text-zinc-400 font-semibold uppercase tracking-wide'>No matching missions</h1>
				<p className='text-center text-lg text-zinc-400 mt-5'>There are no missions matching the applied filters.</p>
			</div>
		</section>
	)
}

export default FilterNoMatch