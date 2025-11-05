import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import Typewriter from "./Typewriter";
import { useLanguage } from "../context/LanguageContext";
import { typeGrass, typeElectric, typeFire, typeWater, typeFairy, typeDark } from "../assets";

const Build = () => {
  const { t } = useLanguage();

  return (
    <>
      <motion.div variants={textVariant()} className='px-4 sm:px-0 text-center'>
        <p className={`${styles.sectionSubText} md:text-center`}>
          <Typewriter content={t("build.subtitle")} speed={26} startDelay={60} />
        </p>
        <h2 className={`${styles.sectionHeadText} md:text-center`}>
          <Typewriter content={t("build.title")} speed={26} startDelay={120} />
        </h2>
      </motion.div>

      <motion.div
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-6 px-6 sm:px-0 max-w-3xl mx-auto text-center text-secondary text-[18px] leading-[30px]'
      >
        <div>
          <Typewriter rich content={t("build.description")} speed={22} startDelay={180} />
        </div>
        <a
          href='https://github.com/zackisaza/portfolio2023'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-lg bg-black text-white border border-white/20 hover:bg-white hover:text-black transition-colors duration-200 mx-auto'
        >
          <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
            <path d='M12 .5a12 12 0 00-3.79 23.39c.6.11.82-.26.82-.58l-.02-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.35-1.77-1.35-1.77-1.1-.75.08-.73.08-.73 1.22.09 1.86 1.25 1.86 1.25 1.08 1.84 2.83 1.31 3.52 1 .11-.79.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.64.24 2.86.12 3.16.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.47 5.92.43.37.81 1.09.81 2.2l-.01 3.26c0 .32.21.69.83.57A12 12 0 0012 .5z' />
          </svg>
          <span>{t("build.linkText")}</span>
        </a>

        {/* Pokemon Type Decoration */}
        <motion.div 
          className='flex items-center justify-center gap-4 mt-8 flex-wrap'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {[
            { icon: typeGrass, delay: 0.6 },
            { icon: typeElectric, delay: 0.7 },
            { icon: typeFire, delay: 0.8 },
            { icon: typeWater, delay: 0.9 },
            { icon: typeFairy, delay: 1.0 },
            { icon: typeDark, delay: 1.1 }
          ].map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 0.6, scale: 1, rotate: 0 }}
              transition={{ 
                delay: type.delay,
                duration: 0.6,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.2, 
                opacity: 1,
                rotate: 360,
                transition: { duration: 0.4 }
              }}
              className='cursor-pointer'
            >
              <img 
                src={type.icon} 
                alt='Pokemon type' 
                className='w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-lg'
                loading='lazy'
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </>
  );
};

export default SectionWrapper(Build, 'build');
