import { motion } from 'framer-motion';
import { styles } from '../styles';
import { ComputersCanvas } from './canvas';
import { gif } from '../assets';

const Hero = () => {
  return (
		<section className='relative w-full h-screen mx-auto'>
			<div
				className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl mx-auto flex flex-row items-start gap-5`}>
				<div className='flex flex-col justify-center items-center mt-5'>
					<div className='w-5 h-5 rounded-full bg-tertiary' />
					<div className='w-1 xm:h-80 sm:h-80 h-40 yellow-gradient' />
				</div>
				<div className='content mt-[50px]'>
					<h2 className={`${styles.heroHeadText}`}>I'm Zett</h2>
					<h2 className={`${styles.heroHeadText}`}>I'm Zett</h2>
					<p className={`${styles.heroSubText} text-black-100 z-20`}>
						A programmer.
					</p>
					<div>
						<img
							src={gif}
							alt='gif'
							className='hidden lg:inline-block mt-[40px] w-[200px] h-[200px] drop-shadow-lg'
						/>
					</div>
				</div>
			</div>
			<ComputersCanvas />
			<div className='absolute xs:botton-10 bottom-32 w-full flex justify-center items-center'>
				<a href='#about'>
					<div className='mt-10 w-[35px] h-[54px] rounded-3xl border-4 border-tertiary flex justify-center items-start p-2'>
						<motion.dev
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
}

export default Hero