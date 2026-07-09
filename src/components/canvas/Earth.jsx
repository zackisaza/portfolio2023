import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, AdaptiveDpr, Float } from '@react-three/drei';
import CanvasLoader from '../Loader'
import { useCanvasBudget } from "../../context/CanvasBudgetContext";

const Earth = ({ visible = true }) => {

	const earth = useGLTF('./planet/scene.gltf')
	const groupRef = useRef(null);
	const baseScale = 3.4;
	// Centered. The planet fits fully thanks to the pulled-back camera below.
	const posY = -0.7;

	useFrame(({ clock }) => {
		const group = groupRef.current;
		if (!group) return;
		// No entrance animation: the planet is always at full scale and a fixed
		// position. Only ambient motion below (slow spin + Float bobbing).
		group.scale.setScalar(baseScale);
		group.position.y = posY;
		const t = clock.getElapsedTime();
		group.rotation.y = t * 0.12; // slow ambient spin
	});

	useEffect(() => {
		if (groupRef.current) {
			groupRef.current.position.set(0, posY, 0);
			groupRef.current.scale.setScalar(baseScale);
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
const EarthCanvas = ({ sectionIndex = 6 }) => {
	const [isVisible, setIsVisible] = useState(false);
	const canvasRef = useRef(null);
	const canvasElRef = useRef(null);
	const cleanupRef = useRef(null);
	const { suspendAboveOf, exclusiveSection } = useCanvasBudget();
	const suspendedByExclusive = exclusiveSection !== null && sectionIndex !== exclusiveSection;
	const suspendedByAbove = suspendAboveOf !== null && sectionIndex < suspendAboveOf;
	const suspended = suspendedByExclusive || suspendedByAbove;

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting);
			},
			{ threshold: 0.1 }
		);

		if (canvasRef.current) {
			observer.observe(canvasRef.current);
		}

		return () => {
			if (canvasRef.current) {
				observer.unobserve(canvasRef.current);
			}
			if (cleanupRef.current) {
				try { cleanupRef.current(); } catch (e) {}
			}
		};
	}, []);

	if (suspended) {
		return <div style={{ width: '100%', height: '100%' }} />
	}

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