import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload, AdaptiveDpr } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { useCanvasBudget } from "../../context/CanvasBudgetContext";

const Stars = ({ visible = true, ...props }) => {
	const ref = useRef();
	const groupRef = useRef();
	// Eliminar animación de entrada/salida
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
		// Sin animación: escala y posición fijas según visibilidad
		if (groupRef.current) {
			groupRef.current.scale.setScalar(visible ? 1 : 0.0001);
			groupRef.current.position.y = 0;
		}
	});

	// Sin animación de entrada: posición inicial en 0
	useEffect(() => {
		if (groupRef.current) {
			groupRef.current.position.y = 0;
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
					transparent
					color='#f272c8'
					size={0.002}
					sizeAttenuation={true}
					depthWrite={false}
				/>
			</Points>
		</group>
	);
};

const StarsCanvas = ({ sectionIndex = 0 }) => {
	const { suspendAboveOf } = useCanvasBudget();
	// Do NOT suspend stars based on exclusiveSection anymore; keep them across sections
	const suspendedByExclusive = false;
	const suspendedByAbove = suspendAboveOf !== null && sectionIndex < suspendAboveOf;
	const suspended = suspendedByExclusive || suspendedByAbove;

	// Intersection-driven visibility, but keep mounted during exit animation
	const [isIntersecting, setIsIntersecting] = useState(false);
	const [visibleLocal, setVisibleLocal] = useState(false);
	const containerRef = useRef(null);
	const timeoutRef = useRef();

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
		// Si está suspendido globalmente, ocultar visualmente
		if (suspended) {
			setVisibleLocal(false);
			return;
		}

		// Lógica de intersección: solo visibilidad, nunca desmontar
		if (isIntersecting) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => setVisibleLocal(true), 50);
		} else {
			setVisibleLocal(false);
		}

		return () => clearTimeout(timeoutRef.current);
	}, [isIntersecting, suspended]);

	// El canvas siempre está montado, solo cambia la visibilidad

	return (
		<div ref={containerRef} className='w-full h-auto absolute inset-0 z-[-1] pointer-events-none'>
			<Canvas
				camera={{ position: [0, 0, 1] }}
				dpr={[1, 1.15]}
				gl={{ powerPreference: 'high-performance', antialias: false }}
			>
				<Suspense fallback={null}>
					<Stars visible={visibleLocal} />
				</Suspense>
				<AdaptiveDpr pixelated />
				<Preload all />
			</Canvas>
		</div>
	);
};

export default StarsCanvas;
