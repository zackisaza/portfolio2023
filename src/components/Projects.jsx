import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { projects } from "../constants";
import { fadeIn, textVariant, staggerContainer } from "../utils/motion";
import { useLanguage } from "../context/LanguageContext";
import Typewriter from "./Typewriter";
import ArcadeFighters from "./ArcadeFighters";
import "./arcade.css";

const pixel = { fontFamily: "'Press Start 2P', monospace" };

// External-link icon (inline, so it doesn't depend on the LinkedIn asset).
const ExternalLinkIcon = ({ className }) => (
	<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className={className} aria-hidden='true'>
		<path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
		<polyline points='15 3 21 3 21 9' />
		<line x1='10' y1='14' x2='21' y2='3' />
	</svg>
);

const statusMeta = {
	production: {
		color: "#6ee7b7",
		label: { en: "In production", es: "En producción" },
	},
	opensource: {
		color: "#7dd3fc",
		label: { en: "Open source", es: "Código abierto" },
	},
	client: {
		color: "#f0abfc",
		label: { en: "Client work", es: "Proyecto cliente" },
	},
};

const pad = (n) => String(n).padStart(2, "0");

// Colored caps for each control (glow + blinking LED). Joysticks navigate
// projects; the three center buttons switch between the three screens.
const CTRL = {
	prev: "#0eb4e6",
	next: "#49e35b",
	views: [
		{ cap: "#ffb751", cap2: "#b57a26" }, // screen 1 — summary
		{ cap: "#ff5cf0", cap2: "#a62c98" }, // screen 2 — tech & links
		{ cap: "#a066ff", cap2: "#5f2fb0" }, // screen 3 — screenshot
	],
};

const Projects = () => {
	const { t, language } = useLanguage();
	const count = projects.length;
	const [active, setActive] = useState(0);
	const [screen, setScreen] = useState(0); // 0: summary · 1: tech · 2: shot
	const sceneRef = useRef(null);

	const go = useCallback(
		(delta) => {
			setScreen(0);
			setActive((a) => (a + delta + count) % count);
		},
		[count]
	);

	const jumpTo = useCallback((i) => {
		setScreen(0);
		setActive(i);
	}, []);

	const random = useCallback(() => {
		if (count < 2) return;
		// Jump ahead a couple of projects — a playful "shuffle" via the coin button.
		setScreen(0);
		setActive((a) => (a + 2) % count);
	}, [count]);

	const selectScreen = useCallback((i) => setScreen(i), []);

	// Keyboard: ◄ / ► change project, 1/2/3 switch screen — but only while the
	// arcade is on screen and the user isn't typing, so page scroll is safe.
	useEffect(() => {
		const onKey = (e) => {
			const isArrow = e.key === "ArrowLeft" || e.key === "ArrowRight";
			const isDigit = e.key === "1" || e.key === "2" || e.key === "3";
			if (!isArrow && !isDigit) return;
			const el = sceneRef.current;
			if (!el) return;
			const tag = document.activeElement?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;
			const r = el.getBoundingClientRect();
			const onScreen = r.top < window.innerHeight * 0.8 && r.bottom > window.innerHeight * 0.2;
			if (!onScreen) return;
			e.preventDefault();
			if (isArrow) go(e.key === "ArrowRight" ? 1 : -1);
			else setScreen(Number(e.key) - 1);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [go]);

	const project = projects[active];
	const local = project.translations[language] ?? project.translations.en;
	const status = statusMeta[project.status] ?? statusMeta.production;
	const statusLabel = status.label[language] ?? status.label.en;
	const stageTag = `STAGE ${pad(active + 1)}/${pad(count)}`;

	return (
		<motion.section
			variants={staggerContainer()}
			initial='hidden'
			whileInView='show'
			viewport={{ once: true, amount: 0.1 }}
			className='px-6 sm:px-16 py-10 sm:py-16 max-w-[1600px] mx-auto relative z-10'
		>
			<span className='hash-span' id='projects'>
				&nbsp;
			</span>

			<motion.div variants={textVariant()} className='text-center'>
				<p className={`${styles.sectionSubText} !text-center !text-[#b3450f] !font-bold`}>
					<Typewriter content={t("projects.subtitle")} speed={26} startDelay={60} />
				</p>
				<h2 className={`${styles.sectionHeadText} !text-center !text-[#3a1607] drop-shadow-[0_2px_0_rgba(255,255,255,0.25)]`}>
					<Typewriter content={t("projects.title")} speed={26} startDelay={120} />
				</h2>
			</motion.div>

			<motion.p
				variants={fadeIn("", "", 0.1, 1)}
				className='mt-4 text-[#5c2c0e] font-medium text-[18px] max-w-3xl mx-auto text-center leading-[28px]'
			>
				<Typewriter rich content={t("projects.description")} speed={22} startDelay={180} />
			</motion.p>

			<div ref={sceneRef} className='mt-12 flex flex-col items-center'>
				{/* --- Giant centered arcade: the screen holds all the info --- */}
				<motion.div variants={fadeIn("up", "spring", 0.1, 0.7)} className='w-full flex justify-center'>
					<div className='arcade-scene'>
						<div className='arcade'>
							<div className='top' />
							<div className='top-screen' />
							<div className='screen'>
								<div className='glass'>
									<span>
										<div className='pv' key={`${active}-${screen}`}>
											{screen === 2 && (
												<img
													className='screen-img'
													src={project.image}
													alt={`${local.name} screenshot`}
													loading='lazy'
													decoding='async'
												/>
											)}

											<div className={`crt-view view-${screen}`}>
												{screen === 0 && (
													<>
														<div className='crt-top'>
															<span className='crt-stage'>{stageTag}</span>
															<span className='crt-status' style={{ color: status.color }}>
																<i />
																{statusLabel}
															</span>
														</div>
														<div className='crt-body'>
															<h3 className='crt-name'>{local.name}</h3>
															<p className='crt-tag'>{local.tagline}</p>
															<p
																className='crt-desc'
																dangerouslySetInnerHTML={{ __html: local.description }}
															/>
															{project.metrics?.length > 0 && (
																<div className='crt-row'>
																	{project.metrics.map((m) => (
																		<div key={m.value + (m.label[language] ?? m.label.en)} className='crt-metric'>
																			<b>{m.value}</b>
																			<span>{m.label[language] ?? m.label.en}</span>
																		</div>
																	))}
																</div>
															)}
														</div>
													</>
												)}

												{screen === 1 && (
													<>
														<div className='crt-top'>
															<span className='crt-stage'>{stageTag}</span>
															<span className='crt-screenno'>{t("projects.viewTech")}</span>
														</div>
														<div className='crt-body'>
															<span className='crt-kicker'>{local.name}</span>
															<div className='crt-row'>
																{project.tags.map((tag) => (
																	<span key={tag} className='crt-chip'>
																		{tag}
																	</span>
																))}
															</div>
															<div className='crt-actions'>
																{project.liveUrl && (
																	<a className='crt-play' href={project.liveUrl} target='_blank' rel='noopener noreferrer'>
																		<ExternalLinkIcon />
																		{t("projects.liveLabel")}
																	</a>
																)}
																{project.repoUrl && !project.repoPrivate && (
																	<a className='crt-code' href={project.repoUrl} target='_blank' rel='noopener noreferrer'>
																		{t("projects.codeLabel")}
																	</a>
																)}
																{project.repoPrivate && (
																	<span className='crt-private'>
																		<i />
																		{t("projects.privateLabel")}
																	</span>
																)}
															</div>
														</div>
													</>
												)}

												{screen === 2 && (
													<div className='crt-top'>
														<span className='crt-stage'>{stageTag}</span>
														<span className='crt-screenno'>{local.name}</span>
													</div>
												)}
											</div>

											<div className='scan' />
										</div>
									</span>
								</div>
							</div>

							<div className='bot-screen'>
								<div className='joystick'>
									<button
										className='js'
										type='button'
										style={{ "--j1": "#45c9f0", "--j2": "#0a6d92" }}
										onClick={() => go(-1)}
										aria-label='Previous project'
									/>
									<button
										className='js'
										type='button'
										style={{ "--j1": "#5fe06f", "--j2": "#269a35" }}
										onClick={() => go(1)}
										aria-label='Next project'
									/>
								</div>
								<div className='buttons'>
									{CTRL.views.map((c, i) => (
										<button
											key={i}
											type='button'
											className={`ab${screen === i ? " is-active" : ""}`}
											style={{ "--cap": c.cap, "--cap2": c.cap2 }}
											onClick={() => selectScreen(i)}
											aria-pressed={screen === i}
											aria-label={`Screen ${i + 1}`}
										/>
									))}
								</div>
							</div>

							{/* Tutorial legend: a blinking colored LED + label under each control */}
							<div className='deck-labels'>
								<div className='lab' style={{ left: "27%", "--cap": CTRL.prev }}>
									<span>{t("projects.ctrlPrev")}</span>
								</div>
								<div className={`lab${screen === 0 ? " is-active" : ""}`} style={{ left: "40%", "--cap": CTRL.views[0].cap }}>
									<span>{t("projects.viewSummary")}</span>
								</div>
								<div className={`lab${screen === 1 ? " is-active" : ""}`} style={{ left: "50%", "--cap": CTRL.views[1].cap }}>
									<span>{t("projects.viewTech")}</span>
								</div>
								<div className={`lab${screen === 2 ? " is-active" : ""}`} style={{ left: "60%", "--cap": CTRL.views[2].cap }}>
									<span>{t("projects.viewShot")}</span>
								</div>
								<div className='lab' style={{ left: "73%", "--cap": CTRL.next }}>
									<span>{t("projects.ctrlNext")}</span>
								</div>
							</div>

							<div className='bot'>
								<div className='box'>
									<div className='coins'>
										<div className='slot' />
									</div>
									<button className='button' type='button' onClick={random} aria-label='Shuffle project' />
								</div>
								<div className='draw' />
							</div>
						</div>
					</div>
				</motion.div>

				{/* --- Cartridge selector + hint below the cabinet --- */}
				<motion.div
					variants={fadeIn("up", "spring", 0.25, 0.6)}
					className='mt-10 flex flex-col items-center gap-4'
				>
					<div className='flex items-center gap-3'>
						<button
							type='button'
							onClick={() => go(-1)}
							className='text-secondary hover:text-white text-[11px] transition-colors'
							style={pixel}
							aria-label='Previous project'
						>
							◄
						</button>
						<div className='flex flex-wrap justify-center gap-2'>
							{projects.map((p, i) => (
								<button
									key={p.id}
									type='button'
									onClick={() => jumpTo(i)}
									aria-label={`Go to project ${i + 1}`}
									aria-current={i === active}
									className={`w-9 h-9 rounded-md text-[10px] grid place-items-center transition-all duration-200 ${
										i === active
											? "bg-[#ff5c4f] text-white shadow-[0_0_14px_rgba(255,92,79,0.6)] scale-110"
											: "bg-white/5 text-secondary hover:bg-white/10 hover:text-white"
									}`}
									style={pixel}
								>
									{pad(i + 1)}
								</button>
							))}
						</div>
						<button
							type='button'
							onClick={() => go(1)}
							className='text-secondary hover:text-white text-[11px] transition-colors'
							style={pixel}
							aria-label='Next project'
						>
							►
						</button>
					</div>
					<span className='text-secondary/50 text-[9px]' style={pixel}>
						◄ ► PROYECTO · 1·2·3 PANTALLA · INSERT COIN
					</span>
				</motion.div>
			</div>

			{/* Scroll-driven fighters down the section's side gutters */}
			<ArcadeFighters />
		</motion.section>
	);
};

export default Projects;
