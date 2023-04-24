import React from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const ServiceCard = ({index, title, icon}) =>
{
  return (
		<Tilt className='xs:w-[250px] w-full'>
			<motion.div
				variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
				className='w-full yellow-orange-gradient p-[1px] rounded-[20px] shadow-card'>
				<div
					options={{
						max: 45,
						scale: 1,
						speed: 450,
					}}
					className='bg-[#181818] rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'>
					<img
						src={icon}
						alt={title}
						className='w-30 h-30 object-contain'
					/>
					<h3 className='text-white-200 text-[20px] font-bold text-center mb-7'>
						{title}
					</h3>
				</div>
			</motion.div>
		</Tilt>
	);
}

const About = () => {
  return (
		<>
			<motion.div variants={textVariant()}>
				<p className={styles.sectionSubText}>Introduction</p>
				<h2 className={styles.sectionHeadText}>Overview.</h2>
			</motion.div>
			<motion.p
				variants={fadeIn("", "", 0.1, 1)}
				className='mt-4 text-secondary text-[17px] m-w-3xl leading-[30px]'>
				I'm a skilled developer with solid front-end knowledge of <b>React</b>,{" "}
				<b>ES6+</b>, <b>HTML5</b>, <b>CSS3+</b>, <b>Redux</b>, <b>TypeScript</b>
				, <b>Bootstrap5</b>, <b>TailwindCSS</b> and <b>ThreeJS</b>. Back-end
				expertise in <b>NodeJS</b>, <b>ExpressJS</b>, <b>EJS</b> and experienced
				on building <b>RESTful APIs</b>. Strong understanding of design
				principles, UI/UX and responsive design. <b>AWS Certified Devops</b>{" "}
				Developer and background using <b>MongoDB</b> and <b>Mongoose</b>. Great
				understanding of <b>WEB3</b> and <b>DApps</b> development, <b>Git</b>{" "}
				and <b>GitHub</b>. Positive attitude, strong work ethic and a drive for
				results while focusing on <b>high code quality</b> and performance. Let's work together!
			</motion.p>
			<div className='mt-20 flex flex-wrap gap-10'>
				{services.map((service, index) => (
					<ServiceCard
						key={service.title}
						index={index}
						{...service}
					/>
				))}
			</div>
		</>
	);
}

export default SectionWrapper(About, 'about')
