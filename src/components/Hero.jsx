import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
const ComputersCanvasLazy = lazy(() => import("./canvas/Computers"));
import { logo, wolfcave } from "../assets";
import Typewriter from "./Typewriter";
import { useLanguage } from "../context/LanguageContext";

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

	const [heroLogoSrc, setHeroLogoSrc] = useState(null);

	useEffect(() => {
		const mq = window.matchMedia('(min-width: 1024px)');
		const loadLargeLogo = async () => {
			if (mq.matches) {
				const { wolfcavetext } = await import("../assets");
				setHeroLogoSrc(wolfcavetext);
			} else {
				setHeroLogoSrc(null);
			}
		};
		loadLargeLogo();
		const onChange = () => loadLargeLogo();
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	}, []);

	return (
		<section ref={heroRef} className='relative w-full h-screen mx-auto'>
			<div
				className={`${styles.paddingX} mt-[-600px] lg:mt-6 absolute inset-0 top-[30px] max-w-7xl mx-auto z-10 flex flex-col items-center justify-center gap-5 lg:flex-row lg:items-start lg:justify-start pointer-events-none`}>
				{/* Watermark mobile-only */}
				<img
					src={wolfcave}
					alt=""
					aria-hidden="true"
					className='block lg:hidden pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 w-2/3 max-w-[340px] z-0'
				/>
				<div className='hidden lg:flex flex-col justify-center items-center mt-5 lg:mt-9'>
					<div className='w-5 h-5 rounded-full bg-tertiary' />
					<div className='w-1 xm:h-80 sm:h-80 h-40 yellow-gradient' />
					
				</div>

				<div
					className='content mt-10 lg:mt-20 relative z-10 text-center lg:text-left pointer-events-auto
				'>
					
					<h2 className={`${styles.heroHeadText}`}>{t("hero.line1")}</h2>
					<h2 className={`${styles.heroHeadText}`}>{t("hero.line2")}</h2>
					<p className={`${styles.heroSubText} text-black-100 z-20`}>
						<Typewriter content={t("hero.subheading")} speed={22} startDelay={140} />
					</p>
					
					<div className='flex items-center justify-center lg:justify-start gap-3 mt-4 lg:ml-[50px]'>
						<motion.a
							href='#mycompany'
							className='inline-block relative z-20 py-2 px-6 outline-none w-fit text-black-100 font-semibold rounded-lg overflow-hidden border-2 border-black-100 bg-transparent cursor-pointer transition-colors duration-200 ease-in-out hover:bg-black hover:text-white hover:border-black'
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							animate={{ scale: [1, 1.02, 1] }}
							transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}>
							<span className='relative z-10'>
								{t("hero.ctaButton")}
							</span>
						</motion.a>
						
						<motion.svg
							xmlns="http://www.w3.org/2000/svg"
							width="40"
							height="40"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							className='text-tertiary'
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							animate={{ x: [0, -8, 0] }}
							transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
							<line x1="19" y1="12" x2="5" y2="12"></line>
							<polyline points="12 19 5 12 12 5"></polyline>
						</motion.svg>
					</div>

					{heroLogoSrc && (
						<img
							src={heroLogoSrc}
							alt='Wolfcave logo'
							className='hidden lg:block absolute top-16 -left-4 h-[26rem] xl:h-[28rem] w-auto object-contain drop-shadow-lg pointer-events-none z-0'
							loading='eager'
						/>
					)}
				</div>
			</div>
			<div className='absolute inset-0 z-0 pointer-events-auto top-24 sm:top-28 md:top-0' style={{ touchAction: 'pan-y' }}>
				<Suspense fallback={null}>
					<ComputersCanvasLazy active={heroInView} sectionIndex={0} />
				</Suspense>
			</div>
			<div className='absolute xs:botton-10 bottom-32 w-full flex justify-center items-center hover:scale-90 duration-200 z-20'>
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
