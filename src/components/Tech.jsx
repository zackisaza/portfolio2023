import { useEffect, useRef, useState } from "react";
import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { motion } from "framer-motion";
import { textVariant } from "../utils/motion";
import { styles } from "../styles";

const VisibilityBall = ({ technology, sectionInView }) => {
	const containerRef = useRef(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (!sectionInView) {
			setIsVisible(false);
			return undefined;
		}

		const node = containerRef.current;
		if (!node) return undefined;

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting);
			},
			{
				root: null,
				rootMargin: "200px",
				threshold: 0.2,
			}
		);

		observer.observe(node);
		return () => observer.unobserve(node);
	}, [sectionInView]);

	return (
		<div
			ref={containerRef}
			className='relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center overflow-visible'>
			{sectionInView && isVisible ? (
				<BallCanvas icon={technology.icon} />
			) : (
				<img
					src={technology.icon}
					alt={technology.name}
					className='w-16 h-16 object-contain opacity-60 transition-opacity duration-200'
				/>
			)}
		</div>
	);
};

const Tech = () => {
	const sectionRef = useRef(null);
	const [sectionInView, setSectionInView] = useState(false);

	useEffect(() => {
		const node = sectionRef.current;
		if (!node) return undefined;

		const observer = new IntersectionObserver(
			([entry]) => setSectionInView(entry.isIntersecting),
			{
				root: null,
				rootMargin: "0px",
				threshold: 0.1,
			}
		);

		observer.observe(node);
		return () => observer.unobserve(node);
	}, []);

	return (
		<div>
			<motion.div variants={textVariant()}>
				<p className={styles.sectionSubText}>Techs I Master</p>
				<h2 className={styles.sectionHeadText}>What can I do?</h2>
			</motion.div>

			<div
				ref={sectionRef}
				className='mt-[50px] flex flex-wrap justify-center gap-8 sm:gap-10'>
				{technologies.map((technology) => (
					<VisibilityBall
						key={technology.name}
						technology={technology}
						sectionInView={sectionInView}
					/>
				))}
			</div>
		</div>
	);
};

export default SectionWrapper(Tech, "tech");
