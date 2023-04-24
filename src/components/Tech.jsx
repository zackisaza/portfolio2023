import { BallCanvas } from "./canvas"
import { SectionWrapper } from "../hoc"
import { technologies } from "../constants"
import { motion } from "framer-motion"
import { textVariant } from "../utils/motion";
import { styles } from "../styles";

const Tech = () => {
  return (
		<div>
			<motion.div variants={textVariant()}>
				<p className={styles.sectionSubText}>Hold the icosahedron to see the tech!</p>
				<h2 className={styles.sectionHeadText}>What can I do?</h2>
			</motion.div>

			<div className='mt-[50px] flex flex-row flex-wrap justify-center gap-10'>
				{technologies.map((technology) => (
					<div
						className='w-28 h-28'
						key={technology.name}>
						<BallCanvas icon={technology.icon} />
					</div>
				))}
			</div>
		</div>
	);
}

export default SectionWrapper(Tech, '');