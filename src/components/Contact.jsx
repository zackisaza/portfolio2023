import { useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

//e_fKwZtRAVy2098dr
//template_57z8tt8
//service_dbzshnj

const Contact = () => {

	const formRef = useRef();

	const [form, setForm] = useState({
		name: "",
		email: "",
		message: "",
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {

		const { name, value } = e.target;

		setForm({
			...form,
			[name]: value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);

		emailjs
			.send(
				"service_dbzshnj",
				"template_57z8tt8",
				{
					from_name: form.name,
					to_name: "Zett Isaza",
					from_email: form.email,
					to_email: "cowboyzett@gmail.com",
					message: form.message,
				},
				"e_fKwZtRAVy2098dr"
			)
			.then(() => {
				setLoading(false);
				alert("Thank you. I will get back to you as soon as possible.");

				setForm({
					name: "",
					email: "",
					message: "",
				});
			})
			.catch((error) => {
				setLoading(false);
				console.error(error);

				alert("Something went wrong. Please try again.");
			});
	};

	return (
		<div className='xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden'>
			<motion.div
				variants={slideIn("left", "tween", 0.2, 1)}
				className='flex-[0.75] p-8 rounded-2xl'>
				<p className={styles.sectionSubText}>Get in touch</p>
				<h3 className={styles.sectionHeadText}>Contact.</h3>

				<form
					ref={formRef}
					onSubmit={handleSubmit}
					className='mt-12 flex flex-col gap-8'>
					<label className='flex flex-col'>
						<span className='text-white-100 font-medium mb-4'>Your name:</span>
						<input
							type='text'
							name='name'
							value={form.name}
							onChange={handleChange}
							placeholder="What's your name?"
							className='bg-white-100 py-4 px-6 placeholder:text-black-100/60 text-black-200 rounded-lg outline-none border border-black-100/20 font-medium'
						/>
					</label>
					<label className='flex flex-col'>
						<span className='text-white-100 font-medium mb-4'>Your email:</span>
						<input
							type='email'
							name='email'
							value={form.email}
							onChange={handleChange}
							placeholder="What's your email?"
							className='bg-white-100 py-4 px-6 placeholder:text-black-100/60 text-black-200 rounded-lg outline-none border border-black-100/20 font-medium'
						/>
					</label>
					<label className='flex flex-col'>
						<span className='text-white-100 font-medium mb-4'>
							Your message:
						</span>
						<textarea
							rows='7'
							name='message'
							value={form.message}
							onChange={handleChange}
							placeholder='What do you want to say?'
							className='bg-white-100 py-4 px-6 placeholder:text-black-100/60 text-black-200 rounded-lg outline-none border border-black-100/20 font-medium'
						/>
					</label>
				<motion.button
					type='submit'
					className='relative py-3 px-8 outline-none w-fit text-white-100 font-semibold shadow-md shadow-primary rounded-xl overflow-hidden'
					animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
					transition={{ duration: 2.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}>
					<span className='absolute inset-0 bg-gradient-to-r from-[#8b1120] via-[#c02035] to-[#8b1120] opacity-90 transition-opacity duration-200 hover:opacity-100' />
					<span className='relative z-10'>{loading ? "Sending..." : "Send"}</span>
				</motion.button>
				</form>
			</motion.div>
			<motion.div
				variants={slideIn("right", "tween", 0.2, 1)}
				className='xl:flex-1 xl:h-auto md:h[550px] h-[350px]'>
				<EarthCanvas />
			</motion.div>
			<div>
				
			</div>
		</div>
	);
};

export default SectionWrapper(Contact, "contact");
