import { useEffect, useRef, useState } from "react";
import "./pokemon.css";

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
	const [active, setActive] = useState(false);

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

	return (
		<div ref={ref} className={`pokemon-fx${active ? "" : " paused"}`} aria-hidden='true'>
			{items.map(({ url, style }) => (
				<span key={url} style={style} />
			))}
		</div>
	);
};

export default PokemonBackground;
