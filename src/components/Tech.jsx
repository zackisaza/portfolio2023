import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Tilt } from "react-tilt";
const BallCanvasLazy = lazy(() => import("./canvas/Ball"));
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { motion, useReducedMotion } from "framer-motion";
import { textVariant } from "../utils/motion";
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
  const prefersReducedMotion = useReducedMotion();

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
		<div className="relative -mb-12 md:mb-0">
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

			{/* Stack details: front / back / architecture — cards animation refined for stability */}
			<motion.div
				className='mt-14 px-6 md:px-8 w-full max-w-5xl mx-auto'
				initial={{ y: 8 }}
				whileInView={{ y: 0 }}
				viewport={{ once: true, amount: 0.25 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
			>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-6 items-stretch'>
					{[
						{ key: 'front', img: frontendService, title: t('tech.frontTitle'), descKey: 'tech.frontDesc' },
						{ key: 'back', img: backendService, title: t('tech.backTitle'), descKey: 'tech.backDesc' },
						{ key: 'arch', img: architectureService, title: t('tech.architectureTitle'), descKey: 'tech.architectureDesc' },
					].map((col, idx) => {
						const raw = t(col.descKey) || '';
						const items = raw
							.split(/,\s*/)
							.filter(Boolean)
							.map((it) => {
								const trimmed = it.trim();
								return trimmed.replace(/^(^[^\p{L}]*)(\p{L})/u, (m, p1, p2) => p1 + p2.toUpperCase());
							});

						// Wrapper: animate in once when in view; avoid oscillation on scroll
						const ScrollFade = ({ children }) => (
							<motion.div
								initial={{ opacity: 1, y: 14 }}
								whileInView={{ y: 0 }}
								viewport={{ once: true, amount: 0.35, margin: "-10% 0px -10% 0px" }}
								transition={{ type: "tween", duration: 0.45, delay: idx * 0.12, ease: "easeOut" }}
							>
								{children}
							</motion.div>
						);

						return (
							<ScrollFade key={col.key}>
								<Tilt
									className='w-full h-full'
									options={{ max: prefersReducedMotion ? 0 : 12, scale: 1, speed: 600, glare: false, perspective: 900 }}
								>
									<motion.div
										className='w-full h-full min-h-[300px] md:min-h-[320px] bg-gradient-to-r from-[#45070e] via-[#6a0e1c] to-[#45070e] p-[1px] rounded-[20px] shadow-card overflow-hidden will-change-transform'
										initial={false}
										whileHover={prefersReducedMotion ? {} : { y: -4, scale: 1.02 }}
										whileTap={prefersReducedMotion ? {} : { scale: 0.995 }}
										transition={{ duration: 0.25, ease: "easeOut" }}
									>
										<div className='bg-[#1a0000] rounded-[20px] py-6 px-8 h-full flex flex-col justify-start gap-6'>
											<div className='flex flex-col items-center gap-4 text-center'>
												{col.img ? (
													<img
														src={col.img}
														alt={col.title}
														className='w-16 h-16 object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.25)]'
													/>
												) : null}
												<h3 className='text-white-200 text-[18px] font-semibold leading-snug'>
													{col.title}
												</h3>
											</div>
											<ul className='text-secondary text-base md:text-sm leading-relaxed list-disc list-inside space-y-2'>
												{items.map((it, i) => (
													<li key={i} className='text-left'>{it}</li>
												))}
											</ul>
										</div>
									</motion.div>
								</Tilt>
							</ScrollFade>
						);
					})}
				</div>
			</motion.div>
		</div>
	);
};

export default SectionWrapper(Tech, "tech");
