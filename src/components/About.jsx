import React from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import Typewriter from "./Typewriter";
import { useLanguage } from "../context/LanguageContext";
import { typeElectric } from "../assets";

const iconMap = {
	mastery: (className = "") => (
		<svg
			className={className}
			viewBox="0 0 64 64"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden='true'>
			<rect
				x='6'
				y='6'
				width='52'
				height='52'
				rx='16'
				fill='#2d1b69'
			/>
			<rect
				x='18'
				y='18'
				width='28'
				height='28'
				rx='6'
				fill='#6d28d9'
			/>
			<path
				d='M24 24h16v16H24z'
				fill='#c4b5fd'
			/>
			<path
				d='M12 24h6M12 32h6M12 40h6M46 24h6M46 32h6M46 40h6'
				stroke='#c4b5fd'
				strokeWidth='3'
				strokeLinecap='round'
			/>
			<path
				d='M24 12v6M32 12v6M40 12v6M24 46v6M32 46v6M40 46v6'
				stroke='#c4b5fd'
				strokeWidth='3'
				strokeLinecap='round'
			/>
		</svg>
	),
	system: (className = "") => (
		<svg
			className={className}
			viewBox='0 0 64 64'
			xmlns='http://www.w3.org/2000/svg'
			aria-hidden='true'>
			<rect
				x='6'
				y='6'
				width='52'
				height='52'
				rx='16'
				fill='#0f172a'
			/>
			<circle cx='18' cy='24' r='7' fill='#38bdf8' />
			<circle cx='46' cy='20' r='6' fill='#06b6d4' />
			<circle cx='32' cy='44' r='9' fill='#0ea5e9' />
			<path
				d='M24 28l6 12m4-12l8-6M32 44l14-4'
				stroke='#f8fafc'
				strokeWidth='3'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	),
	devops: (className = "") => (
		<svg
			className={className}
			viewBox='0 0 64 64'
			xmlns='http://www.w3.org/2000/svg'
			aria-hidden='true'>
			<rect
				x='6'
				y='6'
				width='52'
				height='52'
				rx='16'
				fill='#1f2933'
			/>
			<path
				d='M22 26c4-6 10-6 14 0l6 8c4 6 0 12-6 12-4 0-6-2-7-4'
				stroke='#f97316'
				strokeWidth='5'
				strokeLinecap='round'
				fill='none'
			/>
			<path
				d='M42 38c-4 6-10 6-14 0l-6-8c-4-6 0-12 6-12 4 0 6 2 7 4'
				stroke='#facc15'
				strokeWidth='5'
				strokeLinecap='round'
				fill='none'
			/>
			<circle cx='24' cy='22' r='3' fill='#fb923c' />
			<circle cx='40' cy='42' r='3' fill='#fde68a' />
		</svg>
	),
	leadership: (className = "") => (
		<svg
			className={className}
			viewBox='0 0 64 64'
			xmlns='http://www.w3.org/2000/svg'
			aria-hidden='true'>
			<rect
				x='6'
				y='6'
				width='52'
				height='52'
				rx='16'
				fill='#3b0d0c'
			/>
			<circle cx='32' cy='24' r='9' fill='#f97316' />
			<path
				d='M18 50c0-8 6-14 14-14s14 6 14 14'
				fill='#fb923c'
			/>
			<circle cx='20' cy='26' r='6' fill='#facc15' />
			<circle cx='44' cy='28' r='6' fill='#fcd34d' />
			<path
				d='M12 52c0-5 3-9 8-11M52 52c0-5-3-9-8-11'
				stroke='#fde68a'
				strokeWidth='4'
				strokeLinecap='round'
				opacity='0.85'
			/>
		</svg>
	),
};

// Terminal filename per skill, shown in each card's window title bar.
const FILES = {
	mastery: "mastery.sh",
	system: "system.cfg",
	devops: "devops.yml",
	leadership: "leadership.md",
};

// Each skill is rendered as a little code-editor / terminal window: traffic-light
// dots + filename, an icon "screen" with CRT scanlines, a `>` prompt title, and a
// status bar. The window chrome makes the card read clearly against the black bg.
const ServiceCard = ({ index, total, title, description, icon }) => {
	const file = FILES[icon] ?? `${icon}.sys`;
	const id = String(index + 1).padStart(2, "0");
	return (
		<Tilt
			className='w-full xs:w-[300px] sm:w-[290px]'
			options={{ max: 8, scale: 1.02, speed: 500 }}>
			<motion.div
				variants={fadeIn("up", "spring", 0.3 * index, 0.75)}
				className='group relative w-full overflow-hidden rounded-xl border border-[#8b1120]/40 bg-[#0b0709] shadow-[0_18px_48px_rgba(139,17,32,0.22)] transition-colors duration-300 hover:border-[#e0495c]/70'
				animate={{ y: [0, -8, 0] }}
				transition={{
					duration: 4,
					repeat: Infinity,
					repeatType: "reverse",
					ease: "easeInOut",
					delay: (index % 4) * 0.4,
				}}>
				{/* Phosphor accent line */}
				<span className='block h-[2px] w-full bg-gradient-to-r from-transparent via-[#e0495c] to-transparent opacity-70' />

				{/* Window title bar */}
				<div className='flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5'>
					<span className='h-2.5 w-2.5 rounded-full bg-[#ff5f56]' />
					<span className='h-2.5 w-2.5 rounded-full bg-[#ffbd2e]' />
					<span className='h-2.5 w-2.5 rounded-full bg-[#27c93f]' />
					<span className='ml-2 truncate text-[11px] tracking-wide text-white/45'>
						~/skills/{file}
					</span>
				</div>

				{/* Body — icon "screen" with CRT scanlines + prompt title */}
				<div className='relative flex min-h-[250px] flex-col items-center gap-5 px-7 py-7 text-center'>
					<span
						aria-hidden='true'
						className='pointer-events-none absolute inset-0'
						style={{
							backgroundImage:
								"repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 3px)",
							opacity: 0.05,
						}}
					/>
					<div className='relative rounded-2xl bg-white/[0.03] p-3 ring-1 ring-white/10'>
						{iconMap[icon]?.("w-14 h-14 drop-shadow-[0_6px_16px_rgba(0,0,0,0.4)]")}
					</div>
					<h3 className='text-[17px] font-semibold text-white-200'>
						<span className='text-[#e0495c]'>{">"}</span> {title}
					</h3>
					<p className='text-secondary text-sm leading-relaxed'>
						<Typewriter content={description} speed={20} startDelay={140} cursor={false} />
					</p>
				</div>

				{/* Status bar */}
				<div className='flex items-center justify-between border-t border-white/[0.06] px-4 py-2 text-[10px] tracking-wider text-white/40'>
					<span className='flex items-center gap-1.5'>
						<span
							className='h-1.5 w-1.5 rounded-full bg-[#27c93f]'
							style={{ boxShadow: "0 0 6px #27c93f" }}
						/>
						ONLINE
					</span>
					<span>
						{id} / {String(total ?? 4).padStart(2, "0")}
					</span>
				</div>
			</motion.div>
		</Tilt>
	);
};

const About = () => {
	const { t, language } = useLanguage();

  return (
		<>
					<motion.div variants={textVariant()} className='px-4 sm:px-0 relative'>
				<p className={styles.sectionSubText}><Typewriter content={t("about.subtitle")} speed={26} startDelay={60} /></p>
				<h2 className={styles.sectionHeadText}><Typewriter content={t("about.title")} speed={26} startDelay={120} /></h2>
				
				{/* Pokemon Type Decorations */}
				<motion.div 
					className='absolute -top-6 -right-4 hidden md:block'
					initial={{ opacity: 0, scale: 0, rotate: -180 }}
					animate={{ opacity: 0.15, scale: 1, rotate: 0 }}
					transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
				>
					<motion.img 
						src={typeElectric} 
						alt='' 
						className='w-16 h-16'
						animate={{ 
							rotate: [0, 10, 0, -10, 0],
							y: [0, -5, 0, 5, 0]
						}}
						transition={{ 
							duration: 4,
							repeat: Infinity,
							ease: "easeInOut"
						}}
					/>
				</motion.div>
			</motion.div>
											<motion.p
				variants={fadeIn("", "", 0.1, 1)}
												className='mt-4 text-secondary text-[20px] w-full leading-[30px] px-6 sm:px-0'
								>
									<Typewriter rich content={t("about.description")} speed={22} startDelay={180} />
								</motion.p>
			<div className='mt-20 flex flex-wrap xl:flex-nowrap gap-10 xl:gap-8 justify-center px-4 sm:px-0'>
				{services.map((service, index) => (
					<ServiceCard
						key={service.id}
						index={index}
						total={services.length}
						title={service.title[language] ?? service.title.en}
						description={
							service.description[language] ?? service.description.en
						}
						icon={service.icon}
					/>
				))}
			</div>
		</>
	);
}

export default SectionWrapper(About, 'about', "max-w-7xl xl:max-w-[1440px]")
