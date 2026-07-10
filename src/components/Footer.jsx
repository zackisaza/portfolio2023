import { wolfcave } from "../assets";
import { useLanguage } from "../context/LanguageContext";

const SOCIALS = [
	{
		label: "LinkedIn",
		href: "https://www.linkedin.com/in/zackisaza/",
		icon: (
			<svg width='22' height='22' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
				<path d='M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7 0h3.83v2.05h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.79 2.66 4.79 6.12V23h-4v-6.6c0-1.57-.03-3.6-2.19-3.6-2.2 0-2.53 1.71-2.53 3.48V23h-4V8z' />
			</svg>
		),
	},
	{
		label: "GitHub",
		href: "https://github.com/zackisaza",
		icon: (
			<svg width='22' height='22' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
				<path d='M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58C20.56 22.29 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z' />
			</svg>
		),
	},
	{
		label: "WhatsApp",
		href: "https://wa.me/573226144416",
		icon: (
			<svg width='22' height='22' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
				<path d='M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.599 5.397l-.999 3.648 3.889-1.022zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.299-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z' />
			</svg>
		),
	},
	{
		label: "Email",
		href: "mailto:zackisaza@gmail.com",
		icon: (
			<svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
				<rect x='2' y='4' width='20' height='16' rx='2' />
				<path d='m22 7-10 5L2 7' />
			</svg>
		),
	},
];

const Footer = () => {
	const { t } = useLanguage();
	const year = new Date().getFullYear();

	return (
		<footer className='relative z-0 bg-[#f2f2f2] text-black-200'>
			<div className='w-full px-6 sm:px-16 lg:px-24 py-14'>
				<div className='flex flex-col gap-10 md:flex-row md:items-start md:justify-between'>
					{/* Brand */}
					<div className='max-w-sm'>
						<div className='flex items-center gap-3'>
							<img
								src={wolfcave}
								alt='Zack Isaza'
								width='56'
								height='56'
								className='h-14 w-14 object-contain'
							/>
							<span className='text-2xl font-bold tracking-tight'>Zack Isaza</span>
						</div>
						<p className='mt-4 text-base leading-7 text-black-100/85'>{t("footer.tagline")}</p>
					</div>

					{/* Socials */}
					<div className='flex flex-col gap-4 md:items-end'>
						<span className='text-[13px] font-semibold uppercase tracking-wider text-black-100/70'>
							{t("footer.followMe")}
						</span>
						<div className='flex items-center gap-3'>
							{SOCIALS.map((s) => (
								<a
									key={s.label}
									href={s.href}
									target={s.href.startsWith("http") ? "_blank" : undefined}
									rel='noopener noreferrer'
									aria-label={s.label}
									className='flex h-12 w-12 items-center justify-center rounded-full border border-black-100/30 text-black-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-tertiary hover:text-tertiary hover:bg-tertiary/5'>
									{s.icon}
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className='mt-12 flex flex-col items-center justify-between gap-3 border-t border-black-100/20 pt-6 sm:flex-row'>
					<p className='text-sm text-black-100/75'>
						© {year} Zack Isaza. {t("footer.rights")}
					</p>
					<p className='text-sm text-black-100/70'>{t("footer.builtWith")}</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
