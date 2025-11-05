import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { wolfcave, link as linkIcon } from '../assets';
import LanguageToggle from './LanguageToggle';

const useActiveSection = (ids) => {
  const [active, setActive] = useState(null);

  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        let bestId = null;
        let bestDist = Infinity;
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const dist = Math.abs(center - window.innerHeight / 2);
          if (dist < bestDist) {
            bestDist = dist;
            bestId = id;
          }
        }
        setActive(bestId);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids]);

  return active;
};

const SideNavbar = () => {
  const { language } = useLanguage();
  const ids = useMemo(() => navLinks.map((n) => n.id), []);
  const active = useActiveSection(ids);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => {
      const scrolled = window.scrollY > 160;
      setVisible(mq.matches && scrolled);
    };
    update();
    const onScroll = () => update();
    const onResize = () => update();
    window.addEventListener('scroll', onScroll, { passive: true });
    mq.addEventListener('change', onResize);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      mq.removeEventListener('change', onResize);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const portalTarget = typeof document !== 'undefined' ? document.body : null;

  const aside = (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ opacity: 0, x: -32, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -32, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 220, damping: 32 }}
          className='hidden lg:flex fixed left-5 inset-y-0 items-center z-[9999] pointer-events-auto'
          aria-label='Section navigation'
        >
          <div className='backdrop-blur-md bg-white/70 border border-black/10 shadow-xl rounded-2xl p-1.5 flex flex-col items-center gap-1.5 transition-all duration-300 min-w-[48px]'>
            <a
              href='#'
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className='rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-xl bg-white/60 dark:bg-black/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl'
              style={{
                boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
                background: 'linear-gradient(90deg,rgba(0,0,0,0.04),rgba(0,0,0,0.10) 100%)',
                backdropFilter: 'blur(2px)'
              }}
            >
              <img src={wolfcave} alt='Home' width='44' height='44' className='w-11 h-11 object-contain drop-shadow-[0_1px_4px_rgba(0,0,0,0.10)]' />
            </a>
            <div className='w-[2px] h-4 bg-black/20 rounded-full' />
            <LanguageToggle size='sidebarMini' orientation='vertical' />
            <div className='w-[2px] h-4 bg-black/20 rounded-full' />
            <ul className='flex flex-col items-center gap-2'>
              {navLinks.map((n) => {
                const label = n.title[language] ?? n.title.en ?? n.id;
                const isActive = active === n.id;
                return (
                  <li key={n.id}>
                    <a
                      href={`#${n.id}`}
                      onClick={(e) => handleClick(e, n.id)}
                      className={`group relative flex items-center gap-2 py-2 px-2 rounded-xl transition-all duration-300
                        ${isActive
                          ? 'bg-white/70 dark:bg-black/40 text-black dark:text-white shadow-2xl backdrop-blur-md scale-110 ring-2 ring-black/10 dark:ring-white/10'
                          : 'bg-transparent text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 hover:scale-105 hover:shadow-lg'}
                      `}
                      style={isActive ? {
                        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)',
                        background: 'linear-gradient(90deg,rgba(0,0,0,0.04),rgba(0,0,0,0.10) 100%)',
                        backdropFilter: 'blur(2px)'
                      } : {}}
                    >
                      <span className={`inline-block w-2.5 h-2.5 rounded-full transition-all duration-200 ${isActive ? 'bg-black dark:bg-white scale-125 shadow' : 'bg-black dark:bg-white/60'}`} />
                      <span className='pointer-events-none absolute left-[38px] whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium bg-black text-white opacity-0 translate-x-[-6px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150'>
                        {label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className='w-[2px] h-4 bg-black/20 rounded-full' />
            <a
              href='https://www.linkedin.com/in/zackisaza/'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:scale-110 transition-transform duration-200'
            >
              <img src={linkIcon} width='28' height='28' alt='LinkedIn' />
            </a>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
  
  if (!portalTarget) return null;
  return createPortal(aside, portalTarget);
};

export default SideNavbar;
