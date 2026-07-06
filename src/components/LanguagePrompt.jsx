import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import Typewriter from "./Typewriter";
import { typeGrass, typeElectric, typeFire, typeWater, typeFairy, typeDark } from "../assets";

const backdropVariants = {
	hidden: { opacity: 0 },
	show: { opacity: 1 },
	exit: { opacity: 0 },
};

const modalVariants = {
	hidden: { opacity: 0, scale: 0.9, y: 40 },
	show: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: { type: "spring", stiffness: 320, damping: 28 },
	},
	exit: {
		opacity: 0,
		scale: 0.92,
		y: 20,
		transition: { duration: 0.2 },
	},
};

const LanguagePrompt = () => {
	const { hasPreference, t, setLanguage, language } = useLanguage();
	const [open, setOpen] = useState(false);
	const [ripples, setRipples] = useState([]);

	// Debug: log preference and open state to help troubleshoot why modal may not show
	useEffect(() => {
		const __isDev__ = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV === true;
		if (__isDev__) {
			console.debug("[LanguagePrompt] hasPreference=", hasPreference, "open=", open);
		}
	}, [hasPreference, open]);

	// Close on Escape key when modal is open
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "Escape") {
				if (!hasPreference) {
					console.debug("[LanguagePrompt] Closing with Escape, setting default to English");
					setLanguage("en");
				}
				setOpen(false);
			}
		};
		if (open && typeof window !== "undefined") {
			window.addEventListener("keydown", onKey);
		}
		return () => window.removeEventListener("keydown", onKey);
	}, [open, hasPreference, setLanguage]);

	useEffect(() => {
		// Mostrar el prompt siempre al cargar la página (antes se mostraba solo si no había preferencia).
		// Mantener las opciones de forzar para desarrollo/URL/localStorage por si se necesitan.
		let forced = false;
		if (typeof window !== "undefined") {
			try {
				const params = new URLSearchParams(window.location.search);
				if (params.get("showLanguagePrompt") === "1") {
					console.debug("[LanguagePrompt] Force show via URL param");
					forced = true;
				}
				if (window.localStorage.getItem("debugShowLanguagePrompt") === "1") {
					console.debug("[LanguagePrompt] Force show via localStorage");
					forced = true;
				}

				// Forzar que aparezca el popup durante el desarrollo
				if (import.meta.env && import.meta.env.DEV === true) {
					console.debug("[LanguagePrompt] Force show in development");
					forced = true;
				}
			} catch (e) {
				console.error("[LanguagePrompt] Error checking force flags:", e);
			}
		}

		console.debug("[LanguagePrompt] Opening prompt on page load (forced=", forced, ")");
		// Delay opening to allow canvas and other heavy components to render first
		const delayTimer = setTimeout(() => {
			setOpen(true);
		}, 1500); // Wait 1.5s for initial render to complete
		return () => clearTimeout(delayTimer);
	}, []);

	const [timer, setTimer] = useState(null);
	const [remainingTime, setRemainingTime] = useState(20);
	const [isDesktop, setIsDesktop] = useState(false);

	useEffect(() => {
		const checkIfDesktop = () => {
			setIsDesktop(window.matchMedia('(min-width: 768px)').matches);
		};
		
		checkIfDesktop();
		window.addEventListener('resize', checkIfDesktop);
		
		return () => window.removeEventListener('resize', checkIfDesktop);
	}, []);

	const handleSelect = (code) => {
		setLanguage(code);
		// Iniciar el timer de 20 segundos
		if (timer) clearTimeout(timer);
		setRemainingTime(20);
		
		const newTimer = setTimeout(() => {
			console.debug("[LanguagePrompt] Timer finished, closing prompt");
			setOpen(false);
		}, 20000);
		
		setTimer(newTimer);
	};

	// Limpiar el timer cuando el componente se desmonte
	useEffect(() => {
		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [timer]);

	// Actualizar el contador cada segundo
	useEffect(() => {
		if (timer && remainingTime > 0) {
			const interval = setInterval(() => {
				setRemainingTime(prev => prev - 1);
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [timer, remainingTime]);

	const handleBackdropClick = (e) => {
		// Si el click/tap fue en el backdrop (fuera del modal)
		if (e.target === e.currentTarget) {
			// Crear ripple effect
			const rect = e.currentTarget.getBoundingClientRect();
			
			// Detectar si es touch o click
			let x, y;
			if (e.touches && e.touches[0]) {
				// Es un evento touch
				x = e.touches[0].clientX - rect.left;
				y = e.touches[0].clientY - rect.top;
			} else {
				// Es un evento click
				x = e.clientX - rect.left;
				y = e.clientY - rect.top;
			}
			
			const newRipple = {
				x,
				y,
				id: Date.now()
			};
			
			setRipples(prev => [...prev, newRipple]);
			
			// Esperar un poco para que se vea la animación antes de cerrar
			setTimeout(() => {
				if (!hasPreference) {
					console.debug("[LanguagePrompt] Closing on backdrop click, setting default to English");
					setLanguage("en");
				}
				setOpen(false);
			}, 300);
			
			// Remover el ripple después de la animación completa
			setTimeout(() => {
				setRipples(prev => prev.filter(r => r.id !== newRipple.id));
			}, 800);
		}
	};

	const handleModalClick = (e) => {
		// Verificar si el click fue en el LanguageToggle o sus hijos
		const isLanguageToggle = e.target.closest('[data-language-toggle]');
		
		if (!isLanguageToggle) {
			// Si no fue en el selector de idiomas, crear ripple y cerrar
			const backdropElement = e.currentTarget.parentElement;
			const rect = backdropElement.getBoundingClientRect();
			
			let x, y;
			if (e.touches && e.touches[0]) {
				x = e.touches[0].clientX - rect.left;
				y = e.touches[0].clientY - rect.top;
			} else {
				x = e.clientX - rect.left;
				y = e.clientY - rect.top;
			}
			
			const newRipple = {
				x,
				y,
				id: Date.now()
			};
			
			setRipples(prev => [...prev, newRipple]);
			
			setTimeout(() => {
				if (!hasPreference) {
					console.debug("[LanguagePrompt] Closing on modal click, setting default to English");
					setLanguage("en");
				}
				setOpen(false);
			}, 300);
			
			setTimeout(() => {
				setRipples(prev => prev.filter(r => r.id !== newRipple.id));
			}, 800);
		}
	};

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					key='language-prompt'
					className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] px-4 cursor-pointer overflow-hidden w-screen'
					style={{ WebkitTapHighlightColor: 'transparent' }}
					variants={backdropVariants}
					initial='hidden'
					animate='show'
					exit='exit'
					onClick={handleBackdropClick}
					onTouchStart={(e) => {
						// Si el tap fue en el backdrop (fuera del modal)
						if (e.target === e.currentTarget) {
							handleBackdropClick(e);
						}
					}}>
					{/* Ripple effects */}
					{ripples.map(ripple => (
						<motion.div
							key={ripple.id}
							className="absolute rounded-full bg-white/20 pointer-events-none"
							style={{
								left: ripple.x,
								top: ripple.y,
								width: 0,
								height: 0,
							}}
							initial={{ width: 0, height: 0, opacity: 0.8 }}
							animate={{ 
								width: 600, 
								height: 600, 
								opacity: 0,
								x: -300,
								y: -300,
							}}
							transition={{ duration: 0.6, ease: "easeOut" }}
						/>
					))}
					{/* Mensaje animado en el backdrop */}
					<motion.p
						className="fixed bottom-12 md:bottom-20 lg:bottom-24 left-0 right-0 mx-auto px-6 sm:px-8 max-w-sm md:max-w-md lg:max-w-lg text-center text-white/90 text-lg md:text-xl tracking-wide font-medium pointer-events-none"
						initial={{ opacity: 0, y: 20 }}
						animate={{
							y: [0, -10, 0],
							opacity: [0.7, 1, 0.7],
						}}
						transition={{
							duration: 3,
							repeat: Infinity,
							ease: "easeInOut"
						}}
					>
						{isDesktop ? t("languagePrompt.clickAnywhere") : t("languagePrompt.tapAnywhere")}
					</motion.p>
					{/* Modal content */}
					<motion.div
						onClick={handleModalClick}
						onTouchStart={handleModalClick}
						className='relative w-[calc(100%-2rem)] max-w-sm md:max-w-md lg:max-w-lg rounded-3xl bg-white-100 shadow-2xl px-8 py-10 text-center space-y-6 border border-black-100/10 cursor-pointer overflow-hidden language-modal-responsive'
						animate={{
							y: language === 'es' ? -40 : 0,
							transition: {
								type: "spring",
								stiffness: 300,
								damping: 25
							}
						}}
						variants={modalVariants}>
						
						{/* Pokemon Type Decorations - Top Left */}
						<motion.div 
							className='absolute -top-8 -left-8 flex gap-2'
							initial={{ opacity: 0, x: -50, rotate: -90 }}
							animate={{ opacity: 0.15, x: 0, rotate: 0 }}
							transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
						>
							<img src={typeGrass} alt='' className='w-16 h-16 opacity-80' />
							<img src={typeElectric} alt='' className='w-14 h-14 opacity-60 mt-2' />
						</motion.div>

						{/* Pokemon Type Decorations - Top Right */}
						<motion.div 
							className='absolute -top-6 -right-6 flex gap-2'
							initial={{ opacity: 0, x: 50, rotate: 90 }}
							animate={{ opacity: 0.15, x: 0, rotate: 0 }}
							transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
						>
							<img src={typeFire} alt='' className='w-14 h-14 opacity-70 mt-3' />
							<img src={typeWater} alt='' className='w-16 h-16 opacity-80' />
						</motion.div>

						{/* Pokemon Type Decorations - Bottom Left */}
						<motion.div 
							className='absolute -bottom-6 -left-6'
							initial={{ opacity: 0, x: -50, y: 50, rotate: -45 }}
							animate={{ opacity: 0.12, x: 0, y: 0, rotate: 0 }}
							transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
						>
							<img src={typeFairy} alt='' className='w-16 h-16' />
						</motion.div>

						{/* Pokemon Type Decorations - Bottom Right */}
						<motion.div 
							className='absolute -bottom-8 -right-8'
							initial={{ opacity: 0, x: 50, y: 50, rotate: 45 }}
							animate={{ opacity: 0.12, x: 0, y: 0, rotate: 0 }}
							transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
						>
							<img src={typeDark} alt='' className='w-16 h-16' />
						</motion.div>

						{/* Floating Pokemon Types - Center decorations */}
						<motion.div 
							className='absolute top-1/2 left-4 transform -translate-y-1/2'
							animate={{ 
								y: [-10, 10, -10],
								rotate: [0, 5, 0, -5, 0]
							}}
							transition={{ 
								duration: 4,
								repeat: Infinity,
								ease: "easeInOut"
							}}
						>
							<img src={typeElectric} alt='' className='w-10 h-10 opacity-10' />
						</motion.div>

						<motion.div 
							className='absolute top-1/2 right-4 transform -translate-y-1/2'
							animate={{ 
								y: [10, -10, 10],
								rotate: [0, -5, 0, 5, 0]
							}}
							transition={{ 
								duration: 5,
								repeat: Infinity,
								ease: "easeInOut",
								delay: 0.5
							}}
						>
							<img src={typeFire} alt='' className='w-10 h-10 opacity-10' />
						</motion.div>

						<style>
							{`
								@keyframes wave {
									0% { transform: rotate(0deg); }
									10% { transform: rotate(14deg); }
									20% { transform: rotate(-8deg); }
									30% { transform: rotate(14deg); }
									40% { transform: rotate(-4deg); }
									50% { transform: rotate(10deg); }
									60% { transform: rotate(0deg); }
									100% { transform: rotate(0deg); }
								}
								.wave {
									display: inline-block;
									animation: wave 2.5s infinite;
									transform-origin: 70% 70%;
								}
							`}
						</style>
						<h2 className='text-2xl font-semibold text-black-200'>
							<Typewriter 
								key={`title-${language}`}
								rich 
								content={t("languagePrompt.title")} 
								speed={8} 
								startDelay={0} 
								cursor={false}
							/>
						</h2>
						<div className='text-sm text-black-100/80 leading-relaxed text-left'>
							{t("languagePrompt.description").split('\n').map((line, i) => (
								<p key={`${language}-${i}`} className="mb-4 last:mb-0">
									<Typewriter 
										key={`desc-${language}-${i}`}
										rich 
										content={line} 
										speed={6} 
										startDelay={30 + (i * 40)} 
										cursor={false}
									/>
								</p>
							))}
						</div>
						<div className='flex flex-col items-center space-y-4'>
							<LanguageToggle size='modal' onSelect={handleSelect} />
							{timer && (
								<p className="text-sm text-black-100/60">
									{t("languagePrompt.closingIn").replace("{seconds}", remainingTime)}
								</p>
							)}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default LanguagePrompt;
