import { Tilt } from "react-tilt";
import { motion, useTransform, useMotionValue, animate, AnimatePresence } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import BoosterBox3D from "./BoosterBox3D";
import pokemonLogo from "../assets/pokemon/pokemon-logo.png";
// Tiny pixel sprites for the "evolution" badge box (cut from the Kanto sheet)
import evo0 from "../assets/pokemon/kanto/000.png";
import evo1 from "../assets/pokemon/kanto/024.png";
import evo2 from "../assets/pokemon/kanto/003.png";
import evo3 from "../assets/pokemon/kanto/006.png";
import evo4 from "../assets/pokemon/kanto/008.png";
import evo5 from "../assets/pokemon/kanto/038.png";

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

// Small "evolution" badge (tiny pixel sprite + name) shown top-left over the art.
const evoData = [
	{ sprite: evo0, name: "Bulbasaur" },
	{ sprite: evo1, name: "Pikachu" },
	{ sprite: evo2, name: "Charmander" },
	{ sprite: evo3, name: "Squirtle" },
	{ sprite: evo4, name: "Blastoise" },
	{ sprite: evo5, name: "Jigglypuff" },
];

// Pokédex-style height/weight per card, to match a real card's art caption.
const dexData = [
	{ ht: "0,7 m", wt: "6,9 kg" },
	{ ht: "0,4 m", wt: "6,0 kg" },
	{ ht: "0,6 m", wt: "8,5 kg" },
	{ ht: "0,5 m", wt: "9,0 kg" },
	{ ht: "1,5 m", wt: "40,0 kg" },
	{ ht: "0,3 m", wt: "1,5 kg" },
];

// Official-style TCG energy symbols, drawn inline as SVG (colored disc + white
// glyph + a soft top highlight) so they read like real energy icons.
const ENERGY_BG = { grass: '#63bb52', electric: '#f4c73b', fire: '#e0512e', water: '#4d9be6', fairy: '#e88ec0', colorless: '#ded7c7' };
const ENERGY_GLYPH = {
	electric: 'M13 2 L7 13 H11 L10 22 L18 9 H13 Z',
	fire: 'M12 2 C13 6 17 7 15 12 C18 11 17.5 16 12 21 C7.5 17.5 6 15 8 11 C9 13 10 12 10 10 C10 6.5 12 6 12 2 Z',
	water: 'M12 3 C12 3 6 11 6 15 A6 6 0 0 0 18 15 C18 11 12 3 12 3 Z',
	grass: 'M6.5 18 C6.5 10 12 4.5 19 5 C19.5 12 14 18.5 6.5 18 Z',
	fairy: 'M12 3 C12.6 8 16 11.4 21 12 C16 12.6 12.6 16 12 21 C11.4 16 8 12.6 3 12 C8 11.4 11.4 8 12 3 Z',
	colorless: 'M12 3 L14 9 L20.2 9 L15.2 13 L17 20 L12 16 L7 20 L8.8 13 L3.8 9 L10 9 Z',
};
const EnergySymbol = ({ type = 'colorless', size = 20 }) => {
	const bg = ENERGY_BG[type] || ENERGY_BG.colorless;
	const d = ENERGY_GLYPH[type] || ENERGY_GLYPH.colorless;
	const glyphFill = type === 'colorless' ? '#8a7d61' : '#ffffff';
	return (
		<svg width={size} height={size} viewBox='0 0 24 24' className='energy-sym' aria-hidden='true'>
			<circle cx='12' cy='12' r='11' fill={bg} stroke='rgba(40,25,5,0.45)' strokeWidth='1.2' />
			<ellipse cx='8.4' cy='7.6' rx='4.2' ry='2.4' fill='rgba(255,255,255,0.45)' />
			<path d={d} fill={glyphFill} stroke='rgba(40,25,5,0.28)' strokeWidth='0.5' />
		</svg>
	);
};

const ProjectCard = ({ index, name, description, highlights, icon, deal, gridRef }) => {
	const { language } = useLanguage();
	const containerRef = useRef(null);
	const cardRef = useRef(null);
	const hoverAreaRef = useRef(null);
	const [inView, setInView] = useState(false);

	// --- Scroll-driven "deal from the deck" ---
	// Measure this card's offset from the deck centre (the grid centre) so the
	// whole hand can converge to one stacked point at scroll progress 0 and fan
	// out to its natural grid slot at progress 1. Disabled on small screens and
	// when the user prefers reduced motion.
	const [origin, setOrigin] = useState({ dx: 0, dy: 0, on: false });
	useLayoutEffect(() => {
		const measure = () => {
			const grid = gridRef?.current;
			const el = containerRef.current;
			if (!grid || !el) return;
			const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			if (reduce || window.innerWidth < 640) {
				setOrigin({ dx: 0, dy: 0, on: false });
				return;
			}
			// offset* is layout position (ignores the deal transform), so this
			// stays correct even if a resize fires mid-animation.
			const cx = el.offsetLeft + el.offsetWidth / 2 - grid.clientWidth / 2;
			const cy = el.offsetTop + el.offsetHeight / 2 - grid.clientHeight / 2;
			setOrigin({ dx: -cx, dy: -cy, on: true });
		};
		measure();
		window.addEventListener("resize", measure);
		return () => window.removeEventListener("resize", measure);
	}, [gridRef]);

	// Per-card eased progress with a stagger, plus a brief shuffle wobble.
	const easeOut = (p) => 1 - Math.pow(1 - Math.min(1, Math.max(0, p)), 3);
	const dealt = (p) => {
		const start = (index % 6) * 0.1; // wider stagger → clearer one-by-one deal
		return easeOut((p - start) / 0.5);
	};
	// Longer shuffle wobble as each card flies out of the pack.
	const wobble = (p) => (p < 0.34 ? Math.sin(p * 32 + index * 1.7) * (0.34 - p) * 30 : 0);
	const stackAngle = (index - 2.5) * 4; // fanned-deck tilt

	const dx = useTransform(deal, (p) => (origin.on ? origin.dx * (1 - dealt(p)) : 0));
	const dy = useTransform(deal, (p) => (origin.on ? origin.dy * (1 - dealt(p)) : 0));
	const rotate = useTransform(deal, (p) => (origin.on ? stackAngle * (1 - dealt(p)) + wobble(p) : 0));
	const scale = useTransform(deal, (p) => (origin.on ? 0.84 + 0.16 * dealt(p) : 1));
	const dealOpacity = useTransform(deal, (p) => (origin.on ? Math.min(1, dealt(p) * 1.6) : 1));
	// Separate flip states for desktop and mobile so toggling one card
	// on one input method doesn't interfere with the other input method.
	const [flippedDesktop, setFlippedDesktop] = useState(false);
	const [flippedMobile, setFlippedMobile] = useState(false);
	// Detectar si es móvil/touch
	const [isTouch, setIsTouch] = useState(false);
	// iOS gyro permission request guard
	const gyroAskRef = useRef(false);
	const requestGyroPermission = () => {
		if (gyroAskRef.current) return;
		gyroAskRef.current = true;
		try {
			const anyWin = window;
			const dm = anyWin.DeviceMotionEvent;
			const dor = anyWin.DeviceOrientationEvent;
			if (dm && typeof dm.requestPermission === 'function') {
				dm.requestPermission().catch(() => {}).finally(() => {});
			}
			if (dor && typeof dor.requestPermission === 'function') {
				dor.requestPermission().catch(() => {}).finally(() => {});
			}
		} catch (e) {
			// ignore
		}
	};
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

	// Tilt options: disable movement on touch devices so mobile only flips on tap
	const tiltOptions = isTouch ? {
		max: 0,
		scale: 1,
		speed: 450,
		gyroscope: false,
	} : {
		max: 45,
		scale: 1,
		speed: 450,
		gyroscope: true,
		gyroscopeMinAngleX: -15,
		gyroscopeMaxAngleX: 15,
		gyroscopeMinAngleY: -15,
		gyroscopeMaxAngleY: 15,
	};

	// Wrapper component: use a plain div on touch devices to avoid react-tilt
	const WrapperComponent = isTouch ? 'div' : Tilt;
	const wrapperProps = isTouch ? {} : { options: tiltOptions };
	// Touch tap detection to distinguish tap vs swipe on mobile
	const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
	const touchMovedRef = useRef(false);
	const TAP_MAX_MOVEMENT = 10; // px
	const TAP_MAX_DURATION = 400; // ms
	// Recent touch timestamp to suppress the subsequent synthetic click event
	const recentTouchRef = useRef(0);
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

	// Touch handlers moved to the hover-area container so touches are
	// intercepted there instead of on the card element itself.
	const handleTouchStart = (e) => {
		if (!isTouch) return;
		const t = e.touches && e.touches[0];
		if (t) {
			touchStartRef.current = { x: t.clientX, y: t.clientY, time: Date.now() };
			touchMovedRef.current = false;
		}
		// Ask for gyro permission on first touch
		requestGyroPermission();
	};

	const handleTouchMove = (e) => {
		if (!isTouch) return;
		const t = e.touches && e.touches[0];
		if (!t) return;
		const dx = Math.abs(t.clientX - touchStartRef.current.x);
		const dy = Math.abs(t.clientY - touchStartRef.current.y);
		if (dx > TAP_MAX_MOVEMENT || dy > TAP_MAX_MOVEMENT) touchMovedRef.current = true;
	};

	const handleTouchEnd = (e) => {
		if (!isTouch) return;
		const dur = Date.now() - (touchStartRef.current.time || 0);
		if (!touchMovedRef.current && dur < TAP_MAX_DURATION) {
			if (e.cancelable) e.preventDefault();
			e.stopPropagation();
			setFlippedMobile((v) => !v);
			// mark the recent touch so the following click (if any) is ignored
			recentTouchRef.current = Date.now();
		}
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

	// Derived flip state depending on input method (desktop vs mobile)
	const isFlipped = isTouch ? flippedMobile : flippedDesktop;
	
	return (
		<motion.div
			ref={containerRef}
			className='sm:w-[calc(33.333%-32px)] w-full px-4 sm:px-0 h-full will-change-transform relative'
			style={{ perspective: '1000px', x: dx, y: dy, rotate, scale, opacity: dealOpacity, zIndex: 6 - (index % 6) }}>
			
			{/* Tap to flip indicator - mobile only */}
			<motion.div
				className='absolute -bottom-10 left-1/2 transform -translate-x-1/2 sm:hidden z-20 pointer-events-none'
				initial={{ opacity: 0, y: -8, scale: 0.98 }}
				animate={{
					opacity: [0, 1, 0.85, 1],
					y: [0, -6, -3, 0],
					scale: [1, 1.02, 1],
				}}
				transition={{
					duration: 2.2,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
				aria-hidden='true'
			>
				<div className='inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm/10'>
					<span className='text-sm leading-none'>👆</span>
					<span className='leading-tight'>
						{language === 'es' ? 'Toca para voltear' : 'Tap to flip'}
					</span>
				</div>
			</motion.div>

			<WrapperComponent {...wrapperProps}>
				{/* Área de hover fija - wrapper estable (agregada clase para hover del contenedor) */}
				<div 
					ref={hoverAreaRef}
					onMouseMove={isTouch ? undefined : handlePointer}
					onTouchStart={(e) => { if (isTouch) { handleTouchStart(e); } else { handleEnter(e); } }}
					onTouchMove={(e) => { if (isTouch) handleTouchMove(e); }}
					onTouchEnd={(e) => { if (isTouch) { handleTouchEnd(e); } else { handleLeave(e); } }}
					onMouseEnter={isTouch ? undefined : handleEnter}
					onMouseLeave={isTouch ? undefined : handleLeave}
					className='tcg-hover-area w-full h-[620px] relative'>
						<div 
							className={`tcg-flip-container touch-clean ${isFlipped ? 'is-flipped' : ''}`}
							onClick={(e) => {
								// Prevent double-toggle: ignore click events that follow a touch toggle
								if (Date.now() - recentTouchRef.current < 500) return;
								if (!isTouch) { setFlippedDesktop((v) => !v); }
							}}
							onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (isTouch) setFlippedMobile((v) => !v); else setFlippedDesktop((v) => !v); } }}
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
						{/* Nota: en móvil el flip se maneja por onTouchEnd del contenedor */}
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
								{/* Evolution badge — tiny pixel sprite, like a real card's evo box */}
								<div className='pokemon-evo-box'>
									<span className='evo-thumb'><img src={evoData[index % evoData.length].sprite} alt='' /></span>
									<span className='evo-label'>{evoData[index % evoData.length].name}</span>
								</div>
								<div className='pokemon-image-frame'>
									<img src={pokemonImages[index % pokemonImages.length]} alt='pokemon' className='pokemon-image' loading='lazy' decoding='async' />
								</div>
								{/* Pokedex info bar */}
								<div className='pokedex-bar'>
									<span className='pokedex-caption'>
										N.º 00{index + 1} · Pokémon {pokemonType.name[language]} · {language === 'es' ? 'Altura' : 'HT'} {dexData[index % dexData.length].ht} · {language === 'es' ? 'Peso' : 'WT'} {dexData[index % dexData.length].wt}
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
													<EnergySymbol type={pokemonType.color} size={20} />
													{i > 0 && <EnergySymbol type={pokemonType.color} size={20} />}
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
											<EnergySymbol type={pokemonType.color} size={17} />
											<span className='stat-value'>×2</span>
										</div>
									</div>
									<div className='pokemon-stat'>
										<span className='stat-label'>{language === 'es' ? 'Resistencia' : 'Resistance'}</span>
										<span className='stat-value'>—</span>
									</div>
									<div className='pokemon-stat'>
										<span className='stat-label'>{language === 'es' ? 'Retirada' : 'Retreat'}</span>
										<EnergySymbol type='colorless' size={17} />
									</div>
								</div>
								
								{/* Flavor text at bottom */}
								<div className='pokemon-flavor-text'>
									<Typewriter content={description} speed={20} startDelay={160} cursor={false} />
								</div>

								{/* Illustrator credit, like real TCG cards */}
								<div className='pokemon-illus'>{language === 'es' ? 'Ilus.' : 'Illus.'} Z. Isaza</div>

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
						{/* Nota: en móvil el flip se maneja por onTouchEnd del contenedor */}
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
				</WrapperComponent>
		</motion.div>
	);
};

// Closed TCG booster pack that covers the deck. Clicking it rips it open
// (top strip tears off, body splits) and unmounts, revealing the shuffling hand.
const packVariants = {
	initial: { opacity: 0, scale: 0.92 },
	float: {
		opacity: 1,
		scale: 1,
		y: [0, -12, 0],
		rotate: [-1, 1, -1],
		transition: {
			opacity: { duration: 0.4 },
			scale: { duration: 0.4 },
			y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
			rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" },
		},
	},
	// Parent stays until the pieces finish ripping, then fades out.
	tear: { opacity: 0, transition: { duration: 0.5, delay: 1.7 } },
};
// A wind-up (a small tug) then the crimped top strip tears off, then the two
// halves slowly peel apart — all drawn out so the rip is easy to follow.
const flapVariants = {
	tear: { y: [0, 8, -340], rotate: [0, 2, -16], opacity: [1, 1, 0], transition: { duration: 1.1, times: [0, 0.22, 1], ease: "easeIn" } },
};
const halfLVariants = {
	tear: { x: ["0%", "1.5%", "-46%"], y: [0, 0, 70], rotate: [0, 1.5, -14], opacity: [1, 1, 0], transition: { duration: 1.35, times: [0, 0.3, 1], ease: "easeIn", delay: 0.35 } },
};
const halfRVariants = {
	tear: { x: ["0%", "-1.5%", "46%"], y: [0, 0, 70], rotate: [0, -1.5, 14], opacity: [1, 1, 0], transition: { duration: 1.35, times: [0, 0.3, 1], ease: "easeIn", delay: 0.35 } },
};
const contentVariants = { tear: { opacity: 0, scale: 0.72, transition: { duration: 0.55, delay: 0.4 } } };

const CardPack = ({ onOpen, language }) => (
	<motion.button
		type='button'
		className='card-pack'
		onClick={onOpen}
		aria-label={language === 'es' ? 'Abrir el sobre de cartas' : 'Open the card pack'}
		variants={packVariants}
		initial='initial'
		animate='float'
		exit='tear'
		whileHover={{ scale: 1.03 }}
		whileTap={{ scale: 0.99 }}
	>
		<motion.span className='pack-piece pack-half pack-half-l' variants={halfLVariants} aria-hidden='true' />
		<motion.span className='pack-piece pack-half pack-half-r' variants={halfRVariants} aria-hidden='true' />
		<span className='pack-fold' aria-hidden='true' />
		<span className='pack-bulge' aria-hidden='true' />
		<span className='pack-shine' aria-hidden='true' />
		<motion.span className='pack-piece pack-top' variants={flapVariants} aria-hidden='true' />
		<span className='pack-bottom' aria-hidden='true' />
		<motion.span className='pack-content' variants={contentVariants}>
			<img className='pack-logo' src={pokemonLogo} alt='Pokémon' draggable='false' />
			<span className='pack-tcg'>TRADING CARD GAME</span>
			<span className='pack-emblem'><span className='pack-ball' /></span>
			<span className='pack-set'>
				<b>PORTFOLIO</b>
				<i>SERVICES</i>
			</span>
			<span className='pack-count'>6 GAME CARDS</span>
		</motion.span>
		<span className='pack-hint'>{language === 'es' ? '✦ Tocá para abrir ✦' : '✦ Click to open ✦'}</span>
	</motion.button>
);

const Works = () => {
	const { t, language } = useLanguage();
	const gridRef = useRef(null);

	// A booster pack covers the deck until clicked. On small screens or with
	// reduced motion we skip the pack and just show the dealt cards.
	const [opened, setOpened] = useState(() => {
		if (typeof window === "undefined") return false;
		return (
			window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
			window.innerWidth < 640
		);
	});
	// 0 = cards stacked/hidden inside the pack, 1 = fully dealt into the grid.
	const openProgress = useMotionValue(opened ? 1 : 0);

	const handleOpen = () => {
		if (opened) return;
		setOpened(true);
		// Long, appreciable sequence: the pack rips (~1s) then the hand shuffles
		// out over a slow, staggered cascade.
		animate(openProgress, 1, { duration: 3, ease: [0.22, 1, 0.36, 1], delay: 0.9 });
	};

	return (
			<>
				<motion.div variants={textVariant()} className='px-4 sm:px-0 -mt-12 md:mt-0'>
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
			<div ref={gridRef} className='relative mt-16 sm:mt-6 md:mt-20 flex flex-wrap gap-16 sm:gap-12 justify-center items-stretch'>
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

				<AnimatePresence>
					{!opened && <BoosterBox3D key='box' onOpen={handleOpen} language={language} />}
				</AnimatePresence>
			</div>
		</>
	);
};

	export default SectionWrapper(Works, "services");