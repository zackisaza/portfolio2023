import React, { useState } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { menu, close, link, microchip } from "../assets";

const Navbar = () => {
	const [active, setActive] = useState("");
	const [toggle, setToggle] = useState(false);

	return (
		<nav
			className={`${styles.paddingX} w-full flex items-center py-5 top-0 z-20 bg-white-200`}>
			<div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
				<Link
					to='/'
					className='flex items-center gap-2'
					onClick={() => {
						setActive("");
						window.scrollTo(0, 0);
					}}>
					<img
						src={microchip}
						alt='Zack Isaza logo'
						className='w-[48px] h-[48px] object-contain hover:scale-110 transition-transform duration-200'
					/>
					<p className='text-black-100 text-[18px] font-bold cursor-pointer'>
						Zack Isaza
						<span className='-mt-2 sm:block hidden text-[#565656]'>
							Sr. Engineer
						</span>
					</p>
				</Link>

				<ul className='list-none hidden sm:flex flex-row gap-10'>
					<div className='flex flex-row lg:gap-5 gap-1'>
						<a href='https://www.linkedin.com/in/zackisaza/'>
							<img
								src={link}
								className='cursor-pointer w-8 h-8 hover:scale-110 duration-200'
							/>
						</a>
					</div>
					{navLinks.map((Link) => (
						<li
							key={Link.id}
							className={`${
								active === Link.title ? "text-secondary" : "text-black-100"
							} hover:text-tertiary text-[18px] font-medium cursor-pointer`}
							onClick={() => setActive(Link.title)}>
							<a href={`#${Link.id}`}>{Link.title}</a>
						</li>
					))}
				</ul>
				<div className='sm:hidden flex flex-1 justify-end items-center'>
					<img
						src={toggle ? close : menu}
						alt='menu'
						className='mr-3 w-[28px] h-[28px] object-contain cursor-pointer hover:scale-110 duration-200'
						onClick={() => setToggle(!toggle)}
					/>

					<div
						className={`${!toggle ? "hidden" : "flex"} 
            p-6 black-gradient absolute top-20 right-5 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}>
						<ul className='list-none flex justify-end items-start  flex-col gap-4'>
							<li>
								<a href='https://www.linkedin.com/in/zackisaza/'>
									<img
										src={link}
										className='mt-[15px] cursor-pointer w-8 h-8 hover:scale-110 duration-200'
									/>
								</a>
							</li>
							{navLinks.map((Link) => (
								<li
									key={Link.id}
									className={`${
										active === Link.title ? "text-tertiary" : "text-secondary"
									} font-poppins font-medium cursor-pointer text-[16px]`}
									onClick={() => {
										setToggle(!toggle);
										setActive(Link.title);
									}}>
									<a href={`#${Link.id}`}>{Link.title}</a>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
