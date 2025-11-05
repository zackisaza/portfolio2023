import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, AdaptiveDpr } from "@react-three/drei";

import CanvasLoader from "../Loader";
import { useCanvasBudget } from "../../context/CanvasBudgetContext";

const Computers = ({ isMobile, visible = true }) => {
	const computer = useGLTF("./desktop_pc/scene.gltf");
	const computerGroup = useRef();

	useFrame(({ clock }) => {
		if (!computerGroup.current) return;
		const elapsed = clock.getElapsedTime();
		const sway = 0.08 * Math.sin(elapsed * 0.6);

		// Animate appearance / exit: scale, slight rise and settling rotation
		const ease = 0.08;
		const targetScale = visible ? (isMobile ? 1.5 : 2.4) : 0.2;
		// animate scale
		computerGroup.current.scale.x += (targetScale - computerGroup.current.scale.x) * ease;
		computerGroup.current.scale.y += (targetScale - computerGroup.current.scale.y) * ease;
		computerGroup.current.scale.z += (targetScale - computerGroup.current.scale.z) * ease;

		// animate position.y (start lower and ease up; slide up when hiding)
		// when hiding, move the model upward off-screen
		const targetY = visible ? -2 : 4;
		computerGroup.current.position.y += (targetY - computerGroup.current.position.y) * ease;

		// animate rotation toward base + sway (or more tilted when hidden)
		const baseRotX = 0.02;
		const baseRotY = visible ? -0.2 + sway : -1.0;
		computerGroup.current.rotation.x += (baseRotX - computerGroup.current.rotation.x) * ease;
		computerGroup.current.rotation.y += (baseRotY - computerGroup.current.rotation.y) * ease;
		computerGroup.current.rotation.z += (0 - computerGroup.current.rotation.z) * ease;
	});

	return (
		<mesh>
			<hemisphereLight intensity={0.15} groundColor='black' />
			<pointLight intensity={0.1} />
			<spotLight
				position={[-10, 50, 10]}
				angle={0.12}
				penumbra={1}
				intensity={0.1}
				castShadow
				shadow-mapSize={512}
			/>

			<group
				ref={computerGroup}
				// start smaller, lower and slightly rotated so the entrance animation is visible
				scale={[isMobile ? 0.375 : 0.6, isMobile ? 0.375 : 0.6, isMobile ? 0.375 : 0.6]}
				position={isMobile ? [-0.1, -3, -1.5] : [1, -3, -1.5]}
				rotation={[0.02, -0.8, 0]}>
				<primitive object={computer.scene} />
			</group>
		</mesh>
	);
};

const ComputersCanvas = ({ active = true, sectionIndex = 0 }) => {
	const { suspendAboveOf, exclusiveSection } = useCanvasBudget();
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 820px)");

		setIsMobile(mediaQuery.matches);

		const handleMediaQueryChange = (event) => {
			setIsMobile(event.matches);
		};

		mediaQuery.addEventListener("change", handleMediaQueryChange);

		return () => {
			mediaQuery.removeEventListener("change", handleMediaQueryChange);
		};
	}, []);

	const suspendedByExclusive = exclusiveSection !== null && sectionIndex !== exclusiveSection;
	const suspendedByAbove = suspendAboveOf !== null && sectionIndex < suspendAboveOf;
	const suspended = suspendedByExclusive || suspendedByAbove;

	// Manage mount/visibility so we can animate exit before unmounting
	const [shouldRender, setShouldRender] = useState(!suspended && active);
	const [visibleLocal, setVisibleLocal] = useState(!suspended && active);

	// Keep a ref for timers to clean up
	const timeoutRef = useRef();

	useEffect(() => {
		// If we need to hide (suspended or inactive), animate out then unmount
		if (suspended || !active) {
			if (shouldRender) {
				setVisibleLocal(false);
				clearTimeout(timeoutRef.current);
				timeoutRef.current = setTimeout(() => setShouldRender(false), 600);
			}
			return;
		}

		// becoming active: mount immediately and then animate in
		if (!shouldRender) {
			setShouldRender(true);
			// small delay to let canvas mount before animating in
			clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => setVisibleLocal(true), 50);
		} else {
			setVisibleLocal(true);
		}

		return () => clearTimeout(timeoutRef.current);
	}, [suspended, active, shouldRender]);

	if (!shouldRender) {
		return <div className='w-full h-full bg-transparent' />;
	}

	return (
		<Canvas
			frameloop='always'
			shadows
			dpr={[1, 1.25]}
			camera={
				isMobile
					? { position: [0, 20, 5], fov: 26 }
					: { position: [9, 17, 5], fov: 26 }
			}
			gl={{ preserveDrawingBuffer: false, antialias: false, powerPreference: 'high-performance' }}>
			<Suspense fallback={<CanvasLoader />}>
				<OrbitControls
					enableZoom={false}
					maxPolarAngle={Math.PI / 2}
					minPolarAngle={Math.PI / 2}
				/>
				<Computers isMobile={isMobile} visible={visibleLocal} />
			</Suspense>
			<AdaptiveDpr pixelated />
			<Preload all />
		</Canvas>
	);
};

export default ComputersCanvas;
