import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { menu, close, wolfcave } from "../assets";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import Typewriter from "./Typewriter";

const Navbar = () => {
	const [active, setActive] = useState("");
	const [toggle, setToggle] = useState(false);
	const [hideOnDesktop, setHideOnDesktop] = useState(false);
	const { language, setLanguage, t } = useLanguage();

	useEffect(() => {
		const mq = window.matchMedia('(min-width: 1024px)');
		const update = () => {
			const scrolled = window.scrollY > 160;
			setHideOnDesktop(mq.matches && scrolled);
		};
		update();
		const onScroll = () => update();
		const onResize = () => update();
		window.addEventListener('scroll', onScroll, { passive: true });
		mq.addEventListener('change', onResize);
		window.addEventListener('resize', onResize);
		return () => {
			window.removeEventListener('scroll', onScroll);
			mq.removeEventListener('change', onResize);
			window.removeEventListener('resize', onResize);
		};
	}, []);

	return (
		   <nav
			   className={`${styles.paddingX} w-full flex items-center py-5 top-0 relative z-[100] bg-white-200 transition-all duration-500 ease-in-out ${hideOnDesktop ? 'lg:opacity-0 lg:pointer-events-none lg:-translate-y-4' : 'opacity-100 lg:translate-y-0'}`}>
			<div className='w-full flex items-center'>
				<div className='flex-1 flex items-center gap-4 justify-start'>
				<Link
					to='/'
					className='flex items-center gap-2'
					onClick={() => {
						setActive("");
						window.scrollTo(0, 0);
					}}>
					<img
						src={wolfcave}
						alt='Wolfcave logo'
						width="48"
						height="48"
						decoding="async"
						className='w-[48px] h-[48px] object-contain hover:scale-110 transition-transform duration-200'
					/>
					<p className='text-black-100 text-[18px] font-bold cursor-pointer'>
						Zack Isaza
						<span className='-mt-2 sm:block hidden text-[#565656]'>
							<Typewriter content={t("navbar.tagline")} speed={26} startDelay={80} />
						</span>
					</p>
				</Link>
				</div>

				<ul className='hidden sm:flex items-center gap-8 whitespace-nowrap list-none justify-center'>
						   {navLinks.map((linkItem) => {
							   const label =
								   linkItem.title[language] ?? linkItem.title.en ?? linkItem.id;
							   const isActive = active === linkItem.id;
							   return (
								   <li
									   key={linkItem.id}
									   className={`relative font-medium cursor-pointer text-[18px] transition-all duration-300
										   ${isActive ? 'text-tertiary scale-110 drop-shadow-lg' : 'text-black-100 hover:text-tertiary hover:scale-105 hover:drop-shadow'}
									   `}
									   onClick={() => setActive(linkItem.id)}>
									   <a href={`#${linkItem.id}`}>{label}</a>
									   {isActive && (
										   <span className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-6 h-1 rounded-full bg-tertiary/80 blur-[2px] animate-pulse" />
									   )}
								   </li>
							   );
						   })}
					   </ul>

				<div className='hidden sm:flex flex-1 items-center justify-end'>
					<LanguageToggle />
				</div>
				<div className='sm:hidden flex flex-1 justify-end items-center gap-3'>
					<LanguageToggle
						size='mobile'
						onSelect={(code) => {
							setLanguage(code);
							setToggle(false);
						}}
					/>
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
							{navLinks.map((linkItem) => {
								const label =
									linkItem.title[language] ?? linkItem.title.en ?? linkItem.id;
								return (
									<li
										key={linkItem.id}
										className={`${
											active === linkItem.id
												? "text-tertiary"
												: "text-secondary"
										} font-poppins font-medium cursor-pointer text-[16px]`}
										onClick={() => {
											setToggle(!toggle);
											setActive(linkItem.id);
										}}>
										<a href={`#${linkItem.id}`}>{label}</a>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
