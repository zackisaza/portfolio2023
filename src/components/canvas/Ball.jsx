import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { Decal, Float, OrbitControls, Preload, useTexture } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Ball = ({ imgUrl }) => {
	const [iconTexture] = useTexture([imgUrl]);
	const ballRef = useRef(null);
	const bounceStart = useRef(null);
	const clock = useThree((state) => state.clock);
	const neutralPosition = useRef(new Vector3(0, -0.18, 0));
	const targetPosition = useRef(new Vector3());
	const bounceDuration = 0.9;
	const bounceAmplitude = 0.55;
	const orbitOffset = useRef(new Vector3());
	const baseScale = 4.4;

	const triggerBounce = () => {
		const now = clock.getElapsedTime();
		if (
			bounceStart.current !== null &&
			now - bounceStart.current < bounceDuration * 0.6
		) {
			return;
		}
		bounceStart.current = now;
	};

	useFrame(({ clock }) => {
		const ball = ballRef.current;
		if (!ball) return;

        const time = clock.getElapsedTime();
        const orbitX = Math.sin(time * 0.65) * 0.25;
        const orbitY = Math.cos(time * 0.78) * 0.14;
        orbitOffset.current.set(orbitX, orbitY, 0);

        const wobble = Math.sin(time * 1.2) * 0.02;
        const spin = Math.cos(time * 1.1) * 0.015;
        const scalePulse = 1 + Math.sin(time * 2.4) * 0.05;
        ball.rotation.set(wobble, spin, wobble * 0.8);
        ball.scale.setScalar(baseScale * scalePulse);

		const neutral = neutralPosition.current;
		const target = targetPosition.current;

		if (bounceStart.current === null) {
			target.copy(neutral).add(orbitOffset.current);
			ball.position.lerp(target, 0.2);
			return;
		}

		const elapsed = time - bounceStart.current;

		if (elapsed >= bounceDuration) {
			bounceStart.current = null;
			return;
		}

		const progress = elapsed / bounceDuration;
		const bounce = Math.sin(progress * Math.PI);
		const damping = 1 - progress * 0.55;

		const height = bounce * bounceAmplitude * damping;
		const forward = bounce * 0.22 * damping;
		const lateral = Math.sin(progress * Math.PI) * 0.08 * damping;

		target
			.set(
				neutral.x + lateral,
				neutral.y + height,
				neutral.z + forward
			)
			.add(orbitOffset.current);

		ball.position.lerp(target, 0.4);
	});

	useEffect(() => {
		if (ballRef.current) {
			ballRef.current.position.copy(neutralPosition.current);
			ballRef.current.scale.setScalar(baseScale);
		}
	}, []);

	return (
		<Float
			speed={1.75}
			rotationIntensity={0}
			floatIntensity={0.12}
			floatingRange={[0, 0.05]}>
		<group
			ref={ballRef}
			onPointerOver={triggerBounce}
			onPointerDown={triggerBounce}>
				<mesh
					castShadow
					receiveShadow>
					<icosahedronGeometry args={[1, 1]} />
					<meshStandardMaterial
						color='#f8f5ee'
						metalness={0.25}
						roughness={0.6}
						polygonOffset
						polygonOffsetFactor={-4}
						flatShading
					/>
					<Decal
						position={[0, 0, 1]}
						rotation={[2 * Math.PI, 0, 7.25]}
						scale={1}
						map={iconTexture}
						flatShading
					/>
				</mesh>
			</group>
		</Float>
	);
};

const BallCanvas = ({ icon }) => {
	return (
        <Canvas
            shadows={false}
            frameloop='always'
            dpr={[1, 1.5]}
			camera={{ position: [0, 0, 12], fov: 45 }}
			gl={{ preserveDrawingBuffer: false, alpha: true }}
			style={{ width: "100%", height: "100%", background: "transparent" }}>
			<Suspense fallback={<CanvasLoader />}>
				<ambientLight intensity={0.35} />
				<hemisphereLight skyColor='#ffffff' groundColor='#1a1a1a' intensity={0.55} />
				<directionalLight position={[4, 6, 5]} intensity={1.2} />
				<pointLight position={[-3, 3, 2]} intensity={0.45} />
				<OrbitControls enableZoom={false} enablePan={false} />
				<Ball imgUrl={icon} />
			</Suspense>
			<Preload all />
		</Canvas>
	);
};

export default BallCanvas;
