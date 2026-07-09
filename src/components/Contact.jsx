import { lazy, Suspense } from "react";

import { styles } from "../styles";
// Lazy-load EarthCanvas to defer three.js until the contact section is viewed
const EarthCanvasLazy = lazy(() => import("./canvas/Earth"));
import { SectionWrapper } from "../hoc";
import { useLanguage } from "../context/LanguageContext";
import Typewriter from "./Typewriter";

const WHATSAPP_URL = "https://wa.me/573226144416";
const WHATSAPP_DISPLAY = "+57 322 614 4416";
const EMAIL = "zackisaza@gmail.com";

const ArrowIcon = () => (
	<svg
		className='ml-auto shrink-0 text-black-100/25 transition-all duration-300 group-hover:translate-x-1'
		width='18'
		height='18'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2.5'
		strokeLinecap='round'
		strokeLinejoin='round'
		aria-hidden='true'>
		<line x1='5' y1='12' x2='19' y2='12' />
		<polyline points='12 5 19 12 12 19' />
	</svg>
);

const Contact = () => {
	const { t } = useLanguage();

	return (
		<div className='xl:mt-12 xl:flex-row xl:items-end flex-col-reverse flex gap-10 xl:overflow-hidden w-full min-w-0 max-w-full'>
			<div className='flex flex-col justify-end flex-[0.75] p-8 pb-16 rounded-2xl items-center text-center xl:items-start xl:text-left w-full min-w-0 translate-y-[96px] xl:translate-y-0'>
				<div className='flex items-center justify-center gap-3 xl:justify-start'>
					<span className='h-px w-9 bg-tertiary' />
					<p className='text-[13px] font-semibold uppercase tracking-[0.25em] text-tertiary'>
						<Typewriter content={t("contact.subtitle")} speed={26} startDelay={60} />
					</p>
				</div>

				<h3 className={`${styles.sectionHeadText} !text-center xl:!text-left !text-black-200 mt-3`}><Typewriter content={t("contact.title")} speed={26} startDelay={120} /></h3>

				<p className='mt-5 max-w-md text-[16px] leading-7 text-black-100/70'>
					{t("contact.description")}
				</p>

				<div className='mt-8 flex w-full max-w-md flex-col gap-3 text-left'>
					{/* WhatsApp */}
					<a
						href={WHATSAPP_URL}
						target='_blank'
						rel='noopener noreferrer'
						aria-label={t("contact.whatsappCta")}
						className='group flex items-center gap-4 rounded-2xl border border-black-100/10 bg-white/50 px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#25D366]/50 hover:bg-white hover:shadow-lg hover:shadow-[#25D366]/10'>
						<span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#1aa851] transition-transform duration-300 group-hover:scale-110'>
							<svg width='22' height='22' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
								<path d='M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.599 5.397l-.999 3.648 3.889-1.022zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.299-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z' />
							</svg>
						</span>
						<span className='flex min-w-0 flex-col'>
							<span className='text-[11px] font-semibold uppercase tracking-wider text-black-100/60'>WhatsApp</span>
							<span className='truncate text-[15px] font-semibold text-black-200'>{WHATSAPP_DISPLAY}</span>
						</span>
						<ArrowIcon />
					</a>

					{/* Email */}
					<a
						href={`mailto:${EMAIL}`}
						aria-label={t("contact.emailCta")}
						className='group flex items-center gap-4 rounded-2xl border border-black-100/10 bg-white/50 px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-tertiary/40 hover:bg-white hover:shadow-lg hover:shadow-tertiary/10'>
						<span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tertiary/10 text-tertiary transition-transform duration-300 group-hover:scale-110'>
							<svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
								<rect x='2' y='4' width='20' height='16' rx='2' />
								<path d='m22 7-10 5L2 7' />
							</svg>
						</span>
						<span className='flex min-w-0 flex-col'>
							<span className='text-[11px] font-semibold uppercase tracking-wider text-black-100/60'>Email</span>
							<span className='truncate text-[15px] font-semibold text-black-200'>{EMAIL}</span>
						</span>
						<ArrowIcon />
					</a>
				</div>
			</div>

			<div className='xl:flex-1 -translate-y-[96px] xl:-translate-y-16 w-full min-w-0 max-w-full overflow-hidden h-[440px] sm:h-[540px] md:h-[620px] xl:h-[660px]'>
				<Suspense fallback={null}>
					<EarthCanvasLazy sectionIndex={6} />
				</Suspense>
			</div>
		</div>
	);
};

export default SectionWrapper(Contact, "contact");
