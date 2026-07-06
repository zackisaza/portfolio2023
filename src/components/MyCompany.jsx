import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { useLanguage } from "../context/LanguageContext";
import { wolfcavetext } from "../assets";
import Typewriter from "./Typewriter";
import { fadeIn, textVariant } from "../utils/motion";
import { BallCanvas } from "./canvas";

const MyCompany = () => {
	const { t } = useLanguage();

	return (
		<div className='pb-[1rem] md:pb-[3rem]'>
			<motion.div variants={textVariant()}>
				<p className={styles.sectionSubText}><Typewriter content={t("myCompany.subtitle")} speed={26} startDelay={60} /></p>
				<h2 className={styles.sectionHeadText}><Typewriter content={t("myCompany.title")} speed={26} startDelay={120} /></h2>
			</motion.div>

			<div className='mt-10 flex flex-col md:flex-row items-center gap-10'>
				<motion.div
					variants={fadeIn("right", "spring", 0.1, 0.75)}
					className='flex-shrink-0 rounded-full p-2'>
					<div
						className='relative flex items-center justify-center overflow-visible'
					>
						{/* Responsive size to match previous section feel: ~220px (mobile), 320px (sm), 500px (md+) */}
						<div className="w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] md:w-[500px] md:h-[500px]">
						<WolfcaveBall />
						</div>
					</div>
				</motion.div>

				<motion.div
					variants={fadeIn("left", "spring", 0.2, 0.75)}
					className='flex-1 px-4 md:px-0 flex flex-col items-center md:items-start'>
					<p 
						className='text-secondary text-[16px] sm:text-[18px] leading-[28px] sm:leading-[30px] mb-8 text-center md:text-left'
					>
						<Typewriter rich content={t("myCompany.description")} speed={22} startDelay={180} />
					</p>
					<motion.a
						href='https://wolf-cave.com'
						target='_blank'
						rel='noopener noreferrer'
						className='group inline-block relative py-3 px-8 outline-none w-fit text-white-100 font-semibold rounded-xl overflow-hidden border-2 border-white-100 transition-transform duration-200'
						animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
						whileHover={{ scale: 1.06 }}
						transition={{ duration: 3.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}>
						<span className='absolute inset-0 bg-[#000000] transition-colors duration-200 group-hover:bg-white' />
						<span className='relative z-10 transition-colors duration-200 group-hover:text-black'>
							{t("myCompany.checkWebsite")}
						</span>
					</motion.a>
				</motion.div>
			</div>
		</div>
	);
};

export default SectionWrapper(MyCompany, "mycompany");

// Local subcomponent: visibility-gated BallCanvas for Wolfcave logo with DOM delta injection
const WolfcaveBall = () => {
	const containerRef = useRef(null);
	const [isVisible, setIsVisible] = useState(false);
	const deltaRef = useRef({ mx: 0, my: 0, t: 0 });
	const lastPosRef = useRef({ x: 0, y: 0, set: false });

	useEffect(() => {
		const node = containerRef.current;
		if (!node) return;
		const obs = new IntersectionObserver(
			([entry]) => setIsVisible(entry.isIntersecting),
			{ root: null, rootMargin: "300px", threshold: 0.15 }
		);
		obs.observe(node);
		return () => obs.unobserve(node);
	}, []);

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
		deltaRef.current = { mx: 0, my: 0, t: performance.now(), leaving: true };
	};

	// Touch handlers for mobile (single-touch only)
	const onTouchStart = (e) => {
		if (!e.touches || e.touches.length === 0) return;
		const t0 = e.touches[0];
		lastPosRef.current = { x: t0.clientX, y: t0.clientY, set: true };
	};

	const onTouchMove = (e) => {
		if (!e.touches || e.touches.length === 0) return;
		const t0 = e.touches[0];
		if (!lastPosRef.current.set) {
			lastPosRef.current = { x: t0.clientX, y: t0.clientY, set: true };
			return;
		}
		const mx = t0.clientX - lastPosRef.current.x;
		const my = t0.clientY - lastPosRef.current.y;
		lastPosRef.current = { x: t0.clientX, y: t0.clientY, set: true };
		deltaRef.current = { mx, my, t: performance.now() };
	};

	const onTouchEnd = () => {
		lastPosRef.current = { x: 0, y: 0, set: false };
		deltaRef.current = { mx: 0, my: 0, t: performance.now(), leaving: true };
	};

	return (
		<div
			ref={containerRef}
			className="relative w-full h-full flex items-center justify-center"
			onMouseEnter={onMouseEnter}
			onMouseMove={onMouseMove}
			onMouseLeave={onMouseLeave}
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
			onTouchCancel={onTouchEnd}
		>
					{isVisible ? (
														<BallCanvas
							icon={wolfcavetext}
							externalDeltaRef={deltaRef}
																	decalRotation={[0, 0, 0]}
															decalScale={1.8}
															geometry="ico"
															baseColor={'#2a2a2a'}
															metalness={0.3}
															roughness={0.55}
						/>
			) : (
				<img src={wolfcavetext} alt="Wolfcave" loading='lazy' decoding='async' className="w-24 h-24 object-contain opacity-60" />
			)}
		</div>
	);
};
