import React from "react";
import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({isMobile}) => {
	const computer = useGLTF("./desktop_pc/scene.gltf");

	return (
		<mesh>
			<hemisphereLight
				intensity={0.15}
				groundColor='black'
			/>
			<pointLight intensity={0.1} />
			<spotLight
				position={[-10, 50, 10]}
				angle={0.12}
				penumbra={1}
				intensity={0.1}
				castShadow
				shadow-mapSize={1024}
			/>

			<primitive
				object={computer.scene}
				scale={isMobile ? 1.5 : 2.4}
				position={isMobile ? [-0.1, -2, -1.5] : [1, -2, -1.5]}
				rotation={[0.02, -0.2, -0]}
			/>
		</mesh>
	);
};

const ComputersCanvas = () => {

	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia
			('(max-width: 820px)');

		setIsMobile(mediaQuery.matches);

		const handleMediaQueryChange = (event) => {
			setIsMobile(event.matches);
		}

		mediaQuery.addEventListener('change', handleMediaQueryChange);

		return () => {
			mediaQuery.removeEventListener('change', handleMediaQueryChange);
		};
	}, [])
	
	return (
		<Canvas
			frameloop='demand'
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
