import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload, AdaptiveDpr } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { MathUtils } from "three";

const Stars = ({ visible = true, ...props }) => {
	const ref = useRef();
	const groupRef = useRef();
	const materialRef = useRef();
	// Fade in/out driven by the material's opacity.
	const FADE_SPEED = 3; // higher = faster
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
		// Ease the opacity toward its target based on visibility.
		if (materialRef.current) {
			const target = visible ? 1 : 0;
			const current = materialRef.current.opacity ?? 0;
			// Delta-dependent damped lerp (frame-rate independent).
			const k = 1 - Math.pow(0.0001, delta * FADE_SPEED);
			materialRef.current.opacity = MathUtils.lerp(current, target, k);
		}
	});

	// Initial state.
	useEffect(() => {
		if (groupRef.current) {
			groupRef.current.position.y = 0;
		}
		if (materialRef.current) {
			materialRef.current.opacity = 0; // start invisible; fades in when visible=true
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

const StarsCanvas = () => {
	// Viewport intersection + mount/unmount control.
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
				try { cleanupRef.current(); } catch (e) { /* non-critical: ignore */ }
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
		if (isIntersecting) {
			// Mount the Canvas and turn visibility on after a slight delay.
			setShouldRender(true);
			clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => setVisibleLocal(true), 50);
		} else {
			// Fade out, then unmount to release GPU resources.
			setVisibleLocal(false);
			clearTimeout(timeoutRef.current);
			// Give the fade-out time to finish before unmounting the Canvas.
			timeoutRef.current = setTimeout(() => setShouldRender(false), 650);
		}

		return () => clearTimeout(timeoutRef.current);
	}, [isIntersecting]);

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
								try { e.preventDefault(); } catch (err) { /* non-critical: ignore */ }
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
								} catch (err) { /* non-critical: ignore */ }
								try {
									if (renderer && typeof renderer.dispose === 'function') renderer.dispose();
								} catch (err) { /* non-critical: ignore */ }
							};
						} catch (err) { /* non-critical: ignore */ }
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
