import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";
import { gif } from "../assets";

const Hero = () => {
	const heroRef = useRef(null);
	const [heroInView, setHeroInView] = useState(true);

	useEffect(() => {
		const node = heroRef.current;
		if (!node) return undefined;

		const observer = new IntersectionObserver(
			([entry]) => setHeroInView(entry.isIntersecting),
			{
				root: null,
				rootMargin: "0px",
				threshold: 0.25,
			}
		);

		observer.observe(node);
		return () => observer.unobserve(node);
	}, []);

	return (
		<section ref={heroRef} className='relative w-full h-screen mx-auto'>
			<div
				className={`${styles.paddingX} lg:mt-6 absolute inset-0 top-[30px] max-w-7xl mx-auto flex flex-row items-start gap-5`}>
				<div className='flex flex-col justify-center items-center mt-5 lg:mt-9'>
					<div className='w-5 h-5 rounded-full bg-tertiary' />
					<div className='w-1 xm:h-80 sm:h-80 h-40 yellow-gradient' />
					
				</div>

				<div
					className='content mt-9
				'>
					
					<h2 className={`${styles.heroHeadText}`}>I'm Zack</h2>
					<h2 className={`${styles.heroHeadText}`}>I'm Zack</h2>
					<p className={`${styles.heroSubText} text-black-100 z-20`}>
						Senior Software Engineer.
					</p>
					<div>
						<img
							src={gif}
							alt='gif'
							className='hidden lg:inline-block mt-[20px] ml-[30px] w-[150px] h-[150px] drop-shadow-lg'
						/>
					</div>
				</div>
			</div>
			<ComputersCanvas active={heroInView} />
			<div className='absolute xs:botton-10 bottom-32 w-full flex justify-center items-center hover:scale-90 duration-200'>
				<a href='#about'>
					<div className='mt-10 w-[35px] h-[54px] rounded-3xl border-4 border-tertiary flex justify-center items-start p-2'>
						<motion.div
							animate={{
								y: [0, 20, 0],
							}}
							transition={{
								duration: 1.5,
								repeat: Infinity,
								repeatType: "loop",
							}}
							className='w-3 h-3 rounded-full bg-tertiary'
						/>
					</div>
				</a>
			</div>
		</section>
	);
};

export default Hero;
