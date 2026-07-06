import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./arcade.css";

// Each strip is one row of a sheet = one character's animation. Frames are
// driven by SCROLL, and the fighters live in the section's side gutters so
// they animate as you scroll down.
const F = [
	{ file: "/arcade/sprites/b0.png", frames: 5, w: 68, h: 97 },
	{ file: "/arcade/sprites/a4.png", frames: 8, w: 75, h: 85 },
	{ file: "/arcade/sprites/b1.png", frames: 6, w: 72, h: 96 },
	{ file: "/arcade/sprites/a5.png", frames: 8, w: 77, h: 114 },
	{ file: "/arcade/sprites/b3.png", frames: 6, w: 76, h: 129 },
	{ file: "/arcade/sprites/a1.png", frames: 9, w: 64, h: 92 },
	{ file: "/arcade/sprites/b2.png", frames: 4, w: 150, h: 126 },
	{ file: "/arcade/sprites/a3.png", frames: 8, w: 134, h: 95 },
];

// side + vertical position down the section
const SLOTS = [
	["left", "8%"],
	["right", "15%"],
	["left", "31%"],
	["right", "39%"],
	["left", "54%"],
	["right", "62%"],
	["left", "77%"],
	["right", "85%"],
];

const TARGET_H = 148; // normalize every fighter to the same on-screen height

const Fighter = ({ anim, side, top, progress, i }) => {
	const scale = TARGET_H / anim.h;
	const w = Math.round(anim.w * scale);
	const h = Math.round(TARGET_H);
	const cycles = 2 + (i % 3);
	const phase = (i * 0.19) % 1;
	const posX = useTransform(progress, (p) => {
		const t = (((p * cycles + phase) % 1) + 1) % 1;
		const frame = Math.min(anim.frames - 1, Math.floor(t * anim.frames));
		return `${-(frame * w)}px`;
	});
	return (
		<motion.div
			className={`sf-fighter sf-${side}`}
			aria-hidden='true'
			style={{
				top,
				width: `${w}px`,
				height: `${h}px`,
				backgroundImage: `url('${anim.file}')`,
				backgroundSize: `${w * anim.frames}px ${h}px`,
				backgroundPositionX: posX,
			}}
		/>
	);
};

const ArcadeFighters = () => {
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});
	return (
		<div ref={ref} className='sf-layer hidden xl:block' aria-hidden='true'>
			{F.map((a, i) => (
				<Fighter
					key={a.file}
					anim={a}
					side={SLOTS[i][0]}
					top={SLOTS[i][1]}
					progress={scrollYProgress}
					i={i}
				/>
			))}
		</div>
	);
};

export default ArcadeFighters;
