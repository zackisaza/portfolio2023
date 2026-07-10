import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
const ComputersCanvasLazy = lazy(() => import("./canvas/Computers"));
import { wolfcave } from "../assets";
import Typewriter from "./Typewriter";
import { useLanguage } from "../context/LanguageContext";

const SKILLS = ["Backend", "Frontend", "DevOps"];

const SOCIALS = [
	{
		label: "LinkedIn",
		href: "https://www.linkedin.com/in/zackisaza/",
		icon: (
			<svg width='19' height='19' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
				<path d='M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7 0h3.83v2.05h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.79 2.66 4.79 6.12V23h-4v-6.6c0-1.57-.03-3.6-2.19-3.6-2.2 0-2.53 1.71-2.53 3.48V23h-4V8z' />
			</svg>
		),
	},
	{
		label: "GitHub",
		href: "https://github.com/zackisaza",
		icon: (
			<svg width='19' height='19' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
				<path d='M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58C20.56 22.29 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z' />
			</svg>
		),
	},
	{
		label: "WhatsApp",
		href: "https://wa.me/573226144416",
		icon: (
			<svg width='19' height='19' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
				<path d='M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.599 5.397l-.999 3.648 3.889-1.022zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.299-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z' />
			</svg>
		),
	},
	{
		label: "Email",
		href: "mailto:zackisaza@gmail.com",
		icon: (
			<svg width='19' height='19' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
				<rect x='2' y='4' width='20' height='16' rx='2' />
				<path d='m22 7-10 5L2 7' />
			</svg>
		),
	},
];

const Hero = () => {
	const heroRef = useRef(null);
	const [heroInView, setHeroInView] = useState(true);
	const { t } = useLanguage();

	useEffect(() => {
		const node = heroRef.current;
		if (!node) return undefined;

		const observer = new IntersectionObserver(
			([entry]) => setHeroInView(entry.isIntersecting),
			{
				root: null,
				rootMargin: "0px",
				threshold: 0.25,
			}
		);

		observer.observe(node);
		return () => observer.unobserve(node);
	}, []);

	return (
		<section ref={heroRef} className='relative w-full h-screen mx-auto'>
			<div
				className={`${styles.paddingX} mt-[-680px] lg:mt-20 absolute inset-0 top-[200px] max-w-7xl mx-auto z-10 flex flex-col items-center justify-center gap-5 lg:flex-row lg:items-start lg:justify-start pointer-events-none`}>
				{/* Watermark mobile-only */}
				<img
					src={wolfcave}
					alt=""
					aria-hidden="true"
					className='block lg:hidden pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 w-2/3 max-w-[340px] z-0'
				/>
				{/* Social rail */}
				<div className='hidden lg:flex flex-col items-center lg:mt-24 pointer-events-auto'>
					{SOCIALS.map((s, i) => (
						<div key={s.label} className='flex flex-col items-center'>
							<a
								href={s.href}
								target={s.href.startsWith("http") ? "_blank" : undefined}
								rel='noopener noreferrer'
								aria-label={s.label}
								className='text-black-100/70 hover:text-tertiary hover:scale-125 transition-all duration-200'>
								{s.icon}
							</a>
							{i < SOCIALS.length - 1 && <span className='w-px h-5 my-2 bg-black-100/20' />}
						</div>
					))}
					<span className='w-px h-24 mt-2 bg-gradient-to-b from-black-100/25 to-transparent' />
				</div>

				<div className='content mt-10 lg:mt-20 relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left pointer-events-auto'>
					{/* Availability chip */}
					<motion.div
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.15, duration: 0.5 }}
						className='lg:ml-5 inline-flex items-center gap-2 rounded-full bg-black/[0.06] border border-black-100/10 px-3 py-1 backdrop-blur-sm'>
						<span className='relative flex h-2.5 w-2.5'>
							<span className='absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping' />
							<span className='relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500' />
						</span>
						<span className='text-[12px] font-semibold uppercase tracking-wider text-black-100/80'>
							{t("hero.availability")}
						</span>
					</motion.div>

					{/* Name */}
					<div className='mt-2'>
						<h1 className={`${styles.heroHeadText} !leading-[1.02] lg:!ml-5`}>{t("hero.line1")}</h1>
					</div>

					{/* Role */}
					<p className={`${styles.heroSubText} text-black-100 z-20 !mt-1 lg:!mt-0 lg:!ml-5`}>
						<Typewriter content={t("hero.subheading")} speed={22} startDelay={140} />
					</p>

					{/* Skill chips */}
					<div className='mt-3 lg:ml-5 flex flex-wrap items-center justify-center lg:justify-start gap-2'>
						{SKILLS.map((skill) => (
							<span
								key={skill}
								className='rounded-full bg-black/[0.06] border border-black-100/10 px-3 py-1 text-[13px] font-medium text-black-100'>
								{skill}
							</span>
						))}
					</div>

					{/* Startup mini-card — desktop only; on mobile it collided with the 3D computer */}
					<motion.a
						href='#mycompany'
						className='group mt-4 lg:ml-5 hidden lg:inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-md px-4 py-3 shadow-lg hover:shadow-xl hover:border-white/25 transition-all duration-300'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}>
						<span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-md group-hover:scale-110 transition-transform duration-300'>
							<img
								src={wolfcave}
								alt='WolfCave logo'
								width='44'
								height='44'
								className='w-11 h-11 object-contain'
							/>
						</span>
						<span className='flex flex-col text-left'>
							<span className='text-[11px] font-semibold uppercase tracking-wider text-white/50'>
								{t("hero.startupLabel")}
							</span>
							<span className='text-[18px] font-bold text-white leading-tight'>
								WolfCave
							</span>
							<span className='mt-0.5 inline-flex items-center gap-1 text-[13px] font-semibold text-[#e0495c]'>
								{t("hero.startupCta")}
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='14'
									height='14'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2.5'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='group-hover:translate-x-1 transition-transform duration-300'>
									<line x1='5' y1='12' x2='19' y2='12' />
									<polyline points='12 5 19 12 12 19' />
								</svg>
							</span>
						</span>
					</motion.a>
				</div>
			</div>
			<div className='absolute inset-0 z-0 pointer-events-auto top-40 sm:top-44 md:top-0' style={{ touchAction: 'pan-y' }}>
				<Suspense fallback={null}>
					<ComputersCanvasLazy active={heroInView} />
				</Suspense>
			</div>
			<div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center hover:scale-90 duration-200 z-20'>
				<a href='#about'>
					<div className='mt-10 w-[35px] h-[54px] rounded-3xl border-4 border-tertiary flex justify-center items-start p-2'>
						<motion.div
							animate={{
								y: [0, 20, 0],
							}}
							transition={{
								duration: 1.5,
								repeat: Infinity,
								repeatType: "loop",
							}}
							className='w-3 h-3 rounded-full bg-tertiary'
						/>
					</div>
				</a>
			</div>
		</section>
	);
};

export default Hero;
