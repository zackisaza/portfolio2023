import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
// Lazy-load EarthCanvas to defer three.js until the contact section is viewed
const EarthCanvasLazy = lazy(() => import("./canvas/Earth"));
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { useLanguage } from "../context/LanguageContext";
import Typewriter from "./Typewriter";

// EmailJS config now supports Vite env variables:
// VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID

const Contact = () => {

	const formRef = useRef();
	const { t } = useLanguage();

	const [form, setForm] = useState({
		name: "",
		email: "",
		message: "",
	});

	const [loading, setLoading] = useState(false);

	// Toast state for nicer success/error notifications
	const [toast, setToast] = useState({ show: false, type: "success", message: "" });
	const toastTimerRef = useRef(null);

	useEffect(() => {
		return () => {
			if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
		};
	}, []);

	// Resolve EmailJS credentials from env with safe fallbacks
	const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "e_fKwZtRAVy2098dr";
	const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_dbzshnj";
	const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_57z8tt8";

	const handleChange = (e) => {

		const { name, value } = e.target;

		setForm({
			...form,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const emailjs = (await import("@emailjs/browser")).default;
			await emailjs.send(
				EMAILJS_SERVICE_ID,
				EMAILJS_TEMPLATE_ID,
				{
					from_name: form.name,
					to_name: "Zett Isaza",
					from_email: form.email,
					to_email: "cowboyzett@gmail.com",
					reply_to: form.email,
					message: form.message,
				},
				EMAILJS_PUBLIC_KEY
			);
			setLoading(false);
			if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
			setToast({ show: true, type: "success", message: t("contact.success") });
			toastTimerRef.current = setTimeout(() => {
				setToast((prev) => ({ ...prev, show: false }));
			}, 3500);
			setForm({ name: "", email: "", message: "" });
		} catch (error) {
			setLoading(false);
			console.error(error);
			if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
			setToast({ show: true, type: "error", message: t("contact.error") });
			toastTimerRef.current = setTimeout(() => {
				setToast((prev) => ({ ...prev, show: false }));
			}, 4000);
		}
	};

	return (
		<div className='xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden'>
			<motion.div
				variants={slideIn("left", "tween", 0.2, 1)}
				className='flex-[0.75] p-8 rounded-2xl'>
				<p className={styles.sectionSubText}><Typewriter content={t("contact.subtitle")} speed={26} startDelay={60} /></p>
				<h3 className={styles.sectionHeadText}><Typewriter content={t("contact.title")} speed={26} startDelay={120} /></h3>

				<form
					ref={formRef}
					onSubmit={handleSubmit}
					className='mt-12 flex flex-col gap-8'>
					<label className='flex flex-col'>
						<span className='text-white-100 font-medium mb-4'>
							{t("contact.nameLabel")}
						</span>
						<input
							type='text'
							name='name'
							value={form.name}
							onChange={handleChange}
							placeholder={t("contact.namePlaceholder")}
							className='bg-white-100 py-4 px-6 placeholder:text-black-100/60 text-black-200 rounded-lg outline-none border border-black-100/20 font-medium'
						/>
					</label>
					<label className='flex flex-col'>
						<span className='text-white-100 font-medium mb-4'>
							{t("contact.emailLabel")}
						</span>
						<input
							type='email'
							name='email'
							value={form.email}
							onChange={handleChange}
							placeholder={t("contact.emailPlaceholder")}
							className='bg-white-100 py-4 px-6 placeholder:text-black-100/60 text-black-200 rounded-lg outline-none border border-black-100/20 font-medium'
						/>
					</label>
					<label className='flex flex-col'>
						<span className='text-white-100 font-medium mb-4'>
							{t("contact.messageLabel")}
						</span>
						<textarea
							rows='7'
							name='message'
							value={form.message}
							onChange={handleChange}
							placeholder={t("contact.messagePlaceholder")}
							className='bg-white-100 py-4 px-6 placeholder:text-black-100/60 text-black-200 rounded-lg outline-none border border-black-100/20 font-medium'
						/>
					</label>
				<motion.button
					type='submit'
					disabled={loading}
					aria-busy={loading}
					className='inline-block relative z-20 py-2 px-6 outline-none w-fit text-white font-semibold rounded-lg overflow-hidden border-2 border-white bg-transparent cursor-pointer transition-colors duration-200 ease-in-out hover:bg-white hover:text-black hover:border-white disabled:opacity-60 disabled:cursor-not-allowed'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					animate={{ scale: [1, 1.02, 1] }}
					transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
				>
					<span className='relative z-10'>
						{loading ? t("contact.sending") : t("contact.send")}
					</span>
				</motion.button>
				</form>
			</motion.div>
			<motion.div
				variants={slideIn("right", "tween", 0.2, 1)}
				className='xl:flex-1 xl:h-auto md:h[550px] h-[350px]'>
				<Suspense fallback={null}>
					<EarthCanvasLazy sectionIndex={6} />
				</Suspense>
			</motion.div>
			{/* Toast notification */}
			<div className="fixed bottom-6 right-6 z-[100]">
				{toast.show && (
					<motion.div
						initial={{ opacity: 0, y: 12, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.98 }}
						transition={{ type: "spring", stiffness: 310, damping: 22 }}
						className={`shadow-lg rounded-xl px-4 py-3 min-w-[260px] max-w-[340px] border backdrop-blur-md ${
							toast.type === "success"
								? "bg-green-500/90 border-green-400/50 text-white"
								: "bg-red-500/90 border-red-400/50 text-white"
						}`}
						role="status"
						aria-live="polite"
					>
						<div className="flex items-start gap-3">
							<div className="mt-0.5">
								{toast.type === "success" ? (
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
										<path fillRule="evenodd" d="M2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0zm13.36-2.31a.75.75 0 10-1.22-.88l-3.44 4.78-2.02-2.02a.75.75 0 10-1.06 1.06l2.63 2.63a.75.75 0 001.16-.1l4.95-6.47z" clipRule="evenodd" />
									</svg>
								) : (
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
										<path fillRule="evenodd" d="M2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0zm12.53-3.53a.75.75 0 10-1.06-1.06L12 9.94 10.28 8.22a.75.75 0 10-1.06 1.06L10.94 11l-1.72 1.72a.75.75 0 101.06 1.06L12 12.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 11l1.72-1.72z" clipRule="evenodd" />
									</svg>
								)}
							</div>
							<div className="text-sm leading-5 font-medium">
								{toast.message}
							</div>
							<button
								className="ml-auto shrink-0 rounded-md/80 hover:opacity-90 focus:outline-none"
								onClick={() => setToast((prev) => ({ ...prev, show: false }))}
								aria-label="Close notification"
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
									<path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
								</svg>
							</button>
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default SectionWrapper(Contact, "contact");
