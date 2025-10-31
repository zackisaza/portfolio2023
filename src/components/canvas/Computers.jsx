import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
	const computer = useGLTF("./desktop_pc/scene.gltf");
	const computerGroup = useRef();

	useFrame(({ clock }) => {
		if (!computerGroup.current) return;
		const elapsed = clock.getElapsedTime();
		const sway = 0.08 * Math.sin(elapsed * 0.6);

		computerGroup.current.rotation.x = 0.02;
		computerGroup.current.rotation.y = -0.2 + sway;
		computerGroup.current.rotation.z = 0;
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
				shadow-mapSize={1024}
			/>

			<group
				ref={computerGroup}
				scale={isMobile ? 1.5 : 2.4}
				position={isMobile ? [-0.1, -2, -1.5] : [1, -2, -1.5]}
				rotation={[0.02, -0.2, 0]}>
				<primitive object={computer.scene} />
			</group>
		</mesh>
	);
};

const ComputersCanvas = ({ active = true }) => {
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

	if (!active) {
		return <div className='w-full h-full bg-transparent' />;
	}

	return (
		<Canvas
			frameloop='always'
			shadows
			camera={
				isMobile
					? { position: [0, 20, 5], fov: 26 }
					: { position: [9, 17, 5], fov: 26 }
			}
			gl={{ preserveDrawingBuffer: true }}>
			<Suspense fallback={<CanvasLoader />}>
				<OrbitControls
					enableZoom={false}
					maxPolarAngle={Math.PI / 2}
					minPolarAngle={Math.PI / 2}
				/>
				<Computers isMobile={isMobile} />
			</Suspense>
			<Preload all />
		</Canvas>
	);
};

export default ComputersCanvas;
