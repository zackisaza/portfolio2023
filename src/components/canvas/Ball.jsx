import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { Decal, Float, Preload, useTexture } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Ball = ({
	imgUrl,
	externalDeltaRef = null,
	decalRotation = [2 * Math.PI, 0, 7.25],
	decalScale = 1,
	geometry = "ico", // "ico" | "box"
	decalPosition,
	icoDetail = 1,
	baseColor = '#f8f5ee',
	metalness = 0.25,
	roughness = 0.6,
	// New props to control decal emissive appearance
	emissiveColor = '#ffffff',
	emissiveMultiplier = 1,
		visible = true,
	}) => {
	const [iconTexture] = useTexture([imgUrl]);
	const ballRef = useRef(null);
	// entrance/exit animation multiplier (starts small, eases to 1; eases to small when hidden)
	const entranceScale = useRef(0.25);
	const decalRef = useRef(null);
	const bounceStart = useRef(null);
	const clock = useThree((state) => state.clock);
	const neutralPosition = useRef(new Vector3(0, -0.18, 0));
	const targetPosition = useRef(new Vector3());
	const bounceDuration = 0.9;
	const bounceAmplitude = 0.55;
	const orbitOffset = useRef(new Vector3());
	const baseScale = 4;
    // Smooth scales to fade idle orbit/wobble when pointer leaves
    const orbitScale = useRef(1);
    const wobbleScale = useRef(1);
	// Delay-return control
	const leaveTimeRef = useRef(null); // performance.now() when pointer leaves
	const hasReturnedRef = useRef(false);
    // Slow return animation state
    const returnAnim = useRef({ active: false, start: 0, duration: 1.8, from: { x: 0, y: 0 } });
    // Pointer-driven spin state (like a marble)
	const spinVel = useRef({ x: 0, y: 0 }); // angular velocity for x/y axes
	const addRot = useRef({ x: 0, y: 0 }); // accumulated additional rotation
	const pointerActive = useRef(false);
	const lastPos = useRef({ x: 0, y: 0 }); // last clientX/Y as fallback when movementX/Y are 0
	const lastExternalT = useRef(0);

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

		// entrance/exit target
		const targetEntrance = visible ? 1 : 0.05;
		// entrance scale easing
		const easeIn = 0.08;
		entranceScale.current += (targetEntrance - entranceScale.current) * easeIn;


        const time = clock.getElapsedTime();
        
        // Animate decal shine effect
		if (decalRef.current && decalRef.current.material) {
			const shineIntensity = Math.sin(time * 1.5) * 0.3 + 0.6; // oscillates between 0.3 and 0.9
			// Apply multiplier so sections can tone down the white glow
			decalRef.current.material.emissiveIntensity = shineIntensity * emissiveMultiplier;
		}
        
	// Smoothly enable/disable idle orbit and wobble
	const dt = clock.getDelta();
	const targetOrbit = pointerActive.current ? 1 : 0;
	const targetWobble = pointerActive.current ? 1 : 0;
	// Exponential smoothing toward targets
	orbitScale.current += (targetOrbit - orbitScale.current) * Math.min(1, dt * 6);
	wobbleScale.current += (targetWobble - wobbleScale.current) * Math.min(1, dt * 8);

	const orbitX = Math.sin(time * 0.65) * 0.25 * orbitScale.current;
	const orbitY = Math.cos(time * 0.78) * 0.14 * orbitScale.current;
	orbitOffset.current.set(orbitX, orbitY, 0);

	const wobble = Math.sin(time * 1.2) * 0.02 * wobbleScale.current;
	const spin = Math.cos(time * 1.1) * 0.015 * wobbleScale.current;
        const scalePulse = 1 + Math.sin(time * 2.4) * 0.05;
	// Apply pointer-driven spin with inertia
		// External DOM-driven deltas (from parent container)
		if (externalDeltaRef && externalDeltaRef.current && externalDeltaRef.current.t !== lastExternalT.current) {
			const { mx, my, t, leaving } = externalDeltaRef.current;
			const kExt = 0.08; // higher sensitivity for clearer response
			if (!leaving) {
				spinVel.current.x += -my * kExt;
				spinVel.current.y += mx * kExt;
				// Small direct rotation injection for immediate visual feedback
				const kRot = 0.0025;
				addRot.current.x += my * kRot;
				addRot.current.y += mx * kRot;
				pointerActive.current = true;
				// Cancel any pending leave/return when re-engaging
				leaveTimeRef.current = null;
				hasReturnedRef.current = false;
				if (returnAnim.current.active) returnAnim.current.active = false;
			} else {
				pointerActive.current = false;
				// No delay: start slow return immediately
				leaveTimeRef.current = null;
				hasReturnedRef.current = false;
				if (!returnAnim.current.active) {
					returnAnim.current.active = true;
					returnAnim.current.start = performance.now();
					returnAnim.current.from = { x: addRot.current.x, y: addRot.current.y };
					spinVel.current.x = 0;
					spinVel.current.y = 0;
					triggerBounce();
				}
			}
			lastExternalT.current = t;
		}

		// If pointer not active, nothing to schedule — return starts immediately on leave

		// While slow return animation is active, ease addRot back to 0
		if (returnAnim.current.active) {
			const progress = Math.min(
				(performance.now() - returnAnim.current.start) / (returnAnim.current.duration * 1000),
				1
			);
			// EaseOutCubic
			const ease = 1 - Math.pow(1 - progress, 3);
			addRot.current.x = returnAnim.current.from.x * (1 - ease);
			addRot.current.y = returnAnim.current.from.y * (1 - ease);
			if (progress >= 1) {
				addRot.current.x = 0;
				addRot.current.y = 0;
				returnAnim.current.active = false;
				hasReturnedRef.current = true;
				// Clear countdown
				leaveTimeRef.current = null;
			}
		}

		// Integrate angular velocity -> additional rotation
		addRot.current.x += spinVel.current.x * dt; // vertical mouse movement spins around X
		addRot.current.y += spinVel.current.y * dt; // horizontal mouse movement spins around Y
		// Dampen velocity over time so it slows down smoothly
	const velDamping = pointerActive.current ? Math.pow(0.985, dt * 60) : Math.pow(0.90, dt * 60);
	spinVel.current.x *= velDamping;
	spinVel.current.y *= velDamping;
		// Snap to zero when very close to avoid jitter
		if (!pointerActive.current) {
			const eps = 1e-4;
			if (Math.abs(addRot.current.x) < eps) addRot.current.x = 0;
			if (Math.abs(addRot.current.y) < eps) addRot.current.y = 0;
		}
		// Compose rotations: base wobble + pointer spin
		ball.rotation.set(
			wobble + addRot.current.x,
			spin + addRot.current.y,
			wobble * 0.8
		);
	ball.scale.setScalar(baseScale * scalePulse * entranceScale.current);

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
			// start lower and smaller so entrance animation is visible
			ballRef.current.position.copy(neutralPosition.current).add(new Vector3(0, -1.0, 0));
			ballRef.current.scale.setScalar(baseScale * entranceScale.current);
		}
	}, []);

	const handlePointerMove = (e) => {
		// Prefer movementX/Y; fallback to client deltas if not provided
		let mx = e.movementX ?? e.nativeEvent?.movementX;
		let my = e.movementY ?? e.nativeEvent?.movementY;
		if (mx === undefined || my === undefined) {
			const cx = e.clientX ?? e.nativeEvent?.clientX ?? lastPos.current.x;
			const cy = e.clientY ?? e.nativeEvent?.clientY ?? lastPos.current.y;
			mx = cx - lastPos.current.x;
			my = cy - lastPos.current.y;
			lastPos.current = { x: cx, y: cy };
		}
		// Scale factor to convert pixels to angular velocity
		const k = 0.03; // slightly higher responsiveness
		spinVel.current.x += mx * k;
		spinVel.current.y += -my * k; // invert so moving up spins forward
		pointerActive.current = true;
		e.stopPropagation();
	};

	const handlePointerOver = (e) => {
		pointerActive.current = true;
		// Seed last pointer position for smooth deltas
		lastPos.current = {
			x: e.clientX ?? e.nativeEvent?.clientX ?? lastPos.current.x,
			y: e.clientY ?? e.nativeEvent?.clientY ?? lastPos.current.y,
		};
		// Cancel pending return
		leaveTimeRef.current = null;
		hasReturnedRef.current = false;
		if (returnAnim.current.active) returnAnim.current.active = false;
		triggerBounce();
		e.stopPropagation();
	};

	const handlePointerOut = (e) => {
		pointerActive.current = false;
		// No delay: start slow return immediately
		leaveTimeRef.current = null;
		hasReturnedRef.current = false;
		if (!returnAnim.current.active) {
			returnAnim.current.active = true;
			returnAnim.current.start = performance.now();
			returnAnim.current.from = { x: addRot.current.x, y: addRot.current.y };
			spinVel.current.x = 0;
			spinVel.current.y = 0;
			triggerBounce();
		}
		e.stopPropagation();
	};

	return (
		<Float
			speed={1.75}
			rotationIntensity={0}
			floatIntensity={0.12}
			floatingRange={[0, 0.05]}>
		<group
			ref={ballRef}
			onPointerOver={handlePointerOver}
			onPointerOut={handlePointerOut}
			onPointerMove={handlePointerMove}
			onPointerDown={triggerBounce}>
				{/* Wide transparent plane to guarantee pointer capture inside the canvas area */}
				<mesh
					position={[0, 0, 0]}
					frustumCulled={false}
					onPointerOver={handlePointerOver}
					onPointerOut={handlePointerOut}
					onPointerMove={handlePointerMove}
				>
					<planeGeometry args={[10, 10]} />
					<meshBasicMaterial transparent opacity={0} depthWrite={false} side={2} />
				</mesh>
				{/* Invisible hit target to reliably capture pointer events */}
				<mesh
					onPointerOver={handlePointerOver}
					onPointerOut={handlePointerOut}
					onPointerMove={handlePointerMove}
					scale={baseScale * 1.05}
					position={[0, 0, 0]}
				>
					<sphereGeometry args={[1, 16, 16]} />
					<meshBasicMaterial transparent opacity={0} depthWrite={false} />
				</mesh>

				<mesh
					castShadow
					receiveShadow
					onPointerOver={handlePointerOver}
					onPointerOut={handlePointerOut}
					onPointerMove={handlePointerMove}>
					{geometry === "box" ? (
						<boxGeometry args={[1, 1, 1]} />
					) : geometry === "oct" ? (
						<octahedronGeometry args={[1, 0]} />
					) : (
						<icosahedronGeometry args={[1, icoDetail]} />
					)}
					<meshStandardMaterial
						color={baseColor}
						metalness={metalness}
						roughness={roughness}
						polygonOffset
						polygonOffsetFactor={-4}
						flatShading
					/>
					<Decal
						ref={decalRef}
						position={decalPosition ?? (geometry === "box" ? [0, 0, 0.5] : [0, 0, 1])}
						rotation={decalRotation}
						scale={decalScale}
						map={iconTexture}
						flatShading
					>
						<meshStandardMaterial
							map={iconTexture}
							emissive={emissiveColor}
							// base intensity scaled by multiplier; dynamic updates will override this
							emissiveIntensity={0.5 * emissiveMultiplier}
							transparent
							opacity={1}
							polygonOffset
							polygonOffsetFactor={-5}
						/>
					</Decal>
				</mesh>
			</group>
		</Float>
	);
};

const BallCanvas = ({ icon, externalDeltaRef = null, decalRotation, decalScale, geometry, decalPosition, icoDetail, baseColor, metalness, roughness, emissiveColor = '#ffffff', emissiveMultiplier = 1, visible = true }) => {
	const canvasElRef = useRef(null);
	const cleanupRef = useRef(null);

	useEffect(() => {
		return () => {
			if (cleanupRef.current) {
				try {
					cleanupRef.current();
				} catch (e) {
					// swallow cleanup errors
				}
			}
		};
	}, []);

	return (
		<Canvas
			shadows={false}
			frameloop={visible ? 'always' : 'demand'}
			dpr={[1, 1.5]}
			camera={{ position: [0, 0, 12], fov: 45 }}
			onCreated={(state) => {
				try {
					const renderer = state.gl;
					const canvas = renderer.domElement;
					canvasElRef.current = canvas;

					const onLost = (e) => {
						// prevent default to avoid browser's default handling
						try { e.preventDefault(); } catch (err) {}
						// log a single handled message so it doesn't spam
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
							// attempt a safe dispose of renderer resources
							if (renderer && typeof renderer.dispose === 'function') renderer.dispose();
						} catch (err) {}
					};
				} catch (err) {
					// ignore onCreated errors
				}
			}}
			gl={{ preserveDrawingBuffer: false, alpha: true, antialias: false, powerPreference: 'high-performance' }}
			style={{ width: "100%", height: "100%", background: "transparent" }}>
			<Suspense fallback={<CanvasLoader />}>
				<ambientLight intensity={0.35} />
				<hemisphereLight skyColor='#ffffff' groundColor='#1a1a1a' intensity={0.55} />
				<directionalLight position={[4, 6, 5]} intensity={1.2} />
				<pointLight position={[-3, 3, 2]} intensity={0.45} />
				{/* Removed OrbitControls to avoid intercepting pointer events */}
				<Ball
					imgUrl={icon}
					externalDeltaRef={externalDeltaRef}
					decalRotation={decalRotation}
					decalScale={decalScale}
					geometry={geometry}
					decalPosition={decalPosition}
					icoDetail={icoDetail}
					baseColor={baseColor}
					metalness={metalness}
					roughness={roughness}
					emissiveColor={emissiveColor}
					emissiveMultiplier={emissiveMultiplier}
					visible={visible}
				/>
			</Suspense>
			<Preload all />
		</Canvas>
	);
};

export default BallCanvas;
