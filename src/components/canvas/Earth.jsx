import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, AdaptiveDpr, Float } from '@react-three/drei';
import { Vector3 } from 'three';
import CanvasLoader from '../Loader'
import { useCanvasBudget } from "../../context/CanvasBudgetContext";

const Earth = ({ visible = true }) => {

	const earth = useGLTF('./planet/scene.gltf')
	const groupRef = useRef(null);
	// entrance/exit animation multiplier (starts small, eases to 1)
	const entranceScale = useRef(0.25);
	const neutralPosition = useRef(new Vector3(0, 0, 0));
	const baseScale = 2.5;

	useFrame(({ clock }) => {
		const group = groupRef.current;
		if (!group) return;
		// entrance/exit target
		const targetEntrance = visible ? 1 : 0.05;
		// entrance scale easing
		const easeIn = 0.08;
		entranceScale.current += (targetEntrance - entranceScale.current) * easeIn;

		// apply scale and a very slow rotation for subtle motion
		group.scale.setScalar(baseScale * entranceScale.current);
		const t = clock.getElapsedTime();
		group.rotation.y = t * 0.12; // slow spin
			// ease position Y from -1 up to 0 when visible (so it visibly rises on entrance)
			const targetY = visible ? 0 : -1.0;
			group.position.y += (targetY - group.position.y) * 0.12;
	});

	useEffect(() => {
		if (groupRef.current) {
			// start lower so entrance animation is visible
			groupRef.current.position.copy(neutralPosition.current).add(new Vector3(0, -1.0, 0));
			groupRef.current.scale.setScalar(baseScale * entranceScale.current);
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
					gl={{ preserveDrawingBuffer: false, antialias: false, powerPreference: 'high-performance' }}
					camera={{
						fov: 45,
						near: 0.1,
						far: 200,
						position: [-4,3,6]
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