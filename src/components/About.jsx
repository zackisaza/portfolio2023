import React from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const iconMap = {
	mastery: (className = "") => (
		<svg
			className={className}
			viewBox="0 0 64 64"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden='true'>
			<rect
				x='6'
				y='6'
				width='52'
				height='52'
				rx='16'
				fill='#2d1b69'
			/>
			<rect
				x='18'
				y='18'
				width='28'
				height='28'
				rx='6'
				fill='#6d28d9'
			/>
			<path
				d='M24 24h16v16H24z'
				fill='#c4b5fd'
			/>
			<path
				d='M12 24h6M12 32h6M12 40h6M46 24h6M46 32h6M46 40h6'
				stroke='#c4b5fd'
				strokeWidth='3'
				strokeLinecap='round'
			/>
			<path
				d='M24 12v6M32 12v6M40 12v6M24 46v6M32 46v6M40 46v6'
				stroke='#c4b5fd'
				strokeWidth='3'
				strokeLinecap='round'
			/>
		</svg>
	),
	system: (className = "") => (
		<svg
			className={className}
			viewBox='0 0 64 64'
			xmlns='http://www.w3.org/2000/svg'
			aria-hidden='true'>
			<rect
				x='6'
				y='6'
				width='52'
				height='52'
				rx='16'
				fill='#0f172a'
			/>
			<circle cx='18' cy='24' r='7' fill='#38bdf8' />
			<circle cx='46' cy='20' r='6' fill='#06b6d4' />
			<circle cx='32' cy='44' r='9' fill='#0ea5e9' />
			<path
				d='M24 28l6 12m4-12l8-6M32 44l14-4'
				stroke='#f8fafc'
				strokeWidth='3'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	),
	devops: (className = "") => (
		<svg
			className={className}
			viewBox='0 0 64 64'
			xmlns='http://www.w3.org/2000/svg'
			aria-hidden='true'>
			<rect
				x='6'
				y='6'
				width='52'
				height='52'
				rx='16'
				fill='#1f2933'
			/>
			<path
				d='M22 26c4-6 10-6 14 0l6 8c4 6 0 12-6 12-4 0-6-2-7-4'
				stroke='#f97316'
				strokeWidth='5'
				strokeLinecap='round'
				fill='none'
			/>
			<path
				d='M42 38c-4 6-10 6-14 0l-6-8c-4-6 0-12 6-12 4 0 6 2 7 4'
				stroke='#facc15'
				strokeWidth='5'
				strokeLinecap='round'
				fill='none'
			/>
			<circle cx='24' cy='22' r='3' fill='#fb923c' />
			<circle cx='40' cy='42' r='3' fill='#fde68a' />
		</svg>
	),
	leadership: (className = "") => (
		<svg
			className={className}
			viewBox='0 0 64 64'
			xmlns='http://www.w3.org/2000/svg'
			aria-hidden='true'>
			<rect
				x='6'
				y='6'
				width='52'
				height='52'
				rx='16'
				fill='#3b0d0c'
			/>
			<circle cx='32' cy='24' r='9' fill='#f97316' />
			<path
				d='M18 50c0-8 6-14 14-14s14 6 14 14'
				fill='#fb923c'
			/>
			<circle cx='20' cy='26' r='6' fill='#facc15' />
			<circle cx='44' cy='28' r='6' fill='#fcd34d' />
			<path
				d='M12 52c0-5 3-9 8-11M52 52c0-5-3-9-8-11'
				stroke='#fde68a'
				strokeWidth='4'
				strokeLinecap='round'
				opacity='0.85'
			/>
		</svg>
	),
};

const ServiceCard = ({ index, title, description, icon }) =>
{
  return (
		<Tilt
			className='xs:w-[240px] sm:w-[250px] w-full'
			options={{
				max: 45,
				scale: 1,
				speed: 450,
			}}>
			<motion.div
				variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
				className='w-full bg-gradient-to-r from-[#45070e] via-[#6a0e1c] to-[#45070e] p-[1px] rounded-[20px] shadow-card'
				animate={{ y: [0, -10, 0], rotate: [-1.2, 0.8, -1.2], scale: [1, 1.03, 1] }}
				transition={{
					duration: 3.6,
					repeat: Infinity,
					repeatType: "reverse",
					ease: "easeInOut",
					delay: (index % 4) * 0.35,
					repeatDelay: 0.1,
				}}>
				<div className='bg-[#1a0000] rounded-[20px] py-6 px-8 min-h-[280px] flex flex-col justify-between gap-6'>
					<div className='flex flex-col items-center gap-4 text-center'>
						{iconMap[icon]?.("w-16 h-16 drop-shadow-[0_8px_18px_rgba(0,0,0,0.25)]")}
						<h3 className='text-white-200 text-[18px] font-semibold leading-snug'>
							{title}
						</h3>
					</div>
					<p className='text-secondary text-sm leading-relaxed text-center'>
						{description}
					</p>
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
				className='mt-4 text-secondary text-[20px] m-w-3xl leading-[30px]'>
				I'm a senior backend engineer focused on designing <b>high-performance</b>, <b>scalable</b>, and <b>secure systems</b>. 
  Specialized in <b>Node.js</b>, <b>TypeScript</b>, <b>NestJS</b>, <b>Express</b>, 
  <b>PHP</b> (<b>Laravel</b>, <b>Symfony</b>), and <b>Python</b> (<b>Django</b>, <b>FastAPI</b>). 
  Skilled in <b>PostgreSQL</b>, <b>MongoDB</b>, <b>Redis</b>, <b>Docker</b>, <b>Kubernetes</b>, and <b>AWS</b>. 
  Experienced in <b>serverless</b> architectures, <b>CI/CD automation</b>, and <b>testing pipelines</b>. 
  Passionate about <b>clean architecture</b>, <b>system observability</b>, and <b>code quality</b>. 
  Strong background in <b>technical leadership</b>, mentoring developers, and delivering reliable backend solutions in <b>2025</b>.
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
