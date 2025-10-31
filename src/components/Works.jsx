import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({ index, name, description, tags, image }) => {
	return (
		<motion.div
			variants={fadeIn("up", "spring", index * 0.5, 0.75)}
			className='sm:w-[360px] w-full'>
			<Tilt
				options={{
					max: 45,
					scale: 1,
					speed: 450,
				}}>
				<motion.div
					className='bg-gradient-to-r from-[#45070e] via-[#6a0e1c] to-[#45070e] p-5 rounded-2xl w-full shadow-card'
					animate={{ y: [0, -8, 0], rotate: [-0.8, 0.6, -0.8], scale: [1, 1.02, 1] }}
					transition={{
						duration: 3.4,
						repeat: Infinity,
						repeatType: "reverse",
						ease: "easeInOut",
						delay: (index % 3) * 0.3,
						repeatDelay: 0.1,
					}}>
					<div className='relative w-full h-[230px]'>
						<img
							src={image}
							alt={name}
							className='w-full h-full object-cover rounded-2xl'
						/>
					</div>

					<div className='mt-5'>
						<h3 className='text-white-200 font-bold text-[24px]'>{name}</h3>
						<p className='mt-2 text-gray text-[14px]'>{description}</p>
					</div>
					<div className='mt-4 flex flex-gap gap-2'>
						{tags.map((tag) => (
							<p key={tag.name} className={`text-[14px]${tag.color}`}>
								#{tag.name}
							</p>
						))}
					</div>
				</motion.div>
			</Tilt>
		</motion.div>
	);
};

const Works = () => {
	return (
		<>
			<motion.div variants={textVariant()}>
				<p className={styles.sectionSubText}>My work</p>
				<h2 className={styles.sectionHeadText}>Projects.</h2>
			</motion.div>

			<div className='full flex'>
				<motion.p
					variants={fadeIn("", "", 0.1, 1)}
					className='mt-3 text-secondary text[17px] max-w-3xl leading-[30px]'>
					Following projects showcases my skills and experience through real-world
					examples of my work. Each project is briefly. It reflects my ability to
					solve complex problems, work with different technologies, and manage
					projects effectively.
				</motion.p>
			</div>
			<div className='mt-20 flex flex-wrap gap-7'>
				{projects.map((project, index) => (
					<ProjectCard key={`project-${index}`} index={index} {...project} />
				))}
			</div>
		</>
	);
};

export default SectionWrapper(Works, "projects");
