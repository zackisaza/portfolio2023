import React from 'react'
import {
	VerticalTimeline,
	VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from 'framer-motion';
import 'react-vertical-timeline-component/style.min.css';
import { styles } from '../styles';
import { experiences } from '../constants';
import Typewriter from "./Typewriter";
import { SectionWrapper } from '../hoc';
import { textVariant } from '../utils/motion';
import { useLanguage } from "../context/LanguageContext";
import { typeFire, typeDark } from "../assets";

// Improved palette for experience accents (pleasant, accessible hues)
const accentPalette = ['#06B6D4', '#2563EB', '#10B981', '#F59E0B', '#E11D48', '#8B5CF6'];

// Company-specific overrides (normalized company keys)
const companyColorOverrides = {
  'conversion monster': '#F59E0B', // orange
  'system life': '#1E40AF', // dark blue
  'soluciones star': '#7F1D1D', // dark red
  'remote': '#064E3B', // dark green for freelance ('Remote' / 'Remoto')
};

const ExperienceCard = ({ experience, copy, accent }) => {
  // accent is provided by the parent to ensure consistent colors per company
  const bg = accent || (experience.iconBg && experience.iconBg !== '#000' ? experience.iconBg : accentPalette[0]);

  return (
    <VerticalTimelineElement
      // Use the accent color for each card so they differ visually
      contentStyle={{
        background: '#f8fafb',
        color: '#0f172a',
        borderLeft: `6px solid ${bg}`,
        borderRadius: '10px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 12px 36px rgba(2,6,23,0.07)'
      }}
      contentArrowStyle={{ borderRight: `8px solid ${bg}` }}
  // timeline bubble date: show only on mobile via CSS
  date={copy.date}
  dateClassName='timeline-date-mobile'
      iconStyle={{ background: bg, boxShadow: '0 6px 18px rgba(2,6,23,0.12)' }}
      icon={
        <div className='flex justify-center items-center w-full h-full'>
          {/* white circular container so the logo appears round and contrasts with accent bg */}
          <div className='w-[68%] h-[68%] rounded-full bg-white flex items-center justify-center p-1'>
            <img
              src={experience.icon}
              alt={copy.company_name}
              className='w-full h-full object-contain rounded-full'
            />
          </div>
        </div>
      }
    >
      <div className='w-full'>
        <div className='flex items-start justify-between w-full mb-2'>
          <div className='flex items-center space-x-3'>
            <div className='flex flex-col'>
              <h3 className='text-slate-900 text-[20px] font-semibold'>{copy.title}</h3>
              <div className='flex items-center space-x-2 mt-1'>
                <span className='inline-flex items-center justify-center w-3 h-3 rounded-full' style={{ background: bg }} />
                <span className='text-slate-600 text-sm font-medium'>{copy.company_name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* (date shown via timeline bubble on mobile) */}

        <hr className='border-t border-slate-200 my-3' />

        <ul className='mt-2 list-disc ml-5 space-y-3'>
          {copy.points.map((point, i) => (
            <li
              key={`experience-point-${i}`}
              className='text-slate-700 text-[15px] leading-relaxed pl-1 tracking-wide'
            >
              <Typewriter rich content={point} speed={18} startDelay={160 + i * 60} cursor={false} />
            </li>
          ))}
        </ul>
      </div>
    </VerticalTimelineElement>
  )
}

const Experience = () => {
  const { t, language } = useLanguage();
  // produce a deterministic key from the company string
  const normalizeCompany = (companyStr = '') => {
    // split on common separators (en dash, em dash, hyphen, open paren)
    const parts = companyStr.split(/–|—|-|\(/);
    return parts[0].trim().toLowerCase();
  };

  // build a map companyKey -> accent color so same company reuses same color
  const colorByCompany = {};
  let nextColorIndex = 0;
  return (
		<>
			<motion.div 
				variants={textVariant()} 
				className="relative z-20"
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.1 }}
			>
            <p className={styles.sectionSubText}><Typewriter content={t("experience.subtitle")} speed={26} startDelay={60} /></p>
            <h2 className={`${styles.sectionHeadText} relative z-20`}><Typewriter content={t("experience.title")} speed={26} startDelay={120} /></h2>
            
            {/* Pokemon Type Decorations */}
            <motion.div 
              className='absolute top-0 -right-6 hidden md:block'
              initial={{ opacity: 0, scale: 0, rotate: 180 }}
              animate={{ opacity: 0.1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            >
              <motion.img 
                src={typeFire} 
                alt='' 
                className='w-20 h-20'
                animate={{ 
                  rotate: [0, 15, 0, -15, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
      </motion.div>
      <div className='mt-20 flex flex-col relative'>
        {/* Decoración flotante en el timeline */}
        <motion.div 
          className='absolute -left-8 top-1/3 hidden lg:block'
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.08, x: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <motion.img 
            src={typeDark} 
            alt='' 
            className='w-16 h-16'
            animate={{ 
              y: [0, -15, 0, 15, 0],
              rotate: [0, -10, 0, 10, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </motion.div>
        
        <div className='flex justify-center mb-4'>
          <span className='text-white font-semibold text-sm'>
            {language === 'es' ? 'Hoy' : 'Today'}
          </span>
        </div>

        <VerticalTimeline>
          {experiences.map((experience) => {
            const copy = experience.translations[language] ?? experience.translations.en;
            const key = normalizeCompany(copy.company_name);

            // first, check explicit company overrides
            if (companyColorOverrides[key]) {
              colorByCompany[key] = companyColorOverrides[key];
            }

            // prefer explicit iconBg if provided and not generic and no override exists
            if (!colorByCompany[key] && experience.iconBg && experience.iconBg !== '#000') {
              colorByCompany[key] = experience.iconBg;
            }

            // fallback to palette assignment
            if (!colorByCompany[key]) {
              colorByCompany[key] = accentPalette[nextColorIndex % accentPalette.length];
              nextColorIndex += 1;
            }

            return (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                copy={copy}
                accent={colorByCompany[key]}
              />
            );
          })}
        </VerticalTimeline>

        <div className='flex justify-center mt-4'>
          <span className='text-white font-semibold text-sm'>
            {language === 'es' ? 'Inicio' : 'Start'}
          </span>
        </div>
      </div>
		</>
	);
}

export default SectionWrapper(Experience, "experience");
