import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, AdaptiveDpr, Float } from '@react-three/drei';
import CanvasLoader from '../Loader'

// Fixed placement + entrance timing (module scope so they aren't React deps).
const baseScale = 2.72; // 20% smaller than the original 3.4
const posY = -0.7; // centered; fits fully thanks to the pulled-back camera
const GROW_DURATION = 1.1; // seconds — entrance grow-in duration

const Earth = ({ visible = true }) => {
	const earth = useGLTF('./planet/scene.gltf')
	const groupRef = useRef(null);
	// Entrance grow-in: captured on the first rendered frame so the planet scales
	// up from nothing regardless of when the canvas mounts into view.
	const startRef = useRef(null);

	useFrame(({ clock }) => {
		const group = groupRef.current;
		if (!group) return;
		const t = clock.getElapsedTime();
		if (startRef.current === null) startRef.current = t;
		// Ease-out grow from 0 → full scale as the planet appears.
		const p = Math.min(1, (t - startRef.current) / GROW_DURATION);
		const eased = 1 - Math.pow(1 - p, 3);
		group.scale.setScalar(baseScale * eased);
		group.position.y = posY;
		group.rotation.y = t * 0.12; // slow ambient spin
	});

	useEffect(() => {
		if (groupRef.current) {
			groupRef.current.position.set(0, posY, 0);
			// Start collapsed so the grow-in animation has somewhere to grow from.
			groupRef.current.scale.setScalar(0);
		}
	}, []);

	return (
		<Float
			speed={1.25}
			rotationIntensity={0.1}
			floatIntensity={0.12}
			floatingRange={[0, 0.05]}
		>
			<group ref={groupRef}>
				<primitive object={earth.scene} position={[0, 0, 0]} rotation-y={0} />
			</group>
		</Float>
	);
}
const EarthCanvas = () => {
	const [isVisible, setIsVisible] = useState(false);
	const canvasRef = useRef(null);
	const canvasElRef = useRef(null);
	const cleanupRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting);
			},
			{ threshold: 0.1 }
		);

		const node = canvasRef.current;
		if (node) {
			observer.observe(node);
		}

		return () => {
			if (node) {
				observer.unobserve(node);
			}
			if (cleanupRef.current) {
				try { cleanupRef.current(); } catch (e) { /* non-critical: ignore */ }
			}
		};
	}, []);

	return (
		<div ref={canvasRef} style={{ width: '100%', height: '100%' }}>
			{isVisible && (
				<Canvas
					shadows
					frameloop='demand'
					dpr={[1, 1.25]}
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
					gl={{ preserveDrawingBuffer: false, antialias: false, powerPreference: 'high-performance' }}
					camera={{
						fov: 45,
						near: 0.1,
						far: 200,
						position: [-5, 3.75, 7.5]
					}}>
					<Suspense fallback={<CanvasLoader />}>
						<OrbitControls
							autoRotate
							enableZoom={false}
							maxPolarAngle={Math.PI / 2}
							minPolarAngle={Math.PI / 2}
						/>
						<Earth visible={isVisible} />
					</Suspense>
					<AdaptiveDpr pixelated />
				</Canvas>
			)}
		</div>
	);
}

export default EarthCanvas;