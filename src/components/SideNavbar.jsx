import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { navLinks } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { wolfcave } from '../assets';
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
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setVisible(mq.matches && window.scrollY > 160);
    update();
    const onScroll = () => update();
    window.addEventListener('scroll', onScroll, { passive: true });
    mq.addEventListener('change', update);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', onScroll);
      mq.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const portalTarget = typeof document !== 'undefined' ? document.body : null;

  const aside = (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ type: 'spring', stiffness: 240, damping: 30 }}
          className='hidden lg:flex fixed left-4 inset-y-0 items-center z-[9999] pointer-events-none'
          aria-label='Section navigation'
        >
          <div className='flex items-stretch gap-2 pointer-events-auto'>
            {/* Scroll progress rail */}
            <div className='relative w-1 rounded-full bg-black/10 overflow-hidden'>
              <motion.div
                className='absolute inset-x-0 top-0 h-full rounded-full bg-tertiary origin-top'
                style={{ scaleY: scrollYProgress }}
              />
            </div>

            {/* Dock — compact by default, reveals labels on hover */}
            <div className='group flex flex-col items-stretch gap-1 rounded-2xl border border-black/[0.06] bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-2'>
              {/* Home */}
              <button
                type='button'
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label='Home'
                className='flex items-center justify-center rounded-xl p-1 hover:bg-black/[0.05] transition-colors duration-200 hover:scale-105'
              >
                <img src={wolfcave} alt='Home' width='36' height='36' className='w-9 h-9 object-contain' />
              </button>

              <span className='h-px w-full bg-black/10 my-0.5' />

              {/* Section navigation */}
              <ul className='flex flex-col gap-0.5 list-none'>
                {navLinks.map((n) => {
                  const label = n.title[language] ?? n.title.en ?? n.id;
                  const isActive = active === n.id;
                  return (
                    <li key={n.id}>
                      <a
                        href={`#${n.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollTo(n.id);
                        }}
                        className={`group/item relative flex items-center gap-2.5 rounded-lg pl-1.5 pr-2 py-1.5 transition-colors duration-200
                          ${isActive ? 'bg-tertiary/10' : 'hover:bg-black/[0.04]'}`}
                      >
                        <span
                          className={`shrink-0 rounded-full transition-all duration-200
                            ${isActive
                              ? 'w-2.5 h-2.5 bg-tertiary shadow-[0_0_0_3px_rgba(139,17,32,0.15)]'
                              : 'w-2 h-2 bg-black-100/30 group-hover/item:bg-tertiary/70'}`}
                        />
                        <span
                          className={`whitespace-nowrap text-[13px] font-semibold pr-1
                            ${isActive ? 'text-tertiary' : 'text-black-100/80 group-hover/item:text-black-100'}`}
                        >
                          {label}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              <span className='h-px w-full bg-black/10 my-0.5' />

              {/* Language */}
              <div className='flex justify-center pt-0.5'>
                <LanguageToggle size='sidebarMini' />
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );

  if (!portalTarget) return null;
  return createPortal(aside, portalTarget);
};

export default SideNavbar;
