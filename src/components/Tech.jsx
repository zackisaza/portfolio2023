import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { technologies } from "../constants";
import { useLanguage } from "../context/LanguageContext";
import "./sushiroom.css";

// Tech list: some icons come bundled from the `technologies` constant, the rest
// from public/tech-icons/*.svg.
const CONST = Object.fromEntries(technologies.map((tech) => [tech.id, tech]));
const c = (id) => {
	const tech = CONST[id];
	return tech ? { key: id, name: tech.name.en, icon: tech.icon } : null;
};
const p = (key, name, file) => ({ key, name, icon: `/tech-icons/${file}.svg` });

const TECHS = [
	c("react"), c("nextjs"), c("typescript"), c("javascript"), c("tailwind"), c("redux"),
	p("vite", "Vite", "vite"), p("framer", "Framer Motion", "framer"), p("pwa", "PWA", "pwa"),
	c("node"), c("python"), c("django"),
	p("nestjs", "NestJS", "nestjs"), p("express", "Express", "express"), p("fastapi", "FastAPI", "fastapi"),
	p("laravel", "Laravel", "laravel"), p("graphql", "GraphQL", "graphql"),
	c("aws"), c("docker"), c("kubernetes"),
	p("githubactions", "GitHub Actions", "githubactions"), p("terraform", "Terraform", "terraform"),
	p("nginx", "Nginx", "nginx"), p("grafana", "Grafana", "grafana"), p("serverless", "Serverless", "serverless"),
	c("mongodb"), c("postgrest"),
	p("postgresql", "PostgreSQL", "postgresql"), p("mysql", "MySQL", "mysql"), p("redis", "Redis", "redis"), p("kafka", "Kafka", "kafka"),
].filter(Boolean);

// The pen's original sushi variants (class names per plate).
const SUSHI = [
	["rice", "salmon", "seaweed"],
	["rice", "salmon", "seaweed3"],
	["rice2", "rice3", "rice4"],
	["rice", "tuna", "seaweed"],
	["rice", "roe", "seaweed2"],
];

const BLURBS = {
	react: { en: "Library for building component-based UIs.", es: "Librería para construir UIs por componentes." },
	nextjs: { en: "React framework with SSR, routing & more.", es: "Framework de React con SSR, routing y más." },
	typescript: { en: "Typed JavaScript that scales.", es: "JavaScript tipado que escala." },
	javascript: { en: "The language of the web.", es: "El lenguaje de la web." },
	tailwind: { en: "Utility-first CSS framework.", es: "Framework CSS utility-first." },
	redux: { en: "Predictable state management.", es: "Manejo de estado predecible." },
	vite: { en: "Lightning-fast build tool & dev server.", es: "Build tool y dev server ultrarrápido." },
	framer: { en: "Declarative animations for React.", es: "Animaciones declarativas para React." },
	pwa: { en: "Installable, offline-capable web apps.", es: "Apps web instalables y offline." },
	node: { en: "JavaScript runtime for servers.", es: "Runtime de JavaScript en el servidor." },
	python: { en: "Versatile language for backend & AI.", es: "Lenguaje versátil para backend e IA." },
	django: { en: "Batteries-included Python web framework.", es: "Framework web de Python muy completo." },
	nestjs: { en: "Structured, scalable Node.js framework.", es: "Framework de Node.js estructurado y escalable." },
	express: { en: "Minimal, fast Node.js web framework.", es: "Framework web minimal y rápido de Node.js." },
	fastapi: { en: "High-performance Python APIs.", es: "APIs de Python de alto rendimiento." },
	laravel: { en: "Elegant PHP web framework.", es: "Framework web elegante de PHP." },
	graphql: { en: "Ask APIs for exactly what you need.", es: "APIs que devuelven justo lo que pedís." },
	aws: { en: "Cloud infrastructure at scale.", es: "Infraestructura cloud a escala." },
	docker: { en: "Containerize apps to run anywhere.", es: "Contenedores para correr en cualquier lado." },
	kubernetes: { en: "Orchestrate containers at scale.", es: "Orquestación de contenedores a escala." },
	githubactions: { en: "CI/CD pipelines right in your repo.", es: "Pipelines CI/CD dentro de tu repo." },
	terraform: { en: "Infrastructure as code.", es: "Infraestructura como código." },
	nginx: { en: "High-performance web server & proxy.", es: "Servidor web y proxy de alto rendimiento." },
	grafana: { en: "Dashboards & observability.", es: "Dashboards y observabilidad." },
	serverless: { en: "Run code without managing servers.", es: "Código sin gestionar servidores." },
	mongodb: { en: "Flexible NoSQL document database.", es: "Base NoSQL de documentos flexible." },
	postgrest: { en: "Instant REST API from your Postgres schema.", es: "API REST instantánea desde tu esquema Postgres." },
	postgresql: { en: "Powerful open-source relational DB.", es: "Base relacional open-source potente." },
	mysql: { en: "Popular relational database.", es: "Base de datos relacional popular." },
	redis: { en: "In-memory data store & cache.", es: "Store en memoria y caché." },
	kafka: { en: "Distributed event streaming.", es: "Streaming de eventos distribuido." },
};
const blurbFor = (key) => BLURBS[key] ?? null;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// The clicked flag's on-screen rect is measured, then a card grows FROM that
// spot (staying in place, not centred like a popup) to reveal the tech data.
const TechDetail = ({ selected, language, onClose, onExitComplete }) => {
	const blurb = selected ? blurbFor(selected.tech.key) : null;
	let box = null;
	if (selected) {
		const r = selected.rect;
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const W = Math.min(340, vw - 32);
		const H = Math.min(320, vh - 32);
		const left = clamp(r.left + r.width / 2 - W / 2, 12, vw - W - 12);
		const top = clamp(r.top + r.height / 2 - H / 2, 12, vh - H - 12);
		box = { start: r, W, H, left, top };
	}
	return createPortal(
		<AnimatePresence onExitComplete={onExitComplete}>
			{selected && box && (
				<>
					<motion.div className='sr-expand-back' onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
					<motion.div
						className='sr-expand'
						onClick={(e) => e.stopPropagation()}
						initial={{ top: box.start.top, left: box.start.left, width: box.start.width, height: box.start.height, borderRadius: 9, opacity: 0.4 }}
						animate={{ top: box.top, left: box.left, width: box.W, height: box.H, borderRadius: 18, opacity: 1 }}
						exit={{ top: box.start.top, left: box.start.left, width: box.start.width, height: box.start.height, borderRadius: 9, opacity: 0 }}
						transition={{ type: "spring", stiffness: 260, damping: 26 }}
					>
						<motion.div
							className='sr-expand-inner'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0.12 } }}
							exit={{ opacity: 0, transition: { duration: 0.08 } }}
						>
							<button className='sr-expand-x' onClick={onClose} aria-label='Close'>×</button>
							<div className='sr-expand-disc'>
								<img src={selected.tech.icon} alt={selected.tech.name} />
							</div>
							<h3>{selected.tech.name}</h3>
							<p>{blurb ? blurb[language] ?? blurb.en : ""}</p>
							<span className='sr-tag'>技 · TECH</span>
						</motion.div>
					</motion.div>
				</>
			)}
		</AnimatePresence>,
		document.body
	);
};

// Sushi room ported verbatim from CodePen rjmr/gQqaYr. The 620x400 pen scene is
// scaled up to fill the whole section width via a transform on `.world`. The
// original 5 animated plates are replaced by a seamless kaiten conveyor of the
// full tech stack — each sushi carries a pick-flag with its logo.
const Tech = () => {
	const { t, language } = useLanguage();
	const [selected, setSelected] = useState(null); // { id, tech }
	const [frozen, setFrozen] = useState(false); // pause the belt while a flag is expanded
	const worldRef = useRef(null);
	const [scale, setScale] = useState(1);
	const [offsetX, setOffsetX] = useState(0);

	useEffect(() => {
		const el = worldRef.current;
		if (!el) return;
		const update = () => {
			const w = el.clientWidth;
			// Desktop fits the whole 620px scene to the width. Mobile zooms IN so the
			// sushi + logos read at a usable size; the overscan is clipped by
			// .sushi-world's overflow:hidden and re-centred via offsetX.
			const zoom = window.innerWidth < 768 ? 2.04 : 1;
			const s = (w / 620) * zoom;
			setScale(s);
			setOffsetX((w - 620 * s) / 2);
		};
		update();
		const ro = new ResizeObserver(update);
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	const open = (tech, domRect) => {
		setFrozen(true);
		setSelected({ tech, rect: { top: domRect.top, left: domRect.left, width: domRect.width, height: domRect.height } });
	};

	// Duplicate the list so translateX(-50%) loops without a visible jump.
	const belt = [...TECHS, ...TECHS];

	return (
		<section className='relative z-0 w-full'>
			<span className='hash-span' id='tech'>&nbsp;</span>

			<div className='tech-sign-wrap'>
				<div className='tech-noren'>
					<span className='tech-seal' aria-hidden='true'>匠</span>
					<p className='tech-sub'>{t("tech.subtitle")}</p>
					<h2 className='tech-title'>{t("tech.title")}</h2>
					<span className='tech-kanji' aria-hidden='true'>技術・寿司</span>
				</div>
			</div>

			<div className='sushi-world' ref={worldRef} style={{ height: `${400 * scale}px` }}>
				<div className='world' style={{ transform: `translateX(${offsetX}px) scale(${scale})` }}>
					<div className='room'>
						<div className='lantern'>
							<span><a>光</a></span>
							<span><a>金</a></span>
							<span><a>光</a></span>
							<span><a>金</a></span>
						</div>
						<div className='windows'>
							<span />
							<span />
							<span />
						</div>
						<div className='panel'>
							<span />
							<span />
							<span />
							<span />
							<span />
							<span />
							<span />
							<span />
							<span />
							<span />
						</div>
						<div className='tabletop' />
						<div className='table' />
						<div className='cup'>
							<span />
							<span />
							<span />
						</div>
						<div className='chopsticks' />

						<div className='plate'>
							<span />
							<span />
							<span />
							<span />
							<span />
							<span />
							<span />
						</div>
						<div className='wasabi-pot' />
						<div className='chopstick-pot' />

						<div className='chopsticks2' />
						<div className='chopsticks3' />
						<div className='wasabi' />
						<div className='belt' />

						<div className='kaiten'>
							<div className='sushiplate kaiten-track' style={frozen ? { animationPlayState: "paused" } : undefined}>
								{belt.map((tech, i) => (
									<div
										className='kaiten-plate'
										key={`${tech.key}-${i}`}
										onClick={(e) => {
											const flag = e.currentTarget.querySelector(".kaiten-flag");
											open(tech, (flag || e.currentTarget).getBoundingClientRect());
										}}
										title={tech.name}
									>
										<div className='kaiten-pick' aria-hidden='true' />
										<div className='kaiten-flag'>
											<img src={tech.icon} alt={tech.name} loading='lazy' />
											<div className='sr-name'>{tech.name}</div>
										</div>
										{SUSHI[i % SUSHI.length].map((cls, j) => (
											<div key={j} className={cls} />
										))}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			<TechDetail
				selected={selected}
				language={language}
				onClose={() => setSelected(null)}
				onExitComplete={() => setFrozen(false)}
			/>
		</section>
	);
};

export default Tech;
