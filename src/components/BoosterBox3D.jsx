import { Component, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { SRGBColorSpace } from "three";
import pokemonLogo from "../assets/pokemon/pokemon-logo.png";
import { useServicesGame } from "../context/ServicesGameContext";
// Kanto hero sprites that make up the printed cover art.
import sCharizard from "../assets/pokemon/kanto/006.png";
import sDragonite from "../assets/pokemon/kanto/149.png";
import sMewtwo from "../assets/pokemon/kanto/150.png";
import sGyarados from "../assets/pokemon/kanto/130.png";
import sPikachu from "../assets/pokemon/kanto/025.png";
import sMoltres from "../assets/pokemon/kanto/146.png";
import sArticuno from "../assets/pokemon/kanto/144.png";
import sVenusaur from "../assets/pokemon/kanto/003.png";
import sBlastoise from "../assets/pokemon/kanto/009.png";

// Faithful port of the folding-cardboard-box technique (uuuulala, MIT):
// four vertical walls (front/back × width/length) each with hinged top &
// bottom flaps built from corrugated 3-layer geometry. The box stays erected
// (openingAngle = 90°); clicking unfolds the top flaps to open it.
const mergeGeometries =
	BufferGeometryUtils.mergeGeometries || BufferGeometryUtils.mergeBufferGeometries;

// Chunky booster-BUNDLE box proportions (front 58 wide × 88 tall × 26 thick),
// closer to a real 6-pack bundle than a single slim pack.
const P = {
	width: 26, // front-to-back thickness (spine depth)
	length: 58, // front face width
	depth: 88, // vertical height
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

// ---------------------------------------------------------------------------
// Printed-face artwork — drawn to 2D canvases and wrapped as CanvasTextures so
// every wall of the box carries a real booster-bundle print (no image assets
// beyond the pixel sprites + the Pokémon logo).
// ---------------------------------------------------------------------------
const HERO_SRCS = [
	sCharizard, sDragonite, sMewtwo, sGyarados, sPikachu,
	sMoltres, sArticuno, sVenusaur, sBlastoise,
];

function makeCanvas(w, h) {
	const c = document.createElement("canvas");
	c.width = w;
	c.height = h;
	return c;
}
function rr(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
}
function halftone(ctx, W, H, color, step, radius, alpha) {
	ctx.save();
	ctx.globalAlpha = alpha;
	ctx.fillStyle = color;
	for (let y = 0; y < H; y += step) {
		for (let x = (Math.floor(y / step) % 2) * step * 0.5; x < W; x += step) {
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 6.283);
			ctx.fill();
		}
	}
	ctx.restore();
}
function rays(ctx, cx, cy, R, count, color, alpha) {
	ctx.save();
	ctx.globalAlpha = alpha;
	ctx.fillStyle = color;
	ctx.translate(cx, cy);
	for (let i = 0; i < count; i++) {
		ctx.rotate((Math.PI * 2) / count);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(R, -10);
		ctx.lineTo(R, 10);
		ctx.closePath();
		ctx.fill();
	}
	ctx.restore();
}
function swirl(ctx, x1, y1, cx, cy, x2, y2, color, width, alpha) {
	ctx.save();
	ctx.globalAlpha = alpha;
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.lineCap = "round";
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.quadraticCurveTo(cx, cy, x2, y2);
	ctx.stroke();
	ctx.restore();
}
// Pixel sprite, scaled up crisply with a soft drop shadow.
function drawSprite(ctx, img, cx, cy, scale, flip) {
	if (!img) return;
	const w = img.naturalWidth * scale;
	const h = img.naturalHeight * scale;
	ctx.save();
	ctx.imageSmoothingEnabled = false;
	ctx.translate(cx, cy);
	if (flip) ctx.scale(-1, 1);
	ctx.shadowColor = "rgba(0,0,0,0.45)";
	ctx.shadowBlur = 12;
	ctx.shadowOffsetY = 8;
	ctx.drawImage(img, -w / 2, -h / 2, w, h);
	ctx.restore();
}
// Heavy poster text with a rounded outline.
function poster(ctx, text, x, y, size, fill, stroke, sw, italic) {
	ctx.save();
	ctx.font = `900 ${italic ? "italic " : ""}${size}px "Arial Black", Impact, sans-serif`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.lineJoin = "round";
	ctx.lineWidth = sw;
	ctx.strokeStyle = stroke;
	ctx.strokeText(text, x, y);
	ctx.fillStyle = fill;
	ctx.fillText(text, x, y);
	ctx.restore();
}
function goldFill(ctx, y, size) {
	const g = ctx.createLinearGradient(0, y - size * 0.6, 0, y + size * 0.6);
	g.addColorStop(0, "#fff6c2");
	g.addColorStop(0.45, "#ffd24a");
	g.addColorStop(0.55, "#f6b41e");
	g.addColorStop(1, "#c47e0c");
	return g;
}
// The Pokémon TCG lockup: red logo + "TRADING CARD GAME" pill.
function drawLogo(ctx, logo, x, y, w) {
	const h = w * LOGO_ASPECT;
	if (logo) ctx.drawImage(logo, x, y, w, h);
	ctx.save();
	rr(ctx, x + w * 0.06, y + h * 0.92, w * 0.88, 34, 8);
	ctx.fillStyle = "#e2231a";
	ctx.fill();
	ctx.fillStyle = "#fff";
	ctx.font = '700 20px "Arial", sans-serif';
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.letterSpacing = "3px";
	ctx.fillText("TRADING CARD GAME", x + w * 0.5, y + h * 0.92 + 18);
	ctx.restore();
}
function ageBadge(ctx, cx, cy, r) {
	ctx.save();
	ctx.beginPath();
	ctx.arc(cx, cy, r, 0, 6.283);
	ctx.fillStyle = "rgba(20,16,34,0.82)";
	ctx.fill();
	ctx.lineWidth = 3;
	ctx.strokeStyle = "rgba(255,255,255,0.85)";
	ctx.stroke();
	ctx.fillStyle = "#fff";
	ctx.font = '800 30px "Arial", sans-serif';
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("6+", cx, cy + 1);
	ctx.restore();
}

function coverBackground(ctx, W, H) {
	const g = ctx.createLinearGradient(0, 0, W, H);
	g.addColorStop(0, "#4fd0dd");
	g.addColorStop(0.32, "#7bd3c0");
	g.addColorStop(0.5, "#e05aa2");
	g.addColorStop(0.72, "#c23a6b");
	g.addColorStop(1, "#211436");
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, W, H);
	rays(ctx, W * 0.4, H * 0.42, Math.max(W, H), 28, "#ffffff", 0.06);
	halftone(ctx, W, H, "#1c1030", 26, 3.4, 0.10);
	halftone(ctx, W, H, "#ffe07a", 40, 2.4, 0.07);
	// energy ribbons
	swirl(ctx, -20, H * 0.5, W * 0.5, H * 0.18, W + 20, H * 0.44, "#ffe680", 22, 0.35);
	swirl(ctx, -20, H * 0.62, W * 0.55, H * 0.9, W + 20, H * 0.56, "#7ef0ff", 18, 0.30);
	swirl(ctx, W * 0.1, H * 0.7, W * 0.5, H * 0.4, W * 0.95, H * 0.72, "#ff9ad2", 14, 0.28);
}

function drawFront(ctx, W, H, imgs, logo, lang) {
	coverBackground(ctx, W, H);
	// Hero roster — Charizard front and centre, legendaries fanned around it.
	const [char, drag, mew2, gya, pika, molt] = imgs;
	drawSprite(ctx, gya, W * 0.26, H * 0.34, 5.5, false);
	drawSprite(ctx, molt, W * 0.74, H * 0.30, 5.0, true);
	drawSprite(ctx, mew2, W * 0.68, H * 0.44, 6.2, false);
	drawSprite(ctx, drag, W * 0.34, H * 0.50, 7.4, false);
	drawSprite(ctx, pika, W * 0.5, H * 0.30, 4.6, false);
	drawSprite(ctx, char, W * 0.52, H * 0.52, 9.2, false);
	// Top lockup
	drawLogo(ctx, logo, W * 0.05, H * 0.03, W * 0.44);
	ageBadge(ctx, W * 0.9, H * 0.075, 40);
	// Set title
	poster(ctx, "KANTO", W * 0.5, H * 0.66, 44, "#ffffff", "#3a1550", 10);
	poster(ctx, "LEGENDS", W * 0.5, H * 0.735, 96, goldFill(ctx, H * 0.735, 96), "#3a1550", 14);
	// Booster-bundle ribbon
	ctx.save();
	rr(ctx, W * 0.16, H * 0.79, W * 0.68, 58, 12);
	ctx.fillStyle = "#e0338c";
	ctx.fill();
	ctx.strokeStyle = "rgba(255,255,255,0.7)";
	ctx.lineWidth = 2;
	ctx.stroke();
	poster(ctx, "BOOSTER BUNDLE", W * 0.5, H * 0.79 + 30, 34, "#ffffff", "#7a1650", 5);
	ctx.restore();
	// Bottom black bar
	ctx.fillStyle = "#0d0b16";
	ctx.fillRect(0, H * 0.9, W, H * 0.1);
	ctx.save();
	ctx.beginPath();
	ctx.arc(W * 0.28, H * 0.95, 22, 0, 6.283);
	ctx.strokeStyle = "#fff";
	ctx.lineWidth = 3;
	ctx.stroke();
	ctx.fillStyle = "#fff";
	ctx.font = '800 26px "Arial", sans-serif';
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("6", W * 0.28, H * 0.95 + 1);
	ctx.textAlign = "left";
	ctx.font = '800 24px "Arial", sans-serif';
	const inc = lang === "es" ? "INCLUYE     SOBRES" : "INCLUDES     BOOSTER PACKS";
	ctx.fillText(inc, W * 0.34, H * 0.95 + 1);
	ctx.restore();
}

function drawBack(ctx, W, H, imgs, logo, lang) {
	coverBackground(ctx, W, H);
	ctx.fillStyle = "rgba(10,8,20,0.35)";
	ctx.fillRect(0, 0, W, H);
	drawLogo(ctx, logo, W * 0.28, H * 0.03, W * 0.44);
	poster(ctx, lang === "es" ? "¡COLECCIONA LAS 6!" : "COLLECT ALL 6!", W * 0.5, H * 0.2, 40, goldFill(ctx, H * 0.2, 40), "#3a1550", 9);
	// six mini card slots with a sprite each
	const cols = 3, cw = W * 0.24, ch = H * 0.19, gx = W * 0.05, gy = H * 0.06;
	const totalW = cols * cw + (cols - 1) * gx;
	const startX = (W - totalW) / 2;
	const startY = H * 0.28;
	for (let i = 0; i < 6; i++) {
		const cx = startX + (i % cols) * (cw + gx);
		const cy = startY + Math.floor(i / cols) * (ch + gy);
		const grad = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
		grad.addColorStop(0, "#ffe9a8");
		grad.addColorStop(1, "#e59bd0");
		ctx.save();
		rr(ctx, cx, cy, cw, ch, 12);
		ctx.fillStyle = grad;
		ctx.fill();
		ctx.lineWidth = 4;
		ctx.strokeStyle = "#f6d266";
		ctx.stroke();
		ctx.restore();
		drawSprite(ctx, imgs[i], cx + cw / 2, cy + ch / 2, Math.min(cw, ch) / 34, false);
	}
	// fake barcode + legal
	ctx.save();
	ctx.fillStyle = "#fff";
	rr(ctx, W * 0.62, H * 0.86, W * 0.3, H * 0.09, 8);
	ctx.fill();
	ctx.fillStyle = "#000";
	let bx = W * 0.64;
	for (let i = 0; i < 42; i++) {
		const bw = 1 + ((i * 7) % 4);
		ctx.fillRect(bx, H * 0.875, bw, H * 0.05);
		bx += bw + 2 + ((i * 3) % 3);
	}
	ctx.restore();
	ctx.save();
	ctx.fillStyle = "rgba(255,255,255,0.85)";
	ctx.font = '500 18px "Arial", sans-serif';
	ctx.textAlign = "left";
	ctx.fillText("©2025 Portfolio · Kanto Edition", W * 0.06, H * 0.9);
	ctx.fillText(lang === "es" ? "Edición coleccionista" : "Collector edition", W * 0.06, H * 0.925);
	ctx.restore();
}

function drawSpine(ctx, W, H, logo) {
	const g = ctx.createLinearGradient(0, 0, 0, H);
	g.addColorStop(0, "#2a1440");
	g.addColorStop(0.5, "#3a1c55");
	g.addColorStop(1, "#160b26");
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, W, H);
	halftone(ctx, W, H, "#ffffff", 30, 2, 0.05);
	if (logo) {
		const lw = W * 0.78;
		ctx.drawImage(logo, (W - lw) / 2, H * 0.02, lw, lw * LOGO_ASPECT);
	}
	// energy-type dots down the spine
	const cols = ["#f0a500", "#4d90fe", "#e0338c", "#8bd450", "#7ef0ff"];
	for (let i = 0; i < 5; i++) {
		ctx.beginPath();
		ctx.arc(W * 0.5, H * (0.16 + i * 0.03), 9, 0, 6.283);
		ctx.fillStyle = cols[i];
		ctx.fill();
	}
	// repeated vertical "BOOSTER BUNDLE"
	ctx.save();
	ctx.translate(W * 0.5, H * 0.62);
	ctx.rotate(-HALF_PI);
	poster(ctx, "BOOSTER  BUNDLE", 0, 0, 30, "#ffd24a", "#160b26", 5);
	ctx.restore();
	ctx.save();
	ctx.translate(W * 0.5, H * 0.9);
	ctx.rotate(-HALF_PI);
	ctx.fillStyle = "rgba(255,255,255,0.7)";
	ctx.font = '700 18px "Arial", sans-serif';
	ctx.textAlign = "center";
	ctx.fillText("KANTO LEGENDS", 0, 0);
	ctx.restore();
}

function drawPokeball(ctx, cx, cy, r) {
	ctx.save();
	ctx.beginPath();
	ctx.arc(cx, cy, r, 0, 6.283);
	ctx.fillStyle = "#e63b3b";
	ctx.fill();
	ctx.beginPath();
	ctx.arc(cx, cy, r, 0, Math.PI);
	ctx.fillStyle = "#f4f4f4";
	ctx.fill();
	ctx.fillStyle = "#161616";
	ctx.fillRect(cx - r, cy - r * 0.16, r * 2, r * 0.32);
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.34, 0, 6.283);
	ctx.fillStyle = "#161616";
	ctx.fill();
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.2, 0, 6.283);
	ctx.fillStyle = "#f4f4f4";
	ctx.fill();
	ctx.restore();
}
// Decorated brand band for the top & bottom caps (folded flaps). Tiles
// horizontally so it reads cleanly across the four flaps.
function drawCap(ctx, W, H) {
	const g = ctx.createLinearGradient(0, 0, 0, H);
	g.addColorStop(0, "#3a1c55");
	g.addColorStop(0.5, "#241338");
	g.addColorStop(1, "#160b26");
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, W, H);
	halftone(ctx, W, H, "#ffffff", 22, 1.6, 0.05);
	ctx.fillStyle = "#e6b53c";
	ctx.fillRect(0, H * 0.12, W, 3);
	ctx.fillRect(0, H * 0.85, W, 3);
	const n = 4;
	for (let i = 0; i < n; i++) drawPokeball(ctx, (i + 0.5) * (W / n), H * 0.5, H * 0.24);
}

function useBoxTextures(language) {
	const store = useMemo(() => {
		const front = makeCanvas(720, 1040);
		const back = makeCanvas(720, 1040);
		const spine = makeCanvas(320, 1040);
		const cap = makeCanvas(512, 128);
		const mk = (cv) => {
			const t = new THREE.CanvasTexture(cv);
			t.colorSpace = SRGBColorSpace;
			t.anisotropy = 8;
			return t;
		};
		const texCap = mk(cap);
		texCap.wrapS = THREE.RepeatWrapping;
		texCap.repeat.x = 3;
		// Cap art is image-free, draw it up front.
		drawCap(cap.getContext("2d"), 512, 128);
		texCap.needsUpdate = true;
		return { front, back, spine, cap, texFront: mk(front), texBack: mk(back), texSpine: mk(spine), texCap };
	}, []);

	useEffect(() => {
		let alive = true;
		const load = (src) =>
			new Promise((res) => {
				const im = new Image();
				im.onload = () => res(im);
				im.onerror = () => res(null);
				im.src = src;
			});
		const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
		Promise.all([load(pokemonLogo), Promise.all(HERO_SRCS.map(load)), fonts]).then(([logo, imgs]) => {
			if (!alive) return;
			drawFront(store.front.getContext("2d"), 720, 1040, imgs, logo, language);
			drawBack(store.back.getContext("2d"), 720, 1040, imgs, logo, language);
			drawSpine(store.spine.getContext("2d"), 320, 1040, logo);
			store.texFront.needsUpdate = true;
			store.texBack.needsUpdate = true;
			store.texSpine.needsUpdate = true;
		});
		return () => {
			alive = false;
		};
	}, [store, language]);

	return store;
}

// One wall + its two flaps. topRef exposes the top flap so it can be animated.
function Wall({ geo, position, rotationY, bottomSign, faceMaterial, flapMaterial, topRef }) {
	return (
		<mesh geometry={geo.side} material={faceMaterial} position={position} rotation={[0, rotationY, 0]}>
			<mesh ref={topRef} geometry={geo.top} material={flapMaterial} position={[0, 0.5 * P.depth, 0]} />
			<mesh geometry={geo.bottom} material={flapMaterial} position={[0, -0.5 * P.depth, 0]} rotation={[bottomSign * HALF_PI, 0, 0]} />
		</mesh>
	);
}

function BoxGroup({ opening, exiting, ctrl, language }) {
	const geo = useMemo(buildPanels, []);
	const { texFront, texBack, texSpine, texCap } = useBoxTextures(language);

	const frontMat = useMemo(() => new THREE.MeshStandardMaterial({ map: texFront, roughness: 0.55, metalness: 0.06, side: THREE.DoubleSide }), [texFront]);
	const backMat = useMemo(() => new THREE.MeshStandardMaterial({ map: texBack, roughness: 0.55, metalness: 0.06, side: THREE.DoubleSide }), [texBack]);
	const spineMat = useMemo(() => new THREE.MeshStandardMaterial({ map: texSpine, roughness: 0.6, metalness: 0.05, side: THREE.DoubleSide }), [texSpine]);
	const flapMat = useMemo(() => new THREE.MeshStandardMaterial({ map: texCap, roughness: 0.8, metalness: 0.04, side: THREE.DoubleSide }), [texCap]);

	const group = useRef();
	const p = useRef(0); // 0 closed → 1 open (flaps)
	const q = useRef(0); // 0 present → 1 receded away (exit)
	const baseX = useRef(-0.12), baseY = useRef(0.15); // smoothed drag orientation
	const fwTop = useRef(), bwTop = useRef(), flTop = useRef(), blTop = useRef();

	useFrame((state, dt) => {
		p.current += ((opening ? 1 : 0) - p.current) * Math.min(1, dt * 3);
		q.current += ((exiting ? 1 : 0) - q.current) * Math.min(1, dt * 2.8);
		// top flap angle: closed = 90° (sealed), open = slightly splayed out
		const a = HALF_PI + (-0.12 * Math.PI - HALF_PI) * p.current;
		// All four walls are oriented outward, so every top flap folds inward
		// with the same sign: sealed flat at a=90°, splayed open as p→1.
		if (fwTop.current) fwTop.current.rotation.x = -a;
		if (flTop.current) flTop.current.rotation.x = -a;
		if (bwTop.current) bwTop.current.rotation.x = -a;
		if (blTop.current) blTop.current.rotation.x = -a;

		const t = state.clock.elapsedTime;
		const g = group.current;
		if (!g) return;
		const k = Math.min(1, dt * 8);
		// Base orientation is driven only by click-drag, smoothed toward target.
		baseY.current += (ctrl.current.rotY - baseY.current) * k;
		baseX.current += (ctrl.current.rotX - baseX.current) * k;
		const e = q.current; // exit progress 0→1
		const ez = e * e; // ease-in → a "whoosh" as it rushes back
		const ampY = 0.55, ampX = 0.2, w = 0.95;
		// Dynamic exit: a tiny wind-up, tip the open mouth forward, spin + tumble
		// away and rush backwards while shrinking. Kept contained so the box never
		// balloons up out of the canvas.
		const anticip = 1 + 0.07 * Math.sin(Math.min(1, e * 3.5) * Math.PI);
		g.rotation.y = baseY.current + Math.sin(t * w) * ampY * (1 - e) + e * Math.PI * 2.4;
		g.rotation.x = baseX.current + Math.cos(t * w) * ampX * (1 - e) + e * 1.0;
		g.rotation.z = Math.sin(e * Math.PI * 1.5) * 0.4; // slight tumble roll
		g.position.z = -ez * 250;
		g.position.y = Math.sin(t * 0.8) * 1.0 + p.current * 6 + Math.sin(e * Math.PI) * 14;
		// Base size 1.3×; hover grows a touch; exit shrinks it away to nothing.
		const BASE_SCALE = 1.3;
		const targetScale = BASE_SCALE * (ctrl.current.hovered ? 1.08 : 1) * anticip * (1 - 0.99 * ez);
		const s = g.scale.x + (targetScale - g.scale.x) * k;
		g.scale.set(s, s, s);
	});

	return (
		<group ref={group} scale={1.3}>
			{/* spine walls (short sides) */}
			<Wall geo={geo.width} position={[0.5 * P.length, 0, 0]} rotationY={HALF_PI} bottomSign={1} faceMaterial={spineMat} flapMaterial={flapMat} topRef={fwTop} />
			<Wall geo={geo.width} position={[-0.5 * P.length, 0, 0]} rotationY={-HALF_PI} bottomSign={1} faceMaterial={spineMat} flapMaterial={flapMat} topRef={bwTop} />
			{/* front & back walls (long sides) */}
			<Wall geo={geo.length} position={[0, 0, 0.5 * P.width]} rotationY={0} bottomSign={1} faceMaterial={frontMat} flapMaterial={flapMat} topRef={flTop} />
			<Wall geo={geo.length} position={[0, 0, -0.5 * P.width]} rotationY={Math.PI} bottomSign={1} faceMaterial={backMat} flapMaterial={flapMat} topRef={blTop} />
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
	const [exiting, setExiting] = useState(false);
	// Interaction state shared with the R3F frame loop.
	const ctrl = useRef({ down: false, moved: false, lastX: 0, lastY: 0, rotX: -0.12, rotY: 0.15, hovered: false });

	// Gate the R3F render loop to the viewport: when the box is scrolled away we
	// switch frameloop to "never" so it stops rendering entirely (zero GPU cost).
	const wrapRef = useRef(null);
	const [active, setActive] = useState(false);
	useEffect(() => {
		const el = wrapRef.current;
		if (!el) return undefined;
		const io = new IntersectionObserver(
			([entry]) => setActive(entry.isIntersecting),
			{ rootMargin: "200px 0px" }
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

	const handleClick = () => {
		if (opening) return;
		setOpening(true);
		// The flaps splay open WHILE the box tips forward, spins and recedes (both
		// start together); once it has shrunk away the cards spring out.
		setTimeout(() => setExiting(true), 150);
		setTimeout(() => onOpen(), 1000);
	};

	// Expose the open trigger so the Game Boy "A" button can fire it too.
	const game = useServicesGame();
	const handleClickRef = useRef(handleClick);
	handleClickRef.current = handleClick;
	useEffect(() => {
		game?.registerBoxTrigger(() => handleClickRef.current());
	}, [game]);

	const onPointerDown = (e) => {
		e.currentTarget.setPointerCapture?.(e.pointerId);
		const c = ctrl.current;
		c.down = true;
		c.moved = false;
		c.lastX = e.clientX;
		c.lastY = e.clientY;
	};
	const onPointerMove = (e) => {
		const c = ctrl.current;
		if (!c.down) return;
		const dx = e.clientX - c.lastX;
		const dy = e.clientY - c.lastY;
		c.lastX = e.clientX;
		c.lastY = e.clientY;
		c.rotY += dx * 0.009;
		c.rotX = Math.max(-0.6, Math.min(0.6, c.rotX + dy * 0.009));
		if (Math.abs(dx) + Math.abs(dy) > 3) c.moved = true; // it's a drag, not a click
	};
	const onPointerUp = () => {
		const c = ctrl.current;
		if (c.down && !c.moved) handleClick(); // released without dragging → open
		c.down = false;
	};
	const onPointerEnter = () => { ctrl.current.hovered = true; };
	const onPointerLeave = () => { ctrl.current.hovered = false; ctrl.current.down = false; };

	return (
		<motion.div
			ref={wrapRef}
			className='box3d-wrap'
			role='button'
			tabIndex={0}
			aria-label={language === "es" ? "Abrir la caja" : "Open the box"}
			onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			onPointerEnter={onPointerEnter}
			onPointerLeave={onPointerLeave}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0, transition: { duration: 0.4 } }}
			transition={{ duration: 0.4 }}
		>
			<WebGLBoundary onFail={onOpen}>
				<Canvas frameloop={active ? "always" : "never"} dpr={[1, 1.75]} camera={{ position: [30, 16, 340], fov: 36, near: 5, far: 1000 }} gl={{ alpha: true, antialias: true }}>
					<ambientLight intensity={0.75} />
					<directionalLight position={[-30, 120, 60]} intensity={1.05} />
					<directionalLight position={[60, 10, 120]} intensity={0.85} color="#fff4e6" />
					<BoxGroup opening={opening} exiting={exiting} ctrl={ctrl} language={language} />
				</Canvas>
			</WebGLBoundary>
		</motion.div>
	);
};

export default BoosterBox3D;
