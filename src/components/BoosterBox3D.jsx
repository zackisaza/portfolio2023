import { Component, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { motion } from "framer-motion";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { TextureLoader, SRGBColorSpace } from "three";
import pokemonLogo from "../assets/pokemon/pokemon-logo.png";

// Faithful port of the folding-cardboard-box technique (uuuulala, MIT):
// four vertical walls (front/back × width/length) each with hinged top &
// bottom flaps built from corrugated 3-layer geometry. The box stays erected
// (openingAngle = 90°); clicking unfolds the top flaps to open it.
const mergeGeometries =
	BufferGeometryUtils.mergeGeometries || BufferGeometryUtils.mergeBufferGeometries;

// Tall, slim box (a standing booster pack/box): depth is the vertical height,
// length the front width, width the front-to-back thickness.
const P = {
	width: 16, // front-to-back thickness
	length: 46, // front face width
	depth: 92, // vertical height
	thickness: 0.6,
	fluteFreq: 5,
	flapGap: 1,
	seg: 1.6, // segments-per-unit (lower than the original 5 for perf)
};
const LOGO_ASPECT = 750 / 1200;
const HALF_PI = 0.5 * Math.PI;

function createSideGeometry(baseGeometry, size, folds, hasMiddleLayer) {
	const layer = (offset) => {
		const g = baseGeometry.clone();
		const pos = g.attributes.position;
		const modifier = (c, s) => 1 - Math.pow(c / (0.5 * s), 10);
		for (let i = 0; i < pos.count; i++) {
			const x = pos.getX(i);
			const y = pos.getY(i);
			let z = pos.getZ(i) + offset(x);
			if ((x > 0 && folds[1]) || (x < 0 && folds[3])) z *= modifier(x, size[0]);
			if ((y > 0 && folds[0]) || (y < 0 && folds[2])) z *= modifier(y, size[1]);
			pos.setXYZ(i, x, y, z);
		}
		return g;
	};
	const geos = [
		layer((v) => -0.5 * P.thickness + 0.01 * Math.sin(P.fluteFreq * v)),
		layer((v) => 0.5 * P.thickness + 0.01 * Math.sin(P.fluteFreq * v)),
	];
	if (hasMiddleLayer) geos.push(layer((v) => 0.5 * P.thickness * Math.sin(P.fluteFreq * v)));
	const merged = mergeGeometries(geos, false);
	merged.computeVertexNormals();
	return merged;
}

function buildPanels() {
	const out = {};
	for (const side of ["width", "length"]) {
		const sideWidth = side === "width" ? P.width : P.length;
		const flapWidth = sideWidth - 2 * P.flapGap;
		const flapHeight = 0.5 * P.width - 0.75 * P.flapGap;
		const sidePlane = new THREE.PlaneGeometry(sideWidth, P.depth, Math.floor(P.seg * sideWidth), Math.max(1, Math.floor(0.2 * P.depth)));
		const flapPlane = new THREE.PlaneGeometry(flapWidth, flapHeight, Math.floor(P.seg * flapWidth), Math.max(1, Math.floor(0.2 * flapHeight)));
		const top = createSideGeometry(flapPlane, [flapWidth, flapHeight], [false, false, true, false], true);
		const bottom = createSideGeometry(flapPlane, [flapWidth, flapHeight], [true, false, false, false], true);
		top.translate(0, 0.5 * flapHeight, 0);
		bottom.translate(0, -0.5 * flapHeight, 0);
		out[side] = {
			side: createSideGeometry(sidePlane, [sideWidth, P.depth], [true, true, true, true], false),
			top,
			bottom,
		};
	}
	return out;
}

// A logo decal placed on a wall's outer face.
function LogoPlane({ tex, w, y, z, rotY = 0 }) {
	return (
		<mesh position={[0, y, z]} rotation={[0, rotY, 0]}>
			<planeGeometry args={[w, w * LOGO_ASPECT]} />
			<meshBasicMaterial map={tex} transparent toneMapped={false} side={THREE.DoubleSide} />
		</mesh>
	);
}

// One wall + its two flaps. topRef exposes the top flap so it can be animated.
function Wall({ geo, position, rotationY, topSign, bottomSign, material, topRef, children }) {
	return (
		<mesh geometry={geo.side} material={material} position={position} rotation={[0, rotationY, 0]}>
			<mesh ref={topRef} geometry={geo.top} material={material} position={[0, 0.5 * P.depth, 0]} />
			<mesh geometry={geo.bottom} material={material} position={[0, -0.5 * P.depth, 0]} rotation={[bottomSign * HALF_PI, 0, 0]} />
			{children}
		</mesh>
	);
}

function BoxGroup({ opening, pointer }) {
	const geo = useMemo(buildPanels, []);
	const logo = useLoader(TextureLoader, pokemonLogo);
	logo.colorSpace = SRGBColorSpace;

	const material = useMemo(
		() => new THREE.MeshStandardMaterial({ color: new THREE.Color(0xd9b98f), roughness: 0.85, metalness: 0.05, side: THREE.DoubleSide }),
		[]
	);

	const group = useRef();
	const p = useRef(0); // 0 closed → 1 open
	// top-flap refs (sign already baked into how we set rotation.x)
	const fwTop = useRef(), bwTop = useRef(), flTop = useRef(), blTop = useRef();

	useFrame((state, dt) => {
		p.current += ((opening ? 1 : 0) - p.current) * Math.min(1, dt * 3);
		// top flap angle: closed = 90° (sealed), open = slightly splayed out
		const a = HALF_PI + (-0.12 * Math.PI - HALF_PI) * p.current;
		if (fwTop.current) fwTop.current.rotation.x = -a;
		if (flTop.current) flTop.current.rotation.x = -a;
		if (bwTop.current) bwTop.current.rotation.x = a;
		if (blTop.current) blTop.current.rotation.x = a;

		const t = state.clock.elapsedTime;
		if (group.current) {
			group.current.rotation.y = t * 0.18 + pointer.current.x * 0.5;
			group.current.rotation.x = -0.12 + pointer.current.y * 0.18;
			group.current.position.y = Math.sin(t * 0.8) * 1.2 + p.current * 12;
		}
	});

	const cos = 0, sin = 1; // openingAngle = 90°

	return (
		<group ref={group}>
			{/* width walls (short sides), rotated 90° */}
			<Wall geo={geo.width} position={[0.5 * P.length, 0, 0]} rotationY={HALF_PI} bottomSign={1} material={material} topRef={fwTop} />
			<Wall geo={geo.width} position={[-0.5 * P.length, 0, 0]} rotationY={HALF_PI} bottomSign={-1} material={material} topRef={bwTop} />
			{/* length walls (long sides), front & back */}
			<Wall geo={geo.length} position={[-0.5 * cos * P.width, 0, 0.5 * sin * P.width]} rotationY={0} bottomSign={1} material={material} topRef={flTop}>
				{/* Pokémon logo on the upper front wall */}
				<mesh position={[0, 0.28 * P.depth, P.thickness + 0.2]}>
					<planeGeometry args={[0.76 * P.length, 0.76 * P.length * LOGO_ASPECT]} />
					<meshBasicMaterial map={logo} transparent toneMapped={false} />
				</mesh>
			</Wall>
			<Wall geo={geo.length} position={[0.5 * cos * P.width, 0, -0.5 * sin * P.width]} rotationY={0} bottomSign={-1} material={material} topRef={blTop} />
		</group>
	);
}

// If WebGL can't initialise (or the 3D subtree throws), degrade gracefully to
// dealing the cards instead of crashing the whole page to a black screen.
class WebGLBoundary extends Component {
	state = { failed: false };
	static getDerivedStateFromError() {
		return { failed: true };
	}
	componentDidCatch() {
		this.props.onFail?.();
	}
	render() {
		return this.state.failed ? null : this.props.children;
	}
}

const BoosterBox3D = ({ onOpen, language }) => {
	const [opening, setOpening] = useState(false);
	const pointer = useRef({ x: 0, y: 0 });

	const handleClick = () => {
		if (opening) return;
		setOpening(true);
		setTimeout(() => onOpen(), 1500);
	};
	const onMove = (e) => {
		const r = e.currentTarget.getBoundingClientRect();
		pointer.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
		pointer.current.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
	};

	return (
		<motion.div
			className='box3d-wrap'
			role='button'
			tabIndex={0}
			aria-label={language === "es" ? "Abrir la caja" : "Open the box"}
			onClick={handleClick}
			onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
			onPointerMove={onMove}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.2 } }}
			transition={{ duration: 0.4 }}
		>
			<WebGLBoundary onFail={onOpen}>
				<Canvas dpr={[1, 1.5]} camera={{ position: [46, 26, 150], fov: 36, near: 5, far: 1000 }} gl={{ alpha: true, antialias: true }}>
					<ambientLight intensity={0.6} />
					<directionalLight position={[-30, 120, 60]} intensity={1.1} />
					<directionalLight position={[60, 10, 120]} intensity={0.8} color="#fff4e6" />
					<BoxGroup opening={opening} pointer={pointer} />
				</Canvas>
			</WebGLBoundary>
			<span className='box3d-hint'>{language === "es" ? "✦ Tocá para abrir ✦" : "✦ Click to open ✦"}</span>
		</motion.div>
	);
};

export default BoosterBox3D;
