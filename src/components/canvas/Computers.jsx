import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from 'three';
import { OrbitControls, Preload, useGLTF, AdaptiveDpr } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile, visible = true, isInteractingRef = null }) => {
	const computer = useGLTF("./desktop_pc/scene.gltf");
	const computerGroup = useRef();

	// Mobile-only pointer-driven rotation state (does not affect desktop)
	const rotVel = useRef(0);
	const lastPos = useRef({ x: 0 });

	const handlePointerMove = (e) => {
		if (!isMobile) return;
		let mx = e.movementX ?? e.nativeEvent?.movementX;
		if (mx === undefined) {
			const cx = e.clientX ?? e.nativeEvent?.clientX ?? lastPos.current.x;
			mx = cx - lastPos.current.x;
			lastPos.current.x = cx;
		}
		const sensitivity = 0.004; // tweak to taste
		rotVel.current += -mx * sensitivity;
		try { e.stopPropagation(); } catch (err) { /* non-critical: ignore */ }
	};

	const handlePointerOver = (e) => {
		if (!isMobile) return;
		lastPos.current.x = e.clientX ?? e.nativeEvent?.clientX ?? lastPos.current.x;
		try { e.stopPropagation(); } catch (err) { /* non-critical: ignore */ }
	};

	const handlePointerOut = (e) => {
		if (!isMobile) return;
		try { e.stopPropagation(); } catch (err) { /* non-critical: ignore */ }
	};

	// Ensure the initial transform on mount matches the intended layout for
	// mobile vs desktop. This forces the group's position/rotation/scale so any
	// earlier changes or touch-driven deltas don't leave the model in a wrong
	// initial pose when the component mounts or when viewport switches.
	useEffect(() => {
		try {
			if (!computerGroup.current) return;
			if (isMobile) {
				// mobile: remove forward tilt (rotation.x) so the model starts upright
				computerGroup.current.position.set(-0.1, -3, -1.5);
				computerGroup.current.rotation.set(0, -0.8, 0);
				computerGroup.current.scale.set(0.375, 0.375, 0.375);
			} else {
				computerGroup.current.position.set(1, -3, -1.5);
				computerGroup.current.rotation.set(0.02, -0.8, 0);
				computerGroup.current.scale.set(0.6, 0.6, 0.6);
			}
		} catch (err) { /* non-critical: ignore */ }
	}, [isMobile, computer]);

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
		// If the user is interacting with OrbitControls (desktop drag), avoid
		// updating the group's Y position so it doesn't jump/slide while dragging.
		if (!(isInteractingRef && isInteractingRef.current)) {
			computerGroup.current.position.y += (targetY - computerGroup.current.position.y) * ease;
		}

		// animate rotation toward base + sway (or more tilted when hidden)
		const baseRotX = 0.02;
		const baseRotY = visible ? -0.2 + sway : -1.0;
		computerGroup.current.rotation.x += (baseRotX - computerGroup.current.rotation.x) * ease;
		computerGroup.current.rotation.y += (baseRotY - computerGroup.current.rotation.y) * ease;
		computerGroup.current.rotation.z += (0 - computerGroup.current.rotation.z) * ease;

		// apply mobile-only pointer-driven rotation velocity and decay it
		try {
			if (isMobile) {
				computerGroup.current.rotation.y += rotVel.current;
				rotVel.current *= 0.92;
				if (Math.abs(rotVel.current) < 1e-5) rotVel.current = 0;
			}
		} catch (err) { /* non-critical: ignore */ }
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
				rotation={[isMobile ? 0 : 0.02, -0.8, 0]}>
				{isMobile && (
					// Invisible plane captures horizontal pointer moves on mobile only.
					// We stopPropagation for these events but do NOT call preventDefault,
					// so vertical swipes still scroll the page.
					<mesh
						position={[0, 0, 0]}
						frustumCulled={false}
						onPointerOver={handlePointerOver}
						onPointerOut={handlePointerOut}
						onPointerMove={handlePointerMove}
					>
						<planeGeometry args={[20, 20]} />
						<meshBasicMaterial transparent opacity={0} depthWrite={false} side={2} />
					</mesh>
				)}
				<primitive object={computer.scene} />
			</group>
		</mesh>
	);
};

const ComputersCanvas = ({ active = true }) => {
	const canvasElRef = useRef(null);
	const cleanupRef = useRef(null);
	const controlsRef = useRef();
	const isInteractingRef = useRef(false);

	// Component to handle smooth return of camera/controls after desktop drag
	const ControlsHandler = ({ controlsRef, isInteractingRef }) => {
		const { camera } = useThree();
		const rafRef = useRef(null);

		useEffect(() => {
			let controls = controlsRef.current;
			if (!controls) return;

			const initialCamPos = camera.position.clone();
			const initialTarget = controls.target.clone();

			// Gentle "back" easing with small overshoot for a soft bounce on release.
			// c1 controls overshoot amplitude; lower -> softer overshoot.
			const easeOutBack = (t) => {
				const c1 = 0.6; // small overshoot (was 1.70158 for stronger bounce)
				const c3 = c1 + 1;
				return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
			};

			let running = false;
			let startTime = 0;
			let duration = 600; // ms - adjust to taste (longer = softer)
			let fromPos = new THREE.Vector3();
			let fromTarget = new THREE.Vector3();

			const step = (now) => {
				if (!running) return;
				const t = Math.min(1, (now - startTime) / duration);
				const eased = easeOutBack(t);
				camera.position.lerpVectors(fromPos, initialCamPos, eased);
				controls.target.lerpVectors(fromTarget, initialTarget, eased);
				controls.update();
				if (t >= 1) {
					running = false;
					return;
				}
				rafRef.current = requestAnimationFrame(step);
			};

			const onStart = () => {
				// mark interacting so the scene can pause certain auto-animations
				if (isInteractingRef) isInteractingRef.current = true;
				// cancel any running animation
				running = false;
				if (rafRef.current) cancelAnimationFrame(rafRef.current);
			};

			const onEnd = () => {
				// unmark interacting so the scene can resume auto-animations;
				if (isInteractingRef) isInteractingRef.current = false;
				// start animation back to initial
				fromPos.copy(camera.position);
				fromTarget.copy(controls.target);
				running = true;
				startTime = performance.now();
				if (rafRef.current) cancelAnimationFrame(rafRef.current);
				rafRef.current = requestAnimationFrame(step);
			};

			controls.addEventListener('start', onStart);
			controls.addEventListener('end', onEnd);

			return () => {
				controls.removeEventListener('start', onStart);
				controls.removeEventListener('end', onEnd);
				if (rafRef.current) cancelAnimationFrame(rafRef.current);
			};
			// Captures the initial camera pose once to animate back to; re-running on
			// camera.position changes would fight the live drag. Intentionally run-once.
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [controlsRef, isInteractingRef]);
		return null;
	};

	useEffect(() => {
		return () => {
			if (cleanupRef.current) {
				try {
					cleanupRef.current();
				} catch (e) { /* non-critical: ignore */ }
			}
		};
	}, []);
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

	// Manage mount/visibility so we can animate exit before unmounting
	const [shouldRender, setShouldRender] = useState(active);
	const [visibleLocal, setVisibleLocal] = useState(active);

	// Keep a ref for timers to clean up
	const timeoutRef = useRef();

	useEffect(() => {
		// If we need to hide (inactive), animate out then unmount
		if (!active) {
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
	}, [active, shouldRender]);

	if (!shouldRender) {
		return <div className='w-full h-full bg-transparent' />;
	}

	return (
			<Canvas
				style={{ touchAction: 'pan-y' }}
			frameloop={visibleLocal ? 'always' : 'demand'}
			shadows
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

					// Ensure the canvas element allows vertical scroll on mobile and pinch-zoom
					try {
						canvas.style.touchAction = 'pan-y pinch-zoom';
						canvas.setAttribute('touch-action', 'pan-y pinch-zoom');
					} catch (err) { /* non-critical: ignore */ }

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
			camera={
				isMobile
					? { position: [-5, 20,30], fov: 16 }
					: { position: [5, 17, 5], fov: 26 }
			}
			gl={{ preserveDrawingBuffer: false, antialias: false, powerPreference: 'high-performance' }}>
			<Suspense fallback={<CanvasLoader />}>
				{!isMobile && (
					<>
						<OrbitControls
							ref={controlsRef}
							enableZoom={false}
							// On desktop OrbitControls handles rotate/pan; on mobile we use
							// custom pointer handlers so we don't block vertical scroll.
							enableRotate={true}
							enablePan={true}
							maxPolarAngle={Math.PI / 2}
							minPolarAngle={Math.PI / 2}
						/>
						<ControlsHandler controlsRef={controlsRef} isInteractingRef={isInteractingRef} />
					</>
				)}
					<Computers isMobile={isMobile} visible={visibleLocal} isInteractingRef={isInteractingRef} />
			</Suspense>
			<AdaptiveDpr pixelated />
			<Preload all />
		</Canvas>
	);
};

export default ComputersCanvas;
