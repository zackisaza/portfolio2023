import { useEffect, useRef, useState } from "react";
import "./pokemon.css";
import { useLanguage } from "../context/LanguageContext";
import { useServicesGame } from "../context/ServicesGameContext";
import gameboyLogo from "../assets/pokemon/logogameboy.webp";

// The entire Gen-1 Kanto roster, cropped from the sprite sheet. Vite globs
// every PNG in the folder, so dropping more sprites in auto-includes them.
const sprites = Object.values(
	import.meta.glob("../assets/pokemon/kanto/*.png", { eager: true, as: "url" })
);

// Deterministic pseudo-random per sprite index — stable across renders so the
// swarm layout doesn't jump on every re-render.
const rnd = (i, salt) => {
	const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
	return x - Math.floor(x);
};

// Precompute the per-sprite style once (module load), not on every render.
const items = sprites.map((url, i) => {
	const dur = 16 + rnd(i, 3) * 16;
	return {
		url,
		style: {
			"--img": `url(${url})`,
			"--x": `${(rnd(i, 1) * 100).toFixed(2)}%`,
			"--s": `${(30 + rnd(i, 2) * 44).toFixed(0)}px`,
			"--dur": `${dur.toFixed(1)}s`,
			"--d": `${(-rnd(i, 4) * dur).toFixed(1)}s`,
			"--sway": `${((rnd(i, 5) * 2 - 1) * 34).toFixed(0)}px`,
			"--rot": `${((rnd(i, 6) * 2 - 1) * 12).toFixed(0)}deg`,
		},
	};
});

// The whole Kanto roster drifts upward. Animations are paused whenever the
// section is outside the viewport, so it costs nothing while scrolled away.
const PokemonBackground = () => {
	const ref = useRef(null);
	const swarmRef = useRef(null);
	const [active, setActive] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [rise, setRise] = useState(null);
	const { language } = useLanguage();
	const game = useServicesGame();

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const io = new IntersectionObserver(
			([entry]) => setActive(entry.isIntersecting),
			{ rootMargin: "200px 0px" }
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

	// The mobile LCD is a tall, narrow screen — the full 154-sprite swarm reads as
	// cramped noise there, so thin it to ~1/6 (roster stays full on desktop).
	useEffect(() => {
		const mq = window.matchMedia("(max-width: 639px)");
		const update = () => setIsMobile(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);

	const swarm = isMobile ? items.filter((_, i) => i % 6 === 0) : items;

	// Measure the (tall) mobile LCD so sprites drift across its FULL height.
	// Desktop keeps the CSS default (120vh); on mobile we feed the real px height.
	useEffect(() => {
		if (!isMobile) {
			setRise(null);
			return;
		}
		const el = swarmRef.current;
		if (!el) return;
		const update = () => setRise(el.clientHeight + 140);
		update();
		const ro = new ResizeObserver(update);
		ro.observe(el);
		return () => ro.disconnect();
	}, [isMobile]);

	const tutorial = game?.opened
		? language === "es"
			? "◄ ► Cambiar carta    Ⓑ Voltear"
			: "◄ ► Change card    Ⓑ Flip"
		: isMobile
			? language === "es"
				? "Toca la caja para abrirla"
				: "Tap the box to open it"
			: language === "es"
				? "Presiona Ⓐ para abrir la caja"
				: "Press Ⓐ to open the box";

	// D-pad: left half → previous card, right half → next card, and rock the
	// cross toward the pressed side.
	const onDpad = (e) => {
		if (!game) return;
		const el = e.currentTarget;
		const r = el.getBoundingClientRect();
		const left = e.clientX < r.left + r.width / 2;
		game.move(left ? -1 : 1);
		el.classList.remove("is-left", "is-right");
		void el.offsetWidth; // restart the tilt animation
		el.classList.add(left ? "is-left" : "is-right");
		window.clearTimeout(el._t);
		el._t = window.setTimeout(() => el.classList.remove("is-left", "is-right"), 220);
	};

	return (
		<div ref={ref} className={`pokemon-fx${active ? "" : " paused"}`}>
			{/* Game Boy screen — the drifting sprites live only inside the LCD. */}
			<div className='gb-screen'>
				<span className='gb-battery' />
				<div className='gb-screen-header'>
					<span className='gb-lines' />
					<span className='gb-screen-label'>DOT MATRIX WITH STEREO SOUND</span>
				</div>
				<div className='gb-lcd'>
					<div
						className='pokemon-swarm'
						ref={swarmRef}
						style={rise ? { "--rise": `${rise}px` } : undefined}
					>
						{swarm.map(({ url, style }) => (
							<span key={url} style={style} />
						))}
					</div>
					{/* In-game style tutorial hint */}
					<div className={`gb-tutorial${game?.opened ? "" : " gb-tutorial--cta"}`}>{tutorial}</div>
				</div>
			</div>
			{/* GAME BOY wordmark below the screen */}
			<div className='gb-logo'>
				<img src={gameboyLogo} alt='' className='gb-logo-gb' />
			</div>
			{/* Game Boy controls — CSS, wired to the console context */}
			<div className='gb-dpad' onPointerDown={onDpad} role='button' tabIndex={-1} aria-label='Change card'>
				<span className='gb-dpad-dot' />
			</div>
			<div className='gb-ab'>
				<span className='gb-ab-btn'><i onClick={() => game?.pressB()} /><em>B</em></span>
				<span className='gb-ab-btn'><i onClick={() => game?.pressA()} /><em>A</em></span>
			</div>
			<div className='gb-startselect'>
				<div className='gb-ss-inner'>
					<span className='gb-ss-btn'><i /><em>SELECT</em></span>
					<span className='gb-ss-btn'><i /><em>START</em></span>
				</div>
			</div>
			<div className='gb-speaker' />
		</div>
	);
};

export default PokemonBackground;
