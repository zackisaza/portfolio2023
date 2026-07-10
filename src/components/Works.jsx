import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { servicesShowcase } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { useLanguage } from "../context/LanguageContext";
import { useServicesGame } from "../context/ServicesGameContext";
import Typewriter from "./Typewriter";
import BoosterBox3D from "./BoosterBox3D";
import ProjectCard from "./services/ProjectCard";

const Works = () => {
	const { t, language } = useLanguage();
	const game = useServicesGame();
	const gridRef = useRef(null);

	// A booster pack covers the deck until clicked. On small screens or with
	// reduced motion we skip the pack and just show the dealt cards.
	const [opened, setOpened] = useState(() => {
		if (typeof window === "undefined") return false;
		// Mobile now shows the closed booster pack too (tap / A to open); only skip
		// the pack for reduced-motion users.
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	});
	// 0 = cards stacked/hidden inside the pack, 1 = fully dealt into the grid.
	const openProgress = useMotionValue(opened ? 1 : 0);

	// If we skip the pack (mobile / reduced motion), the console is already "on".
	useEffect(() => {
		if (opened) game?.markOpened();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleOpen = () => {
		if (opened) return;
		setOpened(true);
		game?.markOpened();
		// Cards start emerging almost immediately (while the open box is still
		// visible and fading), hopping out of the mouth in a staggered cascade.
		animate(openProgress, 1, { duration: 2.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 });
	};

	return (
			<>
				<div className='pkmn-dex'>
					<div className='pkmn-dex-top'>
						<span className='pkmn-dex-lens' aria-hidden='true' />
						<span className='pkmn-dex-leds' aria-hidden='true'>
							<i /><i /><i />
						</span>
					</div>
					<div className='pkmn-dex-screen'>
						<motion.div variants={textVariant()} className='text-center'>
							<p className={`${styles.sectionSubText} !text-center !text-[#e0a400] !font-bold`}>
								<Typewriter content={t("works.subtitle")} speed={26} startDelay={60} />
							</p>
							<h2 className={`${styles.sectionHeadText} !text-center pkmn-title-text`}>
								<Typewriter content={t("works.title")} speed={26} startDelay={120} />
							</h2>
						</motion.div>

						<motion.p
							variants={fadeIn("", "", 0.1, 1)}
							className='mt-3 text-center max-w-[880px] mx-auto text-[17px] font-medium leading-[26px] !text-[#374151] pkmn-desc-text'
						>
							<Typewriter rich content={t("works.description")} speed={22} startDelay={180} />
						</motion.p>
					</div>
				</div>
			<div ref={gridRef} className={`pkmn-hand relative mt-[166px] sm:mt-24 md:mt-32 sm:w-screen sm:left-1/2 sm:-translate-x-1/2 sm:scale-[0.8] sm:origin-top flex flex-col sm:flex-row gap-16 sm:gap-0 justify-center items-center sm:items-end${!opened ? ' pkmn-closed' : ''}`}>
				{/* Mobile: the cards collapse while the box is closed and reveal slowly on
				    open — this grows the section, and the absolute Game Boy screen (top+
				    bottom) follows it. We animate grid-template-rows 0fr→1fr instead of
				    max-height: it eases to the EXACT content height (no janky reflow to an
				    arbitrary 6000px cap, no invisible "keeps growing" tail), so the reveal
				    is smoother. On desktop both wrappers are display:contents, so the
				    poker-hand fan is completely unaffected. */}
				<div
					className={`grid sm:contents transition-[grid-template-rows,opacity] duration-[1500ms] ease-out ${
						opened
							? "grid-rows-[1fr] opacity-100"
							: "grid-rows-[0fr] opacity-0 pointer-events-none"
					}`}
				>
					<div className='min-h-0 overflow-hidden flex flex-col gap-16 items-center sm:contents'>
						{servicesShowcase.map((service, index) => {
							const localized =
								service.translations[language] ?? service.translations.en;
							return (
								<ProjectCard
									key={service.id}
									index={index}
									name={localized.name}
									description={localized.description}
									highlights={localized.highlights}
									icon={service.icon}
									deal={openProgress}
									gridRef={gridRef}
								/>
							);
						})}
					</div>
				</div>

				<AnimatePresence>
					{!opened && <BoosterBox3D key='box' onOpen={handleOpen} language={language} />}
				</AnimatePresence>
			</div>
		</>
	);
};

	export default SectionWrapper(Works, "services");
