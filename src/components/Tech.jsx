import { useEffect, useRef, useState, lazy, Suspense } from "react";
const BallCanvasLazy = lazy(() => import("./canvas/Ball"));
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { motion } from "framer-motion";
import { textVariant, fadeIn } from "../utils/motion";
import { styles } from "../styles";
import { useLanguage } from "../context/LanguageContext";
import Typewriter from "./Typewriter";
import { useCanvasBudget } from "../context/CanvasBudgetContext";
import { typeWater, typeFairy } from "../assets";

const VisibilityBall = ({ technology, sectionInView, language }) => {
	const containerRef = useRef(null);
	const [isIntersecting, setIsIntersecting] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);
	const [visibleLocal, setVisibleLocal] = useState(false);
	const timeoutRef = useRef();
		const deltaRef = useRef({ mx: 0, my: 0, t: 0 });
		const lastPosRef = useRef({ x: 0, y: 0, set: false });
		// No slot limiting: render all balls when visible

	useEffect(() => {
		if (!sectionInView) {
			// when section is not in view, start hiding
			setIsIntersecting(false);
			return undefined;
		}

		const node = containerRef.current;
		if (!node) return undefined;

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsIntersecting(entry.isIntersecting);
			},
			{
				root: null,
				rootMargin: "200px",
				threshold: 0.2,
			}
		);

		observer.observe(node);
		return () => observer.unobserve(node);
	}, [sectionInView]);

	// manage mount/visibility so BallCanvas can animate exit
	useEffect(() => {
		if (isIntersecting) {
			if (!shouldRender) {
				setShouldRender(true);
				clearTimeout(timeoutRef.current);
				timeoutRef.current = setTimeout(() => setVisibleLocal(true), 50);
			} else {
				setVisibleLocal(true);
			}
			return;
		}

		if (shouldRender) {
			setVisibleLocal(false);
			clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => setShouldRender(false), 600);
		}

		return () => clearTimeout(timeoutRef.current);
	}, [isIntersecting, shouldRender]);

	// label intentionally omitted to avoid rendering static alt placeholders when hidden

	const onMouseEnter = (e) => {
		lastPosRef.current = { x: e.clientX, y: e.clientY, set: true };
	};
	const onMouseMove = (e) => {
		let mx = e.movementX;
		let my = e.movementY;
		if (mx === undefined || my === undefined) {
			if (!lastPosRef.current.set) {
				lastPosRef.current = { x: e.clientX, y: e.clientY, set: true };
				return;
			}
			mx = e.clientX - lastPosRef.current.x;
			my = e.clientY - lastPosRef.current.y;
			lastPosRef.current = { x: e.clientX, y: e.clientY, set: true };
		}
		deltaRef.current = { mx, my, t: performance.now() };
	};
	const onMouseLeave = () => {
		lastPosRef.current = { x: 0, y: 0, set: false };
		// Notify canvas about pointer leaving; canvas will wait 3s before returning
		deltaRef.current = { mx: 0, my: 0, t: performance.now(), leaving: true };
	};

	return (
		<div
			ref={containerRef}
			className='relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing'
			onMouseEnter={onMouseEnter}
			onMouseMove={onMouseMove}
			onMouseLeave={onMouseLeave}>
			{shouldRender ? (
				<Suspense fallback={null}>
					{/* Reduce the harsh white glow for tech icons: softer tint and lower multiplier */}
					<BallCanvasLazy
						icon={technology.icon}
						externalDeltaRef={deltaRef}
						emissiveColor={'#dfeeff'}
						emissiveMultiplier={0}
						decalRotation={[0, 0, 0]}
						visible={visibleLocal}
					/>
				</Suspense>
			) : null}
		</div>
	);
};

import { frontendService, backendService, architectureService } from "../assets";

const Tech = () => {
	const sectionRef = useRef(null);
	const [sectionInView, setSectionInView] = useState(false);
	const { t, language } = useLanguage();
  const { setExclusiveSection } = useCanvasBudget();

	useEffect(() => {
		const node = sectionRef.current;
		if (!node) return undefined;

		const observer = new IntersectionObserver(
			([entry]) => setSectionInView(entry.isIntersecting),
			{
				root: null,
				rootMargin: "0px",
				threshold: 0.4,
			}
		);

		observer.observe(node);
		return () => observer.unobserve(node);
	}, []);

	// Exclusive mode: while Tech is visible, suspend all other canvases
	useEffect(() => {
		if (sectionInView) setExclusiveSection(3);
		else setExclusiveSection(null);
	}, [sectionInView, setExclusiveSection]);

	return (
		<div className="relative">
			<motion.div variants={textVariant()} className="relative">
				<p className={`${styles.sectionSubText} text-black`}><Typewriter content={t("tech.subtitle")} speed={26} startDelay={60} /></p>
				<h2 className={`${styles.sectionHeadText} text-black`}><Typewriter content={t("tech.title")} speed={26} startDelay={120} /></h2>
				
				{/* Pokemon Type Decorations */}
				<motion.div 
					className='absolute -top-8 -left-4 hidden lg:block'
					initial={{ opacity: 0, x: -50, rotate: -90 }}
					animate={{ opacity: 0.12, x: 0, rotate: 0 }}
					transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
				>
					<motion.img 
						src={typeWater} 
						alt='' 
						className='w-20 h-20'
						animate={{ 
							rotate: [0, -8, 0, 8, 0],
							x: [0, -3, 0, 3, 0]
						}}
						transition={{ 
							duration: 5,
							repeat: Infinity,
							ease: "easeInOut"
						}}
					/>
				</motion.div>
				
				<motion.div 
					className='absolute -top-4 -right-8 hidden lg:block'
					initial={{ opacity: 0, x: 50, rotate: 90 }}
					animate={{ opacity: 0.12, x: 0, rotate: 0 }}
					transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
				>
					<motion.img 
						src={typeFairy} 
						alt='' 
						className='w-16 h-16'
						animate={{ 
							rotate: [0, 12, 0, -12, 0],
							scale: [1, 1.05, 1, 1.05, 1]
						}}
						transition={{ 
							duration: 4.5,
							repeat: Infinity,
							ease: "easeInOut",
							delay: 0.5
						}}
					/>
				</motion.div>
			</motion.div>

			<div
				ref={sectionRef}
				className='mt-[50px] mb-20 lg:mb-32 flex flex-wrap justify-center gap-8 sm:gap-10'>
				{technologies.slice(-7).map((technology) => (
					<VisibilityBall
						key={technology.id}
						technology={technology}
						sectionInView={sectionInView}
						language={language}
					/>
				))}
			</div>

			{/* Stack details: front / back / architecture (prettier cards) */}
			<motion.div
				className='mt-14 px-6 md:px-8 w-full max-w-5xl mx-auto'
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					{[
						{ key: 'front', img: frontendService, title: t('tech.frontTitle'), descKey: 'tech.frontDesc' },
						{ key: 'back', img: backendService, title: t('tech.backTitle'), descKey: 'tech.backDesc' },
						{ key: 'arch', img: architectureService, title: t('tech.architectureTitle'), descKey: 'tech.architectureDesc' },
					].map((col, idx) => {
						const raw = t(col.descKey) || '';
						const items = raw.split(/,\s*/).filter(Boolean).map((it) => {
							const trimmed = it.trim();
							return trimmed.replace(/^([^\p{L}]*)(\p{L})/u, (m, p1, p2) => p1 + p2.toUpperCase());
						});

							const AnimatedCard = ({ col, idx, items }) => {
								const cardRef = useRef(null);
								const [inViewLocal, setInViewLocal] = useState(false);

								useEffect(() => {
									const node = cardRef.current;
									if (!node) return undefined;

									const observer = new IntersectionObserver(
										([entry]) => setInViewLocal(entry.isIntersecting),
										{ root: null, rootMargin: '0px', threshold: 0.25 }
									);

									observer.observe(node);
									return () => observer.unobserve(node);
								}, []);

								// richer variants: quick hidden (exit) to avoid perceived delay on pointer leave
								const cardVariants = {
									hidden: {
										opacity: 0,
										y: 18,
										transition: { duration: 0.18, ease: 'easeOut' },
									},
									show: {
										opacity: 1,
										y: 0,
										transition: { type: 'spring', duration: 0.45, stiffness: 220, damping: 20 },
									},
									hover: {
										scale: 1.04,
										y: -8,
										boxShadow: '0 18px 30px rgba(0,0,0,0.12)',
										transition: { type: 'spring', stiffness: 400, damping: 28 },
									},
									tap: { scale: 0.985, transition: { duration: 0.06 } },
								};

								return (
									<motion.div
										ref={cardRef}
										key={col.key}
										variants={cardVariants}
										initial='hidden'
										animate={inViewLocal ? 'show' : 'hidden'}
										whileHover='hover'
										whileTap='tap'
										className='relative rounded-2xl p-8 md:p-10 bg-gradient-to-br from-white/80 to-gray-50 dark:from-slate-900/70 dark:to-black/40 border border-gray-100 dark:border-gray-800 shadow-lg transition-all duration-200 cursor-pointer'
									>
										<div className='absolute -top-2 left-6 w-16 h-1 rounded-full bg-[#8B0000]'></div>
										<div className='flex items-start justify-between gap-3'>
											<div className='flex items-center gap-5'>
												{col.img ? (
													<img src={col.img} alt={col.title} className='w-12 h-12 md:w-14 md:h-14 object-contain rounded-sm' />
												) : null}
												<h3 className='text-lg md:text-xl font-semibold mb-2 text-[#8B0000]'>{col.title}</h3>
											</div>
										</div>
										<ul className='mt-4 space-y-4'>
											{items.map((it, i) => (
												<li key={i} className='text-base md:text-sm text-gray-700 dark:text-gray-300 flex items-start gap-3'>
													<span className='shrink-0 mt-1 w-3 h-3 rounded-full bg-[#8B0000]/90'></span>
													<span className='leading-tight'>{it}</span>
												</li>
											))}
										</ul>
									</motion.div>
								);
							};

						return <AnimatedCard key={col.key} col={col} idx={idx} items={items} />;
					})}
				</div>
			</motion.div>
		</div>
	);
};

export default SectionWrapper(Tech, "tech");
