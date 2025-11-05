import { motion } from "framer-motion";
import { useMemo } from "react";

import { useLanguage } from "../context/LanguageContext";

const FLAG_ICONS = {
	en: (
		<svg
			width='32'
			height='22'
			viewBox='0 0 20 14'
			aria-hidden='true'
			className='rounded-[4px] shadow-sm'>
			<rect width='20' height='14' fill='#b22234' />
			<path
				fill='#fff'
				d='M0 2h20v1H0zm0 3h20v1H0zm0 3h20v1H0zm0 3h20v1H0z'
			/>
			<rect width='8.4' height='6.4' fill='#3c3b6e' />
			<g fill='#fff' transform='scale(0.04) translate(8,6)'>
				{Array.from({ length: 9 }).map((_, row) =>
					Array.from({ length: row % 2 === 0 ? 6 : 5 }).map((__, col) => {
						const x = row % 2 === 0 ? col * 18 : col * 18 + 9;
						const y = row * 14;
						return (
							<polygon
								key={`${row}-${col}`}
								points='0,6 3.5,6 4.5,0 5.5,6 9,6 6,9 7.5,14 4.5,11 1.5,14 3,9'
								transform={`translate(${x} ${y})`}
							/>
						);
					})
				)}
			</g>
		</svg>
	),
	es: (
		<svg
			width='32'
			height='22'
			viewBox='0 0 20 14'
			aria-hidden='true'
			className='rounded-[4px] shadow-sm'>
			<rect width='20' height='14' fill='#c60b1e' />
			<rect y='3' width='20' height='8' fill='#ffc400' />
			<rect x='4.5' y='5' width='3.5' height='4' rx='0.6' fill='#c60b1e' />
			<rect x='5' y='5.5' width='2.5' height='3' rx='0.4' fill='#ffc400' />
			<circle cx='6' cy='7' r='0.4' fill='#c60b1e' />
		</svg>
	),
};

const SIZE_PRESETS = {
	desktop: {
		buttonWidth: 48,
		buttonHeight: 32,
		gap: 10,
		padding: 6,
	},
	mobile: {
		buttonWidth: 40,
		buttonHeight: 28,
		gap: 6,
		padding: 4,
	},
	modal: {
		buttonWidth: 60,
		buttonHeight: 40,
		gap: 14,
		padding: 10,
	},
};

const LanguageToggle = ({
	size = "desktop",
	className = "",
	onSelect,
	orientation = "horizontal", // 'horizontal' | 'vertical'
}) => {
	const { language, setLanguage, t } = useLanguage();
	const languages = useMemo(
		() => [
			{ code: "en", label: t("navbar.english") },
			{ code: "es", label: t("navbar.spanish") },
		],
		[t]
	);

	const config = SIZE_PRESETS[size] ?? SIZE_PRESETS.desktop;
	const activeIndex = languages.findIndex(({ code }) => code === language);
	const isVertical = orientation === "vertical";
	const highlightOffset = isVertical
		? activeIndex * (config.buttonHeight + config.gap)
		: activeIndex * (config.buttonWidth + config.gap);

	const handleSelect = (code) => {
		if (onSelect) {
			onSelect(code);
		} else {
			setLanguage(code);
		}
	};

	return (
		<div
			data-language-toggle
			className={`relative flex ${isVertical ? 'flex-col items-center' : 'items-center'} bg-white/60 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-[8px] shadow-lg backdrop-blur-md overflow-hidden flex-shrink-0 transition-colors duration-300 ${className}`}
			style={{
				padding: config.padding,
				...(isVertical ? { rowGap: config.gap } : { columnGap: config.gap }),
			}}
			role='group'
			aria-label={t("navbar.languageLabel")}> 
			{/* Eliminado el outline negro, solo fondo sutil y glow */}
			{activeIndex >= 0 && (
				<motion.span
					initial={false}
					className='absolute rounded-[8px] pointer-events-none bg-gradient-to-br from-black/10 via-black/0 to-black/10 dark:from-white/20 dark:to-white/0 shadow-xl'
					style={{
						width: config.buttonWidth + 8,
						height: config.buttonHeight + 8,
						top: config.padding - 4,
						left: config.padding - 4,
						boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
					}}
					animate={isVertical ? { y: highlightOffset } : { x: highlightOffset }}
					transition={{ type: "spring", stiffness: 380, damping: 28 }}
				/>
			)}
			{languages.map(({ code, label }) => {
				const icon =
					FLAG_ICONS[code] ?? (
						<span className='text-xs font-semibold text-black'>{label}</span>
					);
				const isActive = language === code;
				return (
					<motion.button
						key={code}
						type='button'
						onClick={() => handleSelect(code)}
						className={`relative z-10 flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-1 focus-visible:ring-offset-white/60 transition-transform duration-200
							${isActive ? 'shadow-[0_0_0_3px_rgba(0,0,0,0.12)] dark:shadow-[0_0_0_3px_rgba(255,255,255,0.18)] scale-105' : 'hover:scale-105 hover:shadow-md'}`}
						style={{
							width: config.buttonWidth,
							height: config.buttonHeight,
							background: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
							backdropFilter: isActive ? 'blur(2px)' : undefined,
						}}
						aria-pressed={isActive}
						whileTap={{
							x: [0, 6, -6, 0],
							transition: { duration: 0.35, ease: "easeInOut" },
						}}>
						<span className='sr-only'>{label}</span>
						<span
							className={`inline-flex items-center justify-center transition-all duration-200 ${
								isActive ? 'opacity-100 saturate-150 drop-shadow-[0_1px_4px_rgba(0,0,0,0.10)]' : 'opacity-80 hover:opacity-100 saturate-100'
							}`}
						>
							{icon}
						</span>
					</motion.button>
				);
			})}
		</div>
	);
};

export default LanguageToggle;
