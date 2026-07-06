import { motion } from "framer-motion";
import { useMemo } from "react";

import { useLanguage } from "../context/LanguageContext";

// Flags rendered at a caller-provided size so they scale per preset.
const renderFlag = (code, w, h) => {
	if (code === "en") {
		return (
			<svg width={w} height={h} viewBox='0 0 20 14' aria-hidden='true' className='rounded-[3px] shadow-sm shrink-0'>
				<rect width='20' height='14' fill='#b22234' />
				<path fill='#fff' d='M0 2h20v1H0zm0 3h20v1H0zm0 3h20v1H0zm0 3h20v1H0z' />
				<rect width='8.4' height='6.4' fill='#3c3b6e' />
			</svg>
		);
	}
	return (
		<svg width={w} height={h} viewBox='0 0 20 14' aria-hidden='true' className='rounded-[3px] shadow-sm shrink-0'>
			<rect width='20' height='14' fill='#c60b1e' />
			<rect y='3' width='20' height='8' fill='#ffc400' />
			<rect x='4.5' y='5' width='3.5' height='4' rx='0.6' fill='#c60b1e' />
			<rect x='5' y='5.5' width='2.5' height='3' rx='0.4' fill='#ffc400' />
			<circle cx='6' cy='7' r='0.4' fill='#c60b1e' />
		</svg>
	);
};

// Per-context sizing for the segmented pill.
const SIZE_PRESETS = {
	desktop: { segWidth: 66, segHeight: 34, gap: 2, padding: 4, flagW: 22, flagH: 15, font: 12.5 },
	mobile: { segWidth: 58, segHeight: 30, gap: 2, padding: 3, flagW: 20, flagH: 13, font: 11.5 },
	modal: { segWidth: 92, segHeight: 46, gap: 4, padding: 5, flagW: 30, flagH: 20, font: 16 },
	sidebarMini: { segWidth: 52, segHeight: 30, gap: 2, padding: 3, flagW: 18, flagH: 12, font: 10.5 },
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
	const isVertical = orientation === "vertical";
	const activeIndex = languages.findIndex(({ code }) => code === language);
	const step = isVertical ? config.segHeight + config.gap : config.segWidth + config.gap;
	const thumbOffset = Math.max(activeIndex, 0) * step;

	const handleSelect = (code) => {
		if (onSelect) onSelect(code);
		else setLanguage(code);
	};

	return (
		<div
			data-language-toggle
			className={`relative inline-flex ${isVertical ? "flex-col" : "flex-row"} items-stretch rounded-full bg-white/70 dark:bg-white/10 border border-black/5 dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.08)] backdrop-blur-md flex-shrink-0 ${className}`}
			style={{ padding: config.padding, gap: config.gap }}
			role='group'
			aria-label={t("navbar.languageLabel")}
		>
			{/* Sliding thumb under the active language */}
			{activeIndex >= 0 && (
				<motion.span
					aria-hidden='true'
					className='absolute rounded-full bg-white shadow-[0_3px_10px_rgba(0,0,0,0.18)] ring-1 ring-black/5 pointer-events-none'
					style={{
						width: config.segWidth,
						height: config.segHeight,
						top: config.padding,
						left: config.padding,
					}}
					initial={false}
					animate={isVertical ? { y: thumbOffset } : { x: thumbOffset }}
					transition={{ type: "spring", stiffness: 420, damping: 34 }}
				/>
			)}

			{languages.map(({ code, label }) => {
				const isActive = language === code;
				return (
					<button
						key={code}
						type='button'
						onClick={() => handleSelect(code)}
						aria-pressed={isActive}
						className='relative z-10 flex items-center justify-center gap-1.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 transition-transform duration-200 active:scale-95'
						style={{ width: config.segWidth, height: config.segHeight }}
					>
						<span className='sr-only'>{label}</span>
						<span
							className={`inline-flex transition-all duration-200 ${
								isActive ? "opacity-100 saturate-150" : "opacity-70 saturate-100"
							}`}
						>
							{renderFlag(code, config.flagW, config.flagH)}
						</span>
						<span
							className={`font-semibold tracking-wide transition-colors duration-200 ${
								isActive ? "text-black" : "text-black/45 dark:text-white/50"
							}`}
							style={{ fontSize: config.font }}
						>
							{code.toUpperCase()}
						</span>
					</button>
				);
			})}
		</div>
	);
};

export default LanguageToggle;
