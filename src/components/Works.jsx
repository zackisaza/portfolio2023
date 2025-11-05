import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { servicesShowcase } from "../constants";
import {
	pokemonBulbasaur,
	pokemonPikachu,
	pokemonCharmander,
	pokemonSquirtle,
	pokemonGreninja,
	pokemonTogepi,
	typeGrass,
	typeElectric,
	typeFire,
	typeWater,
	typeFairy,
	typeDark,
	typeEnergy,
} from "../assets";
import { fadeIn, textVariant } from "../utils/motion";
import { useLanguage } from "../context/LanguageContext";
import Typewriter from "./Typewriter";

const pickType = (name) => {
	const n = (name || "").toLowerCase();
	if (n.includes("frontend") || n.includes("ux") || n.includes("design")) return "electric";
	if (n.includes("backend") || n.includes("api")) return "steel";
	if (n.includes("architecture")) return "psychic";
	if (n.includes("automat") || n.includes("automation") || n.includes("ai")) return "dark";
	if (n.includes("custom") || n.includes("plataforma") || n.includes("platform")) return "normal";
	return "fighting";
};

const pokemonImages = [
	pokemonBulbasaur,
	pokemonPikachu,
	pokemonCharmander,
	pokemonSquirtle,
	pokemonGreninja,
	pokemonTogepi,
];

// Pokemon types with their icons and colors
const pokemonTypes = [
	{ name: { en: 'Grass', es: 'Planta' }, icon: typeGrass, secondIcon: null, color: 'grass' },     // Bulbasaur
	{ name: { en: 'Electric', es: 'Eléctrico' }, icon: typeElectric, secondIcon: null, color: 'electric' }, // Pikachu
	{ name: { en: 'Fire', es: 'Fuego' }, icon: typeFire, secondIcon: null, color: 'fire' },        // Charmander
	{ name: { en: 'Water', es: 'Agua' }, icon: typeWater, secondIcon: null, color: 'water' },       // Squirtle
	{ name: { en: 'Water', es: 'Agua' }, icon: typeWater, secondIcon: typeDark, color: 'water' },   // Greninja (Agua/Siniestro)
	{ name: { en: 'Fairy', es: 'Hada' }, icon: typeFairy, secondIcon: null, color: 'fairy' },       // Togepi
];

const ProjectCard = ({ index, name, description, highlights, icon }) => {
	const { language } = useLanguage();
	const containerRef = useRef(null);
	const cardRef = useRef(null);
	const hoverAreaRef = useRef(null);
	const [inView, setInView] = useState(false);
	const [flipped, setFlipped] = useState(false);
	// Detectar si es móvil/touch
	const [isTouch, setIsTouch] = useState(false);
	useEffect(() => {
		const checkTouch = () => {
			setIsTouch(('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
		};
		checkTouch();
		window.addEventListener('resize', checkTouch);
		return () => window.removeEventListener('resize', checkTouch);
	}, []);
	const [isHovering, setIsHovering] = useState(false);
	const hoverTimeoutRef = useRef(null);
	const type = pickType(name);
	const energyClass = `energy-${type}`;
	// Theme per Pokemon index
	const themeMap = ['bulbasaur', 'pikachu', 'charmander', 'squirtle', 'greninja', 'togepi'];
	const theme = themeMap[index % themeMap.length];
	// Get Pokemon type for this card
	const pokemonType = pokemonTypes[index % pokemonTypes.length];
	// Assign a fun HP value based on text length to keep it themed
	const hp = Math.min(180, 90 + Math.round((name?.length || 10) * 3));
	const rafRef = useRef(null);
	// Dimensiones fijas de referencia para el cálculo del hover (360x620px)
	const CARD_BASE_WIDTH = 360;
	const CARD_BASE_HEIGHT = 620;
	const handlePointer = (e) => {
		const el = cardRef.current;
		const hoverArea = hoverAreaRef.current;
		if (!el || !hoverArea || !isHovering) return;
		
		if (rafRef.current) return;
		rafRef.current = requestAnimationFrame(() => {
			rafRef.current = null;
			// Usar el área de hover fija para los cálculos, no la carta
			const rect = hoverArea.getBoundingClientRect();
			const cx = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
			const cy = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
			
			// Calcular el centro del área de hover
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;
			
			// Calcular la distancia desde el centro usando las dimensiones base
			const dx = (cx - centerX) / (CARD_BASE_WIDTH / 2);
			const dy = (cy - centerY) / (CARD_BASE_HEIGHT / 2);
			
			// Convertir a coordenadas normalizadas (0-1)
			const x = Math.max(0, Math.min(1, (dx + 1) / 2));
			const y = Math.max(0, Math.min(1, (dy + 1) / 2));
			
			el.style.setProperty("--lx", `${x * 100}%`);
			el.style.setProperty("--ly", `${y * 100}%`);
			// slight secondary parallax for conic backdrop
			el.style.setProperty("--sx", `${50 + (x - 0.5) * 10}%`);
			el.style.setProperty("--sy", `${50 + (y - 0.5) * 10}%`);
		});
	};

	const handleEnter = () => {
		const el = cardRef.current;
		if (!el) return;
		
		// Limpiar cualquier timeout previo
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
			hoverTimeoutRef.current = null;
		}
		
		// Solo activar si no está ya hovering
		if (!isHovering) {
			setIsHovering(true);
			// During pointer interaction, ensure we disable idle animation
			el.classList.add('holo-pointer');
			el.classList.remove('holo-animate');
		}
	};

	const handleLeave = () => {
		const el = cardRef.current;
		if (!el) return;
		
		// Limpiar cualquier timeout previo
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
		}
		
		// Debounce para evitar flickering en los bordes
		hoverTimeoutRef.current = setTimeout(() => {
			setIsHovering(false);
			// Return to idle animation and center the sheen
			el.classList.remove('holo-pointer');
			el.classList.add('holo-animate');
			el.style.setProperty("--lx", `0%`);
			el.style.setProperty("--ly", `0%`);
			el.style.setProperty("--sx", `50%`);
			el.style.setProperty("--sy", `50%`);
			hoverTimeoutRef.current = null;
		}, 100);
	};
    
	// Observe visibility to gate idle animations
	useEffect(() => {
		const node = containerRef.current;
		if (!node) return undefined;
		const obs = new IntersectionObserver(
			([entry]) => setInView(entry.isIntersecting),
			{ root: null, rootMargin: "100px", threshold: 0.2 }
		);
		obs.observe(node);
		return () => obs.unobserve(node);
	}, []);

	// Toggle holo idle animation only when in view (and not pointer active)
	useEffect(() => {
		const el = cardRef.current;
		if (!el) return;
		if (inView && !el.classList.contains('holo-pointer')) {
			el.classList.add('holo-animate');
		} else if (!inView) {
			el.classList.remove('holo-animate');
		}
	}, [inView]);
	
	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (hoverTimeoutRef.current) {
				clearTimeout(hoverTimeoutRef.current);
			}
		};
	}, []);
	
	return (
		<motion.div
			ref={containerRef}
			variants={fadeIn("up", "spring", index * 0.2, 0.5)}
			className='sm:w-[calc(33.333%-32px)] w-full px-4 sm:px-0 h-full will-change-transform relative'
			style={{ perspective: '1000px' }}>
			
			{/* Tap to flip indicator - mobile only */}
			<motion.div 
				className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 sm:hidden z-10 pointer-events-none'
				initial={{ opacity: 0, y: -10 }}
				animate={{ 
					opacity: [0.5, 1, 0.5],
					y: [0, -5, 0]
				}}
				transition={{
					duration: 2,
					repeat: Infinity,
					ease: "easeInOut"
				}}>
				<span className='text-white/70 text-xs font-semibold tracking-wider'>
					{language === 'es' ? '👆 Toca para voltear' : '👆 Tap to flip'}
				</span>
			</motion.div>

			<Tilt
				options={{
					max: 45,
					scale: 1,
					speed: 450,
				}}>
				{/* Área de hover fija - wrapper estable */}
				<div 
					ref={hoverAreaRef}
					onMouseMove={isTouch ? undefined : handlePointer}
					onTouchMove={isTouch ? handlePointer : undefined}
					onMouseEnter={isTouch ? undefined : handleEnter}
					onMouseLeave={isTouch ? undefined : handleLeave}
					onTouchStart={isTouch ? undefined : handleEnter}
					onTouchEnd={isTouch ? undefined : handleLeave}
					className='w-full h-[620px] relative'>
					<div 
						className={`tcg-flip-container ${flipped ? 'is-flipped' : ''}`}
						onClick={() => setFlipped((v) => !v)}
						onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped((v) => !v); } }}
						role='button'
						tabIndex={0}>
					{/* FRONT CARD */}
					<motion.div
						ref={cardRef}
						className={`tcg-card tcg-flip-face tcg-flip-face--front holo-card rounded-2xl w-full shadow-card h-[620px] flex flex-col group theme-${theme} will-change-transform overflow-hidden`}
						animate={inView ? { y: [0, -6, 0], scale: [1, 1.01, 1] } : {}}
						transition={inView ? {
							duration: 3.2,
							repeat: Infinity,
							repeatType: "reverse",
							ease: "easeInOut",
							delay: (index % 3) * 0.2,
							repeatDelay: 0.25,
						} : {}}>
						{/* Holo overlay */}
						<div className='holo-overlay' />
						
						{/* Card border - Golden/colored frame */}
						<div className={`pokemon-card-border border-${pokemonType.color}`}>
							{/* Top section - Stage + Name + HP + Type */}
							<div className='pokemon-card-header'>
								<div className='flex items-center justify-between w-full'>
									<div className='flex items-center gap-2'>
										<span className='pokemon-stage'>BÁSICO</span>
										<h3 className='pokemon-name'>{name}</h3>
									</div>
									<div className='flex items-center gap-1'>
										<span className='pokemon-ps-label'>PS</span>
										<span className='pokemon-hp'>{hp}</span>
										<img src={pokemonType.icon} alt={pokemonType.name[language]} className='w-7 h-7 object-contain' />
										{pokemonType.secondIcon && (
											<img src={pokemonType.secondIcon} alt='secondary type' className='w-7 h-7 object-contain' />
										)}
									</div>
								</div>
							</div>

							{/* Pokemon Image - Large central image */}
							<div className='pokemon-image-container'>
								<div className='pokemon-image-frame'>
									<img src={pokemonImages[index % pokemonImages.length]} alt='pokemon' className='pokemon-image' loading='lazy' decoding='async' />
								</div>
								{/* Pokedex info bar */}
								<div className='pokedex-bar'>
									<span className='text-[9px] text-black/70 font-medium'>
										N.º 00{index + 1} · Pokémon {pokemonType.name[language]} · {language === 'es' ? 'Servicio' : 'Service'}
									</span>
								</div>
							</div>

							{/* Attacks section */}
							<div className='pokemon-attacks-section'>
								{highlights.slice(0, 2).map((point, i) => {
									const dmg = 30 + (i * 30);
									// Create better attack names based on context
									const attackNames = {
										0: [ // Custom Software
											{ en: 'Discovery', es: 'Descubrimiento' },
											{ en: 'Iterative Delivery', es: 'Entrega Iterativa' }
										],
										1: [ // Frontend
											{ en: 'Design Systems', es: 'Design Systems' },
											{ en: 'SSR/SPA', es: 'SSR/SPA' }
										],
										2: [ // Backend
											{ en: 'DDD', es: 'DDD' },
											{ en: 'High Availability', es: 'Alta Disponibilidad' }
										],
										3: [ // Design
											{ en: 'User Journeys', es: 'User Journeys' },
											{ en: 'Prototyping', es: 'Prototipos' }
										],
										4: [ // Architecture
											{ en: 'Reviews', es: 'Evaluaciones' },
											{ en: 'Migration', es: 'Migración' }
										],
										5: [ // Automation
											{ en: 'Automation', es: 'Automatización' },
											{ en: 'AI Copilots', es: 'Copilotos IA' }
										]
									};
									const attackName = attackNames[index]?.[i]?.[language] || point.split(' ').slice(0, 2).join(' ');
									return (
										<div key={point} className='pokemon-attack-row'>
											<div className='flex items-start gap-2 flex-1'>
												<div className='flex items-center gap-1'>
													<img src={pokemonType.icon} alt='energy' className='w-5 h-5' />
													{i > 0 && <img src={pokemonType.icon} alt='energy' className='w-5 h-5' />}
												</div>
												<div className='flex-1'>
													<div className='pokemon-attack-name'>{attackName}</div>
													<div className='pokemon-attack-description'>
														<Typewriter rich content={point} speed={18} startDelay={140 + i * 60} cursor={false} />
													</div>
												</div>
											</div>
											<div className='pokemon-attack-damage'>{dmg}</div>
										</div>
									);
								})}
							</div>

							{/* Bottom section - Weakness, Resistance, Retreat */}
							<div className='pokemon-footer'>
								<div className='pokemon-stats-row'>
									<div className='pokemon-stat'>
										<span className='stat-label'>{language === 'es' ? 'Debilidad' : 'Weakness'}</span>
										<div className='flex items-center gap-1'>
											<img src={pokemonType.icon} alt='weakness' className='w-5 h-5 opacity-50' />
											<span className='stat-value'>×2</span>
										</div>
									</div>
									<div className='pokemon-stat'>
										<span className='stat-label'>{language === 'es' ? 'Resistencia' : 'Resistance'}</span>
										<span className='stat-value'>—</span>
									</div>
									<div className='pokemon-stat'>
										<span className='stat-label'>{language === 'es' ? 'Retirada' : 'Retreat'}</span>
										<img src={pokemonType.icon} alt='retreat' className='w-5 h-5 opacity-30' />
									</div>
								</div>
								
								{/* Flavor text at bottom */}
								<div className='pokemon-flavor-text'>
									<Typewriter content={description} speed={20} startDelay={160} cursor={false} />
								</div>

								{/* Card number and rarity */}
								<div className='pokemon-card-info'>
									<span className='card-number'>0{index + 1}/06 ●</span>
									<span className='card-set'>PORTFOLIO</span>
								</div>
							</div>
						</div>
					</motion.div>

					{/* BACK CARD */}
					<motion.div
						className={`tcg-card tcg-flip-face tcg-flip-face--back holo-card rounded-2xl w-full shadow-card h-[620px] flex flex-col group theme-${theme} will-change-transform overflow-hidden`}>
						{/* Holo overlay */}
						<div className='holo-overlay' />
						
						{/* Back Card Border */}
						<div className={`pokemon-card-border pokemon-card-back border-${pokemonType.color}`}>
							{/* Header - Service Abilities */}
							<div className='pokemon-card-header'>
								<div className='flex items-center justify-between w-full'>
									<div className='flex items-center gap-2'>
										<img src={icon} alt={`${name} icon`} className='w-8 h-8 object-contain' />
										<h3 className='pokemon-name text-[18px]'>{language === 'es' ? 'Capacidades' : 'Capabilities'}</h3>
									</div>
									<div className='flex items-center gap-2'>
										<span className='pokemon-hp text-[16px]'>LVL {index + 1}</span>
										<img src={pokemonType.icon} alt={pokemonType.name[language]} className='w-7 h-7 object-contain' />
									</div>
								</div>
							</div>

							{/* Service Description Card */}
							<div className='pokemon-back-description'>
								<div className='back-section-title'>{language === 'es' ? 'DESCRIPCIÓN DEL SERVICIO' : 'SERVICE DESCRIPTION'}</div>
								<p className='back-description-text'>
									<Typewriter rich content={description} speed={18} startDelay={100} cursor={false} />
								</p>
							</div>

							{/* All Abilities/Highlights */}
							<div className='pokemon-back-abilities'>
								<div className='back-section-title'>{language === 'es' ? 'HABILIDADES PRINCIPALES' : 'KEY ABILITIES'}</div>
								<div className='abilities-grid'>
									{highlights.map((point, i) => (
										<div key={point} className='ability-item'>
											<div className='ability-bullet'>
												<img src={pokemonType.icon} alt='ability' className='w-4 h-4' />
											</div>
											<div className='ability-text'>
												<Typewriter rich content={point} speed={16} startDelay={120 + i * 50} cursor={false} />
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Technical Stack / Tools */}
							<div className='pokemon-back-stack'>
								<div className='back-section-title'>{language === 'es' ? 'STACK TÉCNICO' : 'TECH STACK'}</div>
								<div className='stack-tags'>
									{index === 0 && (
										<>
											<span className='stack-tag'>React</span>
											<span className='stack-tag'>Next.js</span>
											<span className='stack-tag'>Node.js</span>
											<span className='stack-tag'>Python</span>
										</>
									)}
									{index === 1 && (
										<>
											<span className='stack-tag'>React</span>
											<span className='stack-tag'>TypeScript</span>
											<span className='stack-tag'>Tailwind</span>
											<span className='stack-tag'>Figma</span>
										</>
									)}
									{index === 2 && (
										<>
											<span className='stack-tag'>Node.js</span>
											<span className='stack-tag'>Python</span>
											<span className='stack-tag'>PostgreSQL</span>
											<span className='stack-tag'>Redis</span>
										</>
									)}
									{index === 3 && (
										<>
											<span className='stack-tag'>Figma</span>
											<span className='stack-tag'>Adobe XD</span>
											<span className='stack-tag'>Prototyping</span>
											<span className='stack-tag'>UX Research</span>
										</>
									)}
									{index === 4 && (
										<>
											<span className='stack-tag'>Microservices</span>
											<span className='stack-tag'>Docker</span>
											<span className='stack-tag'>K8s</span>
											<span className='stack-tag'>AWS</span>
										</>
									)}
									{index === 5 && (
										<>
											<span className='stack-tag'>OpenAI</span>
											<span className='stack-tag'>Langchain</span>
											<span className='stack-tag'>Automation</span>
											<span className='stack-tag'>ML Ops</span>
										</>
									)}
								</div>
							</div>

							{/* Footer - Stats */}
							<div className='pokemon-back-footer'>
								<div className='back-stats-row'>
									<div className='back-stat-item'>
										<span className='back-stat-label'>{language === 'es' ? 'EXPERIENCIA' : 'EXPERIENCE'}</span>
										<span className='back-stat-value'>4 {language === 'es' ? 'años' : 'years'}</span>
									</div>
									<div className='back-stat-item'>
										<span className='back-stat-label'>{language === 'es' ? 'PROYECTOS' : 'PROJECTS'}</span>
										<span className='back-stat-value'>{10 + index * 5}+</span>
									</div>
									<div className='back-stat-item'>
										<span className='back-stat-label'>{language === 'es' ? 'NIVEL' : 'LEVEL'}</span>
										<span className='back-stat-value'>★★★★★</span>
									</div>
								</div>
								
								{/* Card info bottom */}
								<div className='pokemon-card-info'>
									<span className='card-number'>0{index + 1}/06 ●</span>
									<span className='card-set'>PORTFOLIO · 2025</span>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
				</div>
			</Tilt>
		</motion.div>
	);
};

const Works = () => {
	const { t, language } = useLanguage();

	return (
			<>
				<motion.div variants={textVariant()} className='px-4 sm:px-0'>
				<p className={styles.sectionSubText}><Typewriter content={t("works.subtitle")} speed={26} startDelay={60} /></p>
				<h2 className={styles.sectionHeadText}><Typewriter content={t("works.title")} speed={26} startDelay={120} /></h2>
			</motion.div>

								<div className='w-full'>
				<motion.p
					variants={fadeIn("", "", 0.1, 1)}
					className='mt-4 text-secondary text-[20px] w-full leading-[30px] px-6 sm:px-0'
				>
					<Typewriter rich content={t("works.description")} speed={22} startDelay={180} />
				</motion.p>
			</div>
			<div className='mt-20 flex flex-wrap gap-16 sm:gap-12 justify-center items-stretch'>
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
						/>
					);
				})}
			</div>
		</>
	);
};

	export default SectionWrapper(Works, "services");
