import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { styles } from "../styles";
import { experiences } from "../constants";
import Typewriter from "./Typewriter";
import { SectionWrapper } from "../hoc";
import { textVariant, fadeIn } from "../utils/motion";
import { useLanguage } from "../context/LanguageContext";

// Each company is a metro "line" — colour + 2-letter station code (Tokyo style).
const LINES = {
	"conversion monster": { color: "#F59E0B", code: "CM", name: "Conversion Monster" },
	"soluciones star": { color: "#E11D48", code: "SS", name: "Soluciones Star" },
	"system life": { color: "#2563EB", code: "SL", name: "System Life" },
	remote: { color: "#059669", code: "FR", name: "Freelance" },
	remoto: { color: "#059669", code: "FR", name: "Freelance" },
};
const FALLBACK_LINE = { color: "#8B5CF6", code: "XX", name: "" };

const normalizeCompany = (companyStr = "") =>
	companyStr.split(/–|—|-|\(/)[0].trim().toLowerCase();

const lineOf = (companyEn) => LINES[normalizeCompany(companyEn)] ?? FALLBACK_LINE;

// Horizontal offset (px) of the track per company — the line bends at each transfer.
const CENTER = 48;
const OFFSETS = { "conversion monster": 0, "soluciones star": 22, "system life": -20, remote: 0, remoto: 0 };
const offsetOf = (companyEn) => OFFSETS[normalizeCompany(companyEn)] ?? 0;

// Decorative Tokyo-style transit lines for the background map (full-bleed).
const MAP_LINES = [
	{ c: "#f39700", d: "M-40 120 L300 120 L400 220 L800 220 L900 120 L1300 120 L1400 220 L1640 220" },
	{ c: "#2563eb", d: "M-40 44 L500 44 L620 164 L1000 164 L1120 44 L1640 44" },
	{ c: "#c1a470", d: "M-40 220 L160 220 L280 340 L520 340 L640 220 L920 220 L1040 340 L1640 340" },
	{ c: "#009bbf", d: "M-40 400 L200 400 L320 280 L640 280 L760 400 L1100 400 L1220 520 L1640 520" },
	{ c: "#00a650", d: "M-40 640 L240 640 L360 520 L560 520 L680 640 L1000 640 L1120 520 L1300 520 L1420 640 L1640 640" },
	{ c: "#9c5e31", d: "M-40 760 L400 760 L520 640 L900 640 L1020 760 L1640 760" },
	{ c: "#e60012", d: "M120 -40 L120 300 L260 440 L260 700 L400 840 L400 940" },
	{ c: "#8f76d6", d: "M300 940 L300 640 L440 500 L440 240 L580 100 L580 -40" },
	{ c: "#ce045b", d: "M700 -40 L700 200 L840 340 L840 620 L980 760 L980 940" },
	{ c: "#00ac9b", d: "M1640 160 L1200 160 L1080 280 L820 280 L700 160 L440 160 L340 60 L340 -40" },
	{ c: "#ec6d69", d: "M1100 940 L1100 680 L1240 540 L1240 300 L1380 160 L1640 160" },
	{ c: "#6cbb5a", d: "M900 940 L900 700 L1040 560 L1400 560 L1520 440 L1640 440" },
];
const MAP_TICKS = [
	[400, 220], [800, 220], [900, 120], [1300, 120], [620, 164], [1000, 164],
	[280, 340], [520, 340], [640, 220], [1040, 340], [320, 280], [760, 400],
	[360, 520], [680, 640], [1120, 520], [520, 640], [260, 440], [440, 240],
	[840, 340], [700, 160], [1240, 300], [1040, 560], [400, 760], [980, 760],
];

const MetroMapBackground = () => (
	<div className='absolute top-0 left-1/2 -translate-x-1/2 w-screen h-full overflow-hidden pointer-events-none z-0'>
		<svg className='w-full h-full' viewBox='0 0 1600 900' preserveAspectRatio='xMidYMid slice' aria-hidden='true'>
			<defs>
				<pattern id='mmgrid' width='48' height='48' patternUnits='userSpaceOnUse'>
					<path d='M48 0 H0 V48' fill='none' stroke='rgba(0,0,0,0.05)' strokeWidth='1' />
				</pattern>
			</defs>
			<rect x='0' y='0' width='1600' height='900' fill='url(#mmgrid)' />
			{/* White casing so crossings layer like a real map */}
			<g fill='none' stroke='#e9edf1' strokeWidth='11' strokeLinejoin='round' strokeLinecap='round'>
				{MAP_LINES.map((l, i) => (
					<path key={`casing-${i}`} d={l.d} />
				))}
			</g>
			{/* Coloured transit lines */}
			<g fill='none' strokeWidth='6' strokeLinejoin='round' strokeLinecap='round' opacity='0.9'>
				{MAP_LINES.map((l, i) => (
					<path key={`line-${i}`} d={l.d} stroke={l.c} />
				))}
			</g>
			{/* Station ticks */}
			<g>
				{MAP_TICKS.map(([x, y], i) => (
					<circle key={i} cx={x} cy={y} r='6' fill='#fff' stroke='rgba(0,0,0,0.35)' strokeWidth='2.5' />
				))}
			</g>
		</svg>
	</div>
);

const Rich = ({ html, className }) => (
	<span className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

const StationNode = ({ color, icon, alt }) => (
	<span
		className='relative z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white'
		style={{ boxShadow: `0 0 0 4px ${color}, 0 4px 12px rgba(0,0,0,0.25)` }}
	>
		<img src={icon} alt={alt} className='w-6 h-6 object-contain rounded-full' />
	</span>
);

const Terminal = ({ kanji, label, color }) => (
	<div className='flex items-center gap-4'>
		<div className='w-24 flex flex-col items-center shrink-0'>
			<span
				className='relative z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white text-black font-black text-[17px]'
				style={{ boxShadow: `0 0 0 4px ${color}, 0 4px 12px rgba(0,0,0,0.2)` }}
			>
				{kanji}
			</span>
		</div>
		<span className='text-slate-700 font-bold tracking-widest text-sm uppercase'>{label}</span>
	</div>
);

const Station = ({ experience, copy, line, code, index, offset, prevOffset }) => (
	<motion.div variants={fadeIn("up", "spring", 0.08 * index, 0.55)} className='flex gap-4'>
		{/* Line + node column (weaves like a metro map) */}
		<div className='relative w-24 shrink-0'>
			<svg width='96' height='44' className='absolute top-0 left-0 overflow-visible'>
				<path
					d={`M${CENTER + prevOffset} 0 L${CENTER + prevOffset} 8 L${CENTER + offset} 34 L${CENTER + offset} 44`}
					fill='none'
					stroke={line.color}
					strokeWidth='6'
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</svg>
			<span className='absolute bottom-0 w-[6px] rounded-full' style={{ left: `${CENTER + offset - 3}px`, top: "40px", backgroundColor: line.color }} />
			<div className='absolute' style={{ left: `${CENTER + offset}px`, top: "18px", transform: "translateX(-50%)" }}>
				<StationNode color={line.color} icon={experience.icon} alt={copy.company_name} />
			</div>
		</div>

		{/* Station card */}
		<div className='flex-1 pb-10'>
			<div className='rounded-2xl border border-black/[0.06] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.12)] p-5 hover:shadow-[0_16px_44px_rgba(15,23,42,0.2)] transition-shadow duration-300'>
				<div className='flex items-center gap-2.5 mb-1.5 flex-wrap'>
					<span className='text-[11px] font-black tracking-widest text-white px-2 py-0.5 rounded' style={{ backgroundColor: line.color }}>
						{line.code} {code}
					</span>
					<span className='text-slate-400 text-xs font-medium'>{copy.date}</span>
				</div>
				<h3 className='text-slate-900 text-[20px] font-bold leading-tight'>{copy.title}</h3>
				<div className='text-[14px] font-semibold mt-0.5' style={{ color: line.color }}>
					{copy.company_name}
				</div>
				<ul className='mt-4 space-y-2.5'>
					{copy.points.map((point, i) => (
						<li key={i} className='flex gap-2.5 text-slate-600 text-[14px] leading-relaxed'>
							<span className='mt-2 w-1.5 h-1.5 rounded-full shrink-0' style={{ backgroundColor: line.color }} />
							<Rich html={point} />
						</li>
					))}
				</ul>
			</div>
		</div>
	</motion.div>
);

const Experience = () => {
	const { t, language } = useLanguage();

	// Scroll-driven metro: position + line colour follow the scroll through the section.
	const sectionRef = useRef(null);
	const railRef = useRef(null);
	const [railH, setRailH] = useState(0);
	const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
	const TRAIN_H = 560;
	const trainY = useTransform(scrollYProgress, [0, 1], [0, Math.max(0, railH - TRAIN_H)]);
	const trainColor = useTransform(
		scrollYProgress,
		[0, 0.35, 0.55, 0.8, 1],
		["#F59E0B", "#F59E0B", "#E11D48", "#2563EB", "#059669"]
	);

	useEffect(() => {
		const el = railRef.current;
		if (!el) return undefined;
		const update = () => setRailH(el.clientHeight);
		update();
		const ro = new ResizeObserver(update);
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	// Station numbers per line, counting from the oldest job (01) upward.
	const stationCode = {};
	const counters = {};
	[...experiences].reverse().forEach((exp) => {
		const key = normalizeCompany(exp.translations.en.company_name);
		counters[key] = (counters[key] ?? 0) + 1;
		stationCode[exp.id] = String(counters[key]).padStart(2, "0");
	});

	const seen = new Set();
	const legend = [];
	experiences.forEach((exp) => {
		const line = lineOf(exp.translations.en.company_name);
		if (!seen.has(line.code)) {
			seen.add(line.code);
			legend.push(line);
		}
	});

	const topLine = lineOf(experiences[0].translations.en.company_name);
	const bottomLine = lineOf(experiences[experiences.length - 1].translations.en.company_name);

	return (
		<div ref={sectionRef} className='relative'>
			<MetroMapBackground />

			{/* Scroll-driven metro on rails — fills the empty right space */}
			<div className='hidden lg:block absolute top-4 bottom-4 right-0 xl:right-8 w-16 pointer-events-none select-none z-[5]'>
				<div ref={railRef} className='relative h-full w-full'>
					<span className='absolute inset-y-0 left-1/2 -translate-x-[12px] w-[3px] rounded bg-gradient-to-b from-black/10 via-black/30 to-black/10' />
					<span className='absolute inset-y-0 left-1/2 translate-x-[9px] w-[3px] rounded bg-gradient-to-b from-black/10 via-black/30 to-black/10' />
					<div
						className='absolute inset-y-0 left-1/2 -translate-x-1/2 w-11'
						style={{ backgroundImage: "repeating-linear-gradient(to bottom, rgba(0,0,0,0.16) 0 3px, transparent 3px 24px)" }}
					/>
					<motion.div style={{ top: trainY }} className='absolute left-1/2 -translate-x-1/2 z-10'>
						<motion.div
							animate={{ x: [0, -1, 0, 1, 0] }}
							transition={{ duration: 0.34, repeat: Infinity, ease: "easeInOut" }}
							className='flex flex-col items-center'
						>
							<svg width='50' height='560' viewBox='0 0 50 560' className='drop-shadow-[0_12px_22px_rgba(0,0,0,0.35)]'>
								<motion.path
									d='M9 30 Q9 8 25 8 Q41 8 41 30 L41 494 Q41 532 25 554 Q9 532 9 494 Z'
									style={{ fill: trainColor }}
									stroke='rgba(255,255,255,0.6)'
									strokeWidth='1.5'
								/>
								<rect x='11' y='30' width='2' height='464' rx='1' fill='#fff' opacity='0.55' />
								<rect x='37' y='30' width='2' height='464' rx='1' fill='#fff' opacity='0.55' />
								<rect x='15' y='22' width='20' height='476' rx='6' fill='rgba(0,0,0,0.28)' />
								<rect x='24' y='22' width='2' height='476' fill='rgba(0,0,0,0.22)' />
								<rect x='9' y='107' width='32' height='3' fill='rgba(0,0,0,0.3)' />
								<rect x='9' y='185' width='32' height='3' fill='rgba(0,0,0,0.3)' />
								<rect x='9' y='262' width='32' height='3' fill='rgba(0,0,0,0.3)' />
								<rect x='9' y='339' width='32' height='3' fill='rgba(0,0,0,0.3)' />
								<rect x='9' y='417' width='32' height='3' fill='rgba(0,0,0,0.3)' />
								<rect x='18' y='50' width='14' height='10' rx='2' fill='rgba(0,0,0,0.4)' />
								<rect x='18' y='128' width='14' height='10' rx='2' fill='rgba(0,0,0,0.4)' />
								<rect x='18' y='205' width='14' height='10' rx='2' fill='rgba(0,0,0,0.4)' />
								<rect x='18' y='283' width='14' height='10' rx='2' fill='rgba(0,0,0,0.4)' />
								<rect x='18' y='360' width='14' height='10' rx='2' fill='rgba(0,0,0,0.4)' />
								<rect x='18' y='438' width='14' height='9' rx='2' fill='rgba(0,0,0,0.4)' />
								<path d='M16 508 Q25 504 34 508 L31 526 Q25 530 19 526 Z' fill='rgba(18,28,44,0.7)' />
								<path d='M19 530 Q25 529 31 530 Q28 547 25 553 Q22 547 19 530 Z' fill='#e11d48' />
							</svg>
							<div className='w-12 h-24 -mt-2 bg-gradient-to-b from-amber-300/40 to-transparent blur-md rounded-b-full' />
						</motion.div>
					</motion.div>
				</div>
			</div>

			{/* Metro-map title & legend card */}
			<motion.div variants={textVariant()} className='relative z-20 inline-block max-w-full'>
				<div className='rounded-2xl bg-white border border-black/[0.06] shadow-[0_16px_48px_rgba(15,23,42,0.18)] overflow-hidden'>
					{/* Route accent bar (the line colours) */}
					<div className='flex h-2'>
						{legend.map((l) => (
							<span key={l.code} className='flex-1' style={{ backgroundColor: l.color }} />
						))}
					</div>
					<div className='px-6 sm:px-8 py-5'>
						{/* Eyebrow with metro icon */}
						<div className='flex items-center gap-2.5'>
							<svg width='26' height='26' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
								<rect x='5' y='3' width='14' height='15' rx='4' fill='#8b1120' />
								<rect x='7' y='6' width='10' height='4.5' rx='1.2' fill='#a5f3fc' />
								<circle cx='9' cy='14' r='1.3' fill='#fff' />
								<circle cx='15' cy='14' r='1.3' fill='#fff' />
								<path d='M8.5 18 L6.5 21.5 M15.5 18 L17.5 21.5' stroke='#8b1120' strokeWidth='2' strokeLinecap='round' />
							</svg>
							<p className={`${styles.sectionSubText} !text-slate-500 !text-left`}>
								<Typewriter content={t("experience.subtitle")} speed={26} startDelay={60} />
							</p>
						</div>
						<h2 className={`${styles.sectionHeadText} !text-slate-900 !text-left`}>
							<Typewriter content={t("experience.title")} speed={26} startDelay={120} />
						</h2>
						<div className='mt-4 mb-3 h-px bg-black/10' />
						{/* Line legend */}
						<div className='flex flex-wrap items-center gap-x-5 gap-y-2'>
							<span className='inline-flex items-baseline gap-1.5 mr-1'>
								<span className='text-tertiary font-black text-sm'>キャリア線</span>
								<span className='text-slate-400 text-[10px] font-semibold tracking-widest uppercase'>Career Line</span>
							</span>
							{legend.map((l) => (
								<div key={l.code} className='flex items-center gap-2'>
									<span className='w-6 h-[6px] rounded-full' style={{ backgroundColor: l.color }} />
									<span className='text-slate-600 text-xs'>
										<b style={{ color: l.color }}>{l.code}</b> {l.name}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</motion.div>

			<motion.div variants={fadeIn("up", "spring", 0.1, 0.6)} className='relative z-10 mt-10 max-w-3xl'>
				{/* Terminal — today */}
				<div className='relative'>
					<span className='absolute left-12 top-6 bottom-[-8px] w-[6px] -translate-x-1/2 rounded-full' style={{ backgroundColor: topLine.color }} />
					<Terminal kanji='今' label={language === "es" ? "Hoy" : "Now"} color={topLine.color} />
				</div>

				{/* Stations */}
				<div className='mt-2'>
					{experiences.map((experience, index) => {
						const copy = experience.translations[language] ?? experience.translations.en;
						const line = lineOf(experience.translations.en.company_name);
						const offset = offsetOf(experience.translations.en.company_name);
						const prevOffset =
							index === 0 ? offset : offsetOf(experiences[index - 1].translations.en.company_name);
						return (
							<Station
								key={experience.id}
								experience={experience}
								copy={copy}
								line={line}
								code={stationCode[experience.id]}
								index={index}
								offset={offset}
								prevOffset={prevOffset}
							/>
						);
					})}
				</div>

				{/* Terminal — start */}
				<div className='relative'>
					<span className='absolute left-12 top-[-10px] h-8 w-[6px] -translate-x-1/2 rounded-full' style={{ backgroundColor: bottomLine.color }} />
					<Terminal kanji='始' label={language === "es" ? "Inicio" : "Start"} color={bottomLine.color} />
				</div>
			</motion.div>
		</div>
	);
};

export default SectionWrapper(Experience, "experience");
