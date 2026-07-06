import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload, AdaptiveDpr } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { MathUtils } from "three";
import { useCanvasBudget } from "../../context/CanvasBudgetContext";

const Stars = ({ visible = true, ...props }) => {
	const ref = useRef();
	const groupRef = useRef();
	const materialRef = useRef();
	// Fade-in / fade-out con opacidad del material
	const FADE_SPEED = 3; // mayor = más rápido
	const isSmall = typeof window !== 'undefined' && window.innerWidth < 640;
	const count = isSmall ? 1200 : 2800;
	const [sphere] = useState(() =>
		random.inSphere(new Float32Array(count), { radius: 1.2 })
	);

	useFrame((state, delta) => {
		if (ref.current) {
			ref.current.rotation.x -= delta / 10;
			ref.current.rotation.y -= delta / 15;
		}
		// Fade de opacidad hacia el objetivo según visibilidad
		if (materialRef.current) {
			const target = visible ? 1 : 0;
			const current = materialRef.current.opacity ?? 0;
			// Lerp amortiguado dependiente de delta
			const k = 1 - Math.pow(0.0001, delta * FADE_SPEED);
			materialRef.current.opacity = MathUtils.lerp(current, target, k);
		}
	});

	// Estado inicial
	useEffect(() => {
		if (groupRef.current) {
			groupRef.current.position.y = 0;
		}
		if (materialRef.current) {
			materialRef.current.opacity = 0; // empezar invisible; aparecerá si visible=true
		}
	}, []);

	return (
		<group ref={groupRef} rotation={[0, 0, Math.PI / 4]}>
			<Points
				ref={ref}
				positions={sphere}
				stride={3}
				frustumCulled
				{...props}>
				<PointMaterial
					ref={materialRef}
					transparent
					color='#f272c8'
					size={0.002}
					sizeAttenuation={true}
					depthWrite={false}
					opacity={0}
				/>
			</Points>
		</group>
	);
};

const StarsCanvas = ({ sectionIndex = 0 }) => {
	const { suspendAboveOf } = useCanvasBudget();
	// Do NOT suspend stars based on exclusiveSection anymore; keep them across sections
	const suspendedByExclusive = false;
	const suspendedByAbove = suspendAboveOf !== null && sectionIndex < suspendAboveOf;
	const suspended = suspendedByExclusive || suspendedByAbove;

	// Intersección del viewport y control de montaje/desmontaje
	const [isIntersecting, setIsIntersecting] = useState(false);
	const [visibleLocal, setVisibleLocal] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);
	const containerRef = useRef(null);
	const timeoutRef = useRef();
	const canvasElRef = useRef(null);
	const cleanupRef = useRef(null);

	useEffect(() => {
		return () => {
			if (cleanupRef.current) {
				try { cleanupRef.current(); } catch (e) {}
			}
		};
	}, []);

	useEffect(() => {
		const node = containerRef.current;
		if (!node) return undefined;
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsIntersecting(entry.isIntersecting);
			},
			{ root: null, rootMargin: "400px", threshold: 0.05 }
		);
		observer.observe(node);
		return () => observer.unobserve(node);
	}, []);

	useEffect(() => {
		// Si está suspendido globalmente, desmontar inmediatamente
		if (suspended) {
			setVisibleLocal(false);
			setShouldRender(false);
			return;
		}

		if (isIntersecting) {
			// Montar Canvas y activar visibilidad con un leve delay
			setShouldRender(true);
			clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => setVisibleLocal(true), 50);
		} else {
			// Ocultar (fade-out) y desmontar para liberar recursos
			setVisibleLocal(false);
			clearTimeout(timeoutRef.current);
			// Dar tiempo al fade-out antes de desmontar el Canvas
			timeoutRef.current = setTimeout(() => setShouldRender(false), 650);
		}

		return () => clearTimeout(timeoutRef.current);
	}, [isIntersecting, suspended]);

	return (
		<div ref={containerRef} className='w-full h-auto absolute inset-0 z-[-1] pointer-events-none'>
			{shouldRender ? (
				<Canvas
					camera={{ position: [0, 0, 1] }}
					dpr={[1, 1.15]}
					onCreated={(state) => {
						try {
							const renderer = state.gl;
							const canvas = renderer.domElement;
							canvasElRef.current = canvas;

							const onLost = (e) => {
								try { e.preventDefault(); } catch (err) {}
								console.warn('WebGL context lost (handled)');
							};

							const onRestore = () => {
								console.info('WebGL context restored');
							};

							canvas.addEventListener('webglcontextlost', onLost, false);
							canvas.addEventListener('webglcontextrestored', onRestore, false);

							cleanupRef.current = () => {
								try {
									canvas.removeEventListener('webglcontextlost', onLost);
									canvas.removeEventListener('webglcontextrestored', onRestore);
								} catch (err) {}
								try {
									if (renderer && typeof renderer.dispose === 'function') renderer.dispose();
								} catch (err) {}
							};
						} catch (err) {}
					}}
					gl={{ powerPreference: 'high-performance', antialias: false }}
				>
					<Suspense fallback={null}>
						<Stars visible={visibleLocal} />
					</Suspense>
					<AdaptiveDpr pixelated />
					<Preload all />
				</Canvas>
			) : null}
		</div>
	);
};

export default StarsCanvas;
