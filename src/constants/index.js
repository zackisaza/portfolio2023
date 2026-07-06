import {
    javascript,
    typescript,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    aws,
    docker,
    kubernetes,
    python,
    nextjs,
    django,
    postgrest,
    independent,
    systemlife,
    conversion,
    soluciones,
    customSoftware,
    frontendService,
    backendService,
    designService,
    architectureService,
    automationService,
} from "../assets";

export const navLinks = [
    {
        id: "about",
        title: {
            en: "About",
            es: "Sobre mí",
        },
    },
    {
        id: "projects",
        title: {
            en: "Projects",
            es: "Proyectos",
        },
    },
    {
        id: "experience",
        title: {
            en: "Experience",
            es: "Experiencia",
        },
    },
    {
        id: "tech",
        title: {
            en: "Stack",
            es: "Stack",
        },
    },
    {
        id: "services",
        title: {
            en: "Services",
            es: "Servicios",
        },
    },
    {
        id: "mycompany",
        title: {
            en: "My Startup",
            es: "Mi Startup",
        },
    },
    {
        id: "build",
        title: {
            en: "Build",
            es: "El Código",
        },
    },
    {
        id: "contact",
        title: {
            en: "Contact",
            es: "Contacto",
        },
    },
];

const services = [
    {
        id: "service-mastery",
        title: {
            en: "Deep technical mastery",
            es: "Maestría técnica profunda",
        },
        description: {
            en: "Data structures, algorithms, databases, concurrency, and system architecture.",
            es: "Estructuras de datos, algoritmos, bases de datos, concurrencia y arquitectura de sistemas.",
        },
        icon: "mastery",
    },
    {
        id: "service-system",
        title: {
            en: "System design & scalability",
            es: "Diseño de sistemas y escalabilidad",
        },
        description: {
            en: "Distributed systems, queues, caching, microservices, and load balancing end-to-end.",
            es: "Sistemas distribuidos, colas, cachés, microservicios y balanceo de carga de extremo a extremo.",
        },
        icon: "system",
    },
    {
        id: "service-devops",
        title: {
            en: "Automation & DevOps",
            es: "Automatización y DevOps",
        },
        description: {
            en: "CI/CD pipelines, Docker, Kubernetes, Git, testing, and cloud deployment.",
            es: "Pipelines CI/CD, Docker, Kubernetes, Git, pruebas y despliegues en la nube.",
        },
        icon: "devops",
    },
    {
        id: "service-leadership",
        title: {
            en: "Technical leadership",
            es: "Liderazgo técnico",
        },
        description: {
            en: "Code reviews, mentoring, architectural communication, and quality enforcement.",
            es: "Code reviews, mentoría, comunicación arquitectónica y garantía de calidad.",
        },
        icon: "leadership",
    },
];

const technologies = [
    {
        id: "javascript",
        name: {
            en: "JavaScript",
            es: "JavaScript",
        },
        icon: javascript,
    },
    {
        id: "typescript",
        name: {
            en: "TypeScript",
            es: "TypeScript",
        },
        icon: typescript,
    },
    {
        id: "react",
        name: {
            en: "React JS",
            es: "React JS",
        },
        icon: reactjs,
    },
    {
        id: "redux",
        name: {
            en: "Redux Toolkit",
            es: "Redux Toolkit",
        },
        icon: redux,
    },
    {
        id: "tailwind",
        name: {
            en: "Tailwind CSS",
            es: "Tailwind CSS",
        },
        icon: tailwind,
    },
    {
        id: "node",
        name: {
            en: "Node JS",
            es: "Node JS",
        },
        icon: nodejs,
    },
    {
        id: "mongodb",
        name: {
            en: "MongoDB",
            es: "MongoDB",
        },
        icon: mongodb,
    },
    {
        id: "aws",
        name: {
            en: "AWS",
            es: "AWS",
        },
        icon: aws,
    },
    {
        id: "docker",
        name: {
            en: "Docker",
            es: "Docker",
        },
        icon: docker,
    },
    {
        id: "kubernetes",
        name: {
            en: "Kubernetes",
            es: "Kubernetes",
        },
        icon: kubernetes,
    },
    {
        id: "python",
        name: {
            en: "Python",
            es: "Python",
        },
        icon: python,
    },
    {
        id: "nextjs",
        name: {
            en: "Next.js",
            es: "Next.js",
        },
        icon: nextjs,
    },
    {
        id: "django",
        name: {
            en: "Django",
            es: "Django",
        },
        icon: django,
    },
    {
        id: "postgrest",
        name: {
            en: "PostgREST",
            es: "PostgREST",
        },
        icon: postgrest,
    },
];

const experiences = [
    {
        id: "experience-senior-backend",
        icon: conversion,
        iconBg: "#000",
        translations: {
            en: {
                title: "Senior Backend Engineer",
                company_name: "Conversion Monster – Buffalo, NY (Remote)",
                date: "Jun 2024 – Present",
                points: [
                    "Leading <b>backend architecture</b> and <b>modernization</b> using <b>Node.js</b> (NestJS), <b>Python</b> (FastAPI), and <b>PHP</b> (Laravel 11).",
                    "Designed and maintained <b>microservice-based systems</b> with <b>PostgreSQL</b>, <b>MongoDB</b>, and <b>Redis</b>, ensuring <b>scalability</b> and <b>fault tolerance</b>.",
                    "Deployed and monitored <b>production systems</b> using <b>Docker</b>, <b>Kubernetes</b>, and <b>AWS ECS/Lambda</b>.",
                    "Implemented <b>event-driven architecture</b> with <b>RabbitMQ</b> and <b>Kafka</b> for <b>asynchronous workflows</b>.",
                    "Improved <b>CI/CD automation pipelines</b> using <b>GitHub Actions</b>, <b>Terraform</b>, and <b>AWS CodeBuild</b>.",
                    "Mentored developers, conducted <b>code reviews</b>, and enforced <b>clean architecture</b> and <b>DDD principles</b> across the team.",
                ],
            },
            es: {
                title: "Ingeniero Backend Senior",
                company_name: "Conversion Monster – Búfalo, NY (Remoto)",
                date: "Jun 2024 – Presente",
                points: [
                    "Lidero la <b>arquitectura backend</b> y la <b>modernización</b> usando <b>Node.js</b> (NestJS), <b>Python</b> (FastAPI) y <b>PHP</b> (Laravel 11).",
                    "Diseñé y mantuve <b>sistemas basados en microservicios</b> con <b>PostgreSQL</b>, <b>MongoDB</b> y <b>Redis</b>, asegurando <b>escalabilidad</b> y <b>tolerancia a fallos</b>.",
                    "Despliego y monitorizo <b>sistemas en producción</b> con <b>Docker</b>, <b>Kubernetes</b> y <b>AWS ECS/Lambda</b>.",
                    "Implementé <b>arquitecturas dirigidas por eventos</b> con <b>RabbitMQ</b> y <b>Kafka</b> para <b>flujos asíncronos</b>.",
                    "Optimicé <b>pipelines de automatización CI/CD</b> con <b>GitHub Actions</b>, <b>Terraform</b> y <b>AWS CodeBuild</b>.",
                    "Guío a otros desarrolladores, realizo <b>code reviews</b> y refuerzo principios de <b>arquitectura limpia</b> y <b>DDD</b> en el equipo.",
                ],
            },
        },
    },
    {
        id: "experience-mid-senior",
        icon: conversion,
        iconBg: "#000",
        translations: {
            en: {
                title: "Mid–Senior Backend Engineer",
                company_name: "Conversion Monster – Buffalo, NY (Remote)",
                date: "Nov 2023 – Jun 2024",
                points: [
                    "Developed and maintained <b>RESTful</b> and <b>GraphQL APIs</b> using <b>Node.js</b> (Express) and <b>Python</b> (Django).",
                    "Migrated <b>monolithic systems</b> into <b>modular services</b>, improving <b>performance</b> and <b>maintainability</b>.",
                    "Integrated <b>AWS services</b> (S3, EC2, RDS) and optimized data handling with <b>PostgreSQL</b> and <b>MongoDB</b>.",
                    "Implemented <b>containerized environments</b> using <b>Docker</b> and introduced <b>Git-based deployment workflows</b>.",
                    "Collaborated with <b>frontend</b>, <b>QA</b>, and <b>product teams</b> to ensure efficient feature delivery and system stability.",
                ],
            },
            es: {
                title: "Ingeniero Backend Semi Senior",
                company_name: "Conversion Monster – Búfalo, NY (Remoto)",
                date: "Nov 2023 – Jun 2024",
                points: [
                    "Desarrollé y mantuve <b>APIs REST</b> y <b>GraphQL</b> con <b>Node.js</b> (Express) y <b>Python</b> (Django).",
                    "Migré <b>sistemas monolíticos</b> a <b>servicios modulares</b>, mejorando el <b>rendimiento</b> y la <b>mantenibilidad</b>.",
                    "Integré <b>servicios de AWS</b> (S3, EC2, RDS) y optimicé el manejo de datos con <b>PostgreSQL</b> y <b>MongoDB</b>.",
                    "Implementé <b>entornos containerizados</b> con <b>Docker</b> e introduje <b>flujos de despliegue basados en Git</b>.",
                    "Colaboré con los equipos de <b>frontend</b>, <b>QA</b> y <b>producto</b> para asegurar entregas eficientes y sistemas estables.",
                ],
            },
        },
    },
    {
        id: "experience-frontend",
        icon: soluciones,
        iconBg: "#000",
        translations: {
            en: {
                title: "Front-End Engineer",
                company_name: "Soluciones Star – Medellín, CO (Hybrid)",
                date: "Mar 2023 – Nov 2023",
                points: [
                    "Developed modern, <b>user-centric interfaces</b> using <b>React.js</b>, <b>Next.js</b>, and <b>TypeScript</b>.",
                    "Led <b>project deployments</b> with <b>Vercel</b>, collaborating closely with backend teams for <b>seamless integration</b>.",
                    "Focused on <b>performance optimization</b> and <b>accessibility best practices</b>.",
                ],
            },
            es: {
                title: "Ingeniero Front-End",
                company_name: "Soluciones Star – Medellín, CO (Híbrido)",
                date: "Mar 2023 – Nov 2023",
                points: [
                    "Desarrollé <b>interfaces modernas centradas en el usuario</b> con <b>React.js</b>, <b>Next.js</b> y <b>TypeScript</b>.",
                    "Lideré <b>despliegues en Vercel</b> colaborando con los equipos backend para <b>integraciones fluidas</b>.",
                    "Me enfoqué en la <b>optimización de rendimiento</b> y en las <b>mejores prácticas de accesibilidad</b>.",
                ],
            },
        },
    },
    {
        id: "experience-mid-level",
        icon: systemlife,
        iconBg: "#000",
        translations: {
            en: {
                title: "Mid–Level Software Engineer",
                company_name: "System Life – Armenia, CO (Remote)",
                date: "Sep 2021 – Mar 2023",
                points: [
                    "Led <b>backend development</b> for Manager-Pyme and Mr. Lukas <b>POS systems</b> using <b>Laravel</b> and <b>MySQL</b>.",
                    "Refactored <b>legacy modules</b>, improving <b>performance</b> and <b>maintainability</b> by over 30%.",
                    "Integrated <b>third-party APIs</b> and implemented custom <b>reporting dashboards</b> for clients.",
                    "Participated in <b>sprint planning</b>, <b>code reviews</b>, and <b>deployment automation</b>.",
                    "Mentored <b>junior developers</b> and contributed to improving <b>internal coding standards</b>.",
                ],
            },
            es: {
                title: "Ingeniero de Software Semi Senior",
                company_name: "System Life – Armenia, CO (Remoto)",
                date: "Sep 2021 – Mar 2023",
                points: [
                    "Lideré el <b>desarrollo backend</b> de Manager-Pyme y Mr. Lukas <b>POS</b> con <b>Laravel</b> y <b>MySQL</b>.",
                    "Refactoricé <b>módulos legados</b>, mejorando el <b>rendimiento</b> y la <b>mantenibilidad</b> en más de un 30%.",
                    "Integré <b>APIs de terceros</b> e implementé <b>tableros de reportes personalizados</b> para clientes.",
                    "Participé en la <b>planeación de sprints</b>, <b>code reviews</b> y <b>automatización de despliegues</b>.",
                    "Mentoricé a <b>desarrolladores junior</b> y ayudé a mejorar los <b>estándares internos de código</b>.",
                ],
            },
        },
    },
    {
        id: "experience-junior",
        icon: systemlife,
        iconBg: "#000",
        translations: {
            en: {
                title: "Junior Software Engineer",
                company_name: "System Life – Armenia, CO (Remote)",
                date: "Oct 2020 – Sep 2021",
                points: [
                    "Assisted in the development and maintenance of <b>POS</b> and <b>management systems</b> built on <b>Laravel</b> and <b>MySQL</b>.",
                    "Fixed bugs, improved <b>UI consistency</b>, and implemented small <b>backend modules</b>.",
                    "Gained experience with <b>Git</b>, <b>REST APIs</b>, and <b>responsive web interfaces</b>.",
                    "Collaborated closely with <b>designers</b> to ensure high-quality deliverables and <b>usability</b>.",
                ],
            },
            es: {
                title: "Ingeniero de Software Junior",
                company_name: "System Life – Armenia, CO (Remoto)",
                date: "Oct 2020 – Sep 2021",
                points: [
                    "Apoyé el desarrollo y mantenimiento de <b>sistemas POS</b> y de <b>gestión</b> construidos con <b>Laravel</b> y <b>MySQL</b>.",
                    "Corregí bugs, mejoré la <b>consistencia de la interfaz</b> e implementé pequeños <b>módulos backend</b>.",
                    "Gané experiencia con <b>Git</b>, <b>APIs REST</b> e <b>interfaces web responsivas</b>.",
                    "Colaboré de cerca con <b>diseñadores</b> para garantizar entregables de alta calidad y <b>usabilidad</b>.",
                ],
            },
        },
    },
    {
        id: "experience-freelance",
        icon: independent,
        iconBg: "#000",
        translations: {
            en: {
                title: "Freelance Developer",
                company_name: "Remote",
                date: "2019 – 2023",
                points: [
                    "Designed and developed <b>custom software solutions</b>, including <b>web platforms</b>, <b>management tools</b>, and <b>e-commerce systems</b>.",
                    "Built applications using <b>Laravel</b>, <b>React.js</b>, <b>Node.js</b>, and <b>Python</b>, integrating <b>REST APIs</b> and <b>cloud services</b>.",
                    "Delivered <b>end-to-end development</b> from planning to deployment for clients across <b>multiple industries</b>.",
                    "Provided ongoing <b>maintenance</b>, <b>optimizations</b>, and <b>feature upgrades</b> to ensure long-term software reliability.",
                ],
            },
            es: {
                title: "Desarrollador Freelance",
                company_name: "Remoto",
                date: "2019 – 2023",
                points: [
                    "Diseñé y desarrollé <b>soluciones de software a medida</b>, incluyendo <b>plataformas web</b>, <b>herramientas de gestión</b> y <b>sistemas e-commerce</b>.",
                    "Construí aplicaciones con <b>Laravel</b>, <b>React.js</b>, <b>Node.js</b> y <b>Python</b>, integrando <b>APIs REST</b> y <b>servicios en la nube</b>.",
                    "Entregué <b>desarrollos end-to-end</b> desde la planificación hasta el despliegue para clientes en <b>múltiples industrias</b>.",
                    "Brindé <b>mantenimiento continuo</b>, <b>optimizaciones</b> y <b>mejoras</b> para garantizar la confiabilidad del software a largo plazo.",
                ],
            },
        },
    },
];

const servicesShowcase = [
    {
        id: "service-custom-software",
        icon: customSoftware,
        translations: {
            en: {
                name: "Custom Software Platforms",
                description:
                    "Design and deliver resilient products tailored to your goals, from discovery to launch and ongoing evolution.",
                highlights: [
                    "Product discovery and scope definition",
                    "Iterative delivery with automated testing",
                    "Support, monitoring, and continuous improvement",
                ],
            },
            es: {
                name: "Plataformas de Software a Medida",
                description:
                    "Diseño y entrego productos resilientes adaptados a tus objetivos, desde el discovery hasta el lanzamiento y su evolución continua.",
                highlights: [
                    "Discovery y definición de alcance",
                    "Entrega iterativa con pruebas automatizadas",
                    "Soporte, monitoreo y mejora continua",
                ],
            },
        },
    },
    {
        id: "service-frontend",
        icon: frontendService,
        translations: {
            en: {
                name: "Frontend Experiences",
                description:
                    "Create pixel-perfect interfaces focused on accessibility, performance, and brand storytelling.",
                highlights: [
                    "Design system implementation",
                    "SSR/SPA builds with React & Next.js",
                    "Accessibility and performance tuning",
                ],
            },
            es: {
                name: "Experiencias Front-end",
                description:
                    "Creo interfaces pixel-perfect enfocadas en accesibilidad, rendimiento y narrativa de marca.",
                highlights: [
                    "Implementación de design systems",
                    "SSR/SPA con React y Next.js",
                    "Optimización de accesibilidad y performance",
                ],
            },
        },
    },
    {
        id: "service-backend",
        icon: backendService,
        translations: {
            en: {
                name: "Backend Systems & APIs",
                description:
                    "Build secure, observable services that scale with your workloads and integrations.",
                highlights: [
                    "Domain-driven architectures",
                    "High-availability APIs & event pipelines",
                    "Observability, tracing, and alerting",
                ],
            },
            es: {
                name: "Sistemas Backend y APIs",
                description:
                    "Construyo servicios seguros y observables que escalan con tus cargas e integraciones.",
                highlights: [
                    "Arquitecturas guiadas por el dominio",
                    "APIs de alta disponibilidad y eventos",
                    "Observabilidad, trazas y alertas",
                ],
            },
        },
    },
    {
        id: "service-design",
        icon: designService,
        translations: {
            en: {
                name: "Product & UX Design",
                description:
                    "Align product vision with intuitive user flows, prototypes, and polished UI systems.",
                highlights: [
                    "User journeys and wireframes",
                    "Interactive prototypes and usability loops",
                    "Design ops and documentation",
                ],
            },
            es: {
                name: "Diseño de Producto y UX",
                description:
                    "Alineo la visión del producto con flujos intuitivos, prototipos y sistemas UI pulidos.",
                highlights: [
                    "User journeys y wireframes",
                    "Prototipos interactivos y pruebas de uso",
                    "Documentación y design ops",
                ],
            },
        },
    },
    {
        id: "service-architecture",
        icon: architectureService,
        translations: {
            en: {
                name: "Software Architecture",
                description:
                    "Shape modular, future-proof architectures that balance delivery speed with governance.",
                highlights: [
                    "Architecture reviews and roadmaps",
                    "Migration plans for legacy systems",
                    "Security, compliance, and governance",
                ],
            },
            es: {
                name: "Arquitectura de Software",
                description:
                    "Diseño arquitecturas modulares y sostenibles que equilibran velocidad y gobierno.",
                highlights: [
                    "Assessments y roadmaps arquitectónicos",
                    "Planes de migración de sistemas legados",
                    "Gobierno, seguridad y cumplimiento",
                ],
            },
        },
    },
    {
        id: "service-automation",
        icon: automationService,
        translations: {
            en: {
                name: "Automation & AI Integrations",
                description:
                    "Automate workflows and infuse AI where it drives measurable impact for your teams.",
                highlights: [
                    "Process automation and orchestration",
                    "AI-enabled assistants and copilots",
                    "Observability and change management",
                ],
            },
            es: {
                name: "Automatización e Integraciones AI",
                description:
                    "Automatizo flujos e incorporo IA donde genera impacto medible para tu equipo.",
                highlights: [
                    "Automatización y orquestación de procesos",
                    "Asistentes y copilotos con IA",
                    "Observabilidad y gestión del cambio",
                ],
            },
        },
    },
];

// Real, shippable projects — ordered to lead with the strongest sales cases.
const projects = [
    {
        id: "project-managerpyme",
        image: "/projects/managerpyme.webp",
        status: "production", // "production" | "opensource" | "client"
        liveUrl: "https://managerpyme.com",
        repoUrl: null,
        repoPrivate: true,
        tags: ["Laravel", "PHP", "MySQL", "Docker", "Nginx", "AI"],
        metrics: [
            { value: "50+", label: { en: "Active clients", es: "Clientes activos" } },
            { value: "SaaS", label: { en: "Multi-tenant", es: "Multi-tenant" } },
        ],
        translations: {
            en: {
                name: "ManagerPyme",
                tagline: "Accounting & POS SaaS with DIAN electronic invoicing",
                description:
                    "Colombia's most complete <b>DIAN electronic-invoicing</b> SaaS, built on top of an ERP/POS base. I engineered the <b>fiscal localization</b>, an <b>AI assistance</b> module, a full <b>CMS/landing</b> redesign, dockerized the stack, and took it to production as a <b>multi-tenant SaaS with 50+ active clients</b>.",
                highlights: [
                    "DIAN electronic invoicing & fiscal localization",
                    "Multi-tenant SaaS with 50+ active clients",
                    "AI assistance module & full CMS/landing redesign",
                ],
            },
            es: {
                name: "ManagerPyme",
                tagline: "SaaS contable y POS con facturación electrónica DIAN",
                description:
                    "El SaaS de <b>facturación electrónica DIAN</b> más completo de Colombia, construido sobre una base ERP/POS. Desarrollé la <b>localización fiscal</b>, un módulo de <b>asistencia con IA</b>, el rediseño completo del <b>CMS/landing</b>, dockericé el stack y lo llevé a producción como <b>SaaS multi-tenant con 50+ clientes activos</b>.",
                highlights: [
                    "Facturación electrónica DIAN y localización fiscal",
                    "SaaS multi-tenant con 50+ clientes activos",
                    "Módulo de asistencia con IA y rediseño completo de CMS/landing",
                ],
            },
        },
    },
    {
        id: "project-destino-cordillera",
        image: "/projects/destino-cordillera.webp",
        status: "production",
        liveUrl: "https://destinocordillera.com",
        repoUrl: null,
        repoPrivate: true,
        tags: ["Next.js", "FastAPI", "Python", "PostgreSQL", "DeepFace", "AWS", "Docker", "CI/CD"],
        metrics: [
            { value: "AI", label: { en: "Facial recognition", es: "Reconocimiento facial" } },
            { value: "CI/CD", label: { en: "GitHub Actions", es: "GitHub Actions" } },
        ],
        translations: {
            en: {
                name: "Destino Cordillera",
                tagline: "Photo-park platform with facial recognition (AI)",
                description:
                    "Full-stack platform and website for a photo park. <b>Next.js</b> frontend, <b>FastAPI</b> backend and <b>PostgreSQL</b>, with <b>DeepFace</b> facial recognition to match each visitor with their photos. Dockerized and deployed on <b>AWS Lightsail</b> with a full <b>GitHub Actions CI/CD</b> pipeline publishing images to GHCR.",
                highlights: [
                    "DeepFace facial recognition to match visitors with photos",
                    "FastAPI + PostgreSQL backend, static Next.js frontend",
                    "CI/CD to AWS Lightsail via GitHub Actions (GHCR)",
                ],
            },
            es: {
                name: "Destino Cordillera",
                tagline: "Plataforma de parque fotográfico con reconocimiento facial (IA)",
                description:
                    "Plataforma full-stack y sitio web para un parque fotográfico. Frontend <b>Next.js</b>, backend <b>FastAPI</b> y <b>PostgreSQL</b>, con reconocimiento facial <b>DeepFace</b> para emparejar a cada visitante con sus fotos. Dockerizado y desplegado en <b>AWS Lightsail</b> con un pipeline completo de <b>CI/CD por GitHub Actions</b> que publica imágenes en GHCR.",
                highlights: [
                    "Reconocimiento facial DeepFace para emparejar visitantes con fotos",
                    "Backend FastAPI + PostgreSQL, frontend estático Next.js",
                    "CI/CD a AWS Lightsail vía GitHub Actions (GHCR)",
                ],
            },
        },
    },
    {
        id: "project-los-encargos-de-caro",
        image: "/projects/los-encargos-de-caro.webp",
        status: "production",
        liveUrl: "https://losencargosdekaro.systemlife.com.co",
        repoUrl: null,
        repoPrivate: true,
        tags: ["Laravel", "PHP 8.2", "Filament 4", "MySQL", "Docker", "Nginx"],
        metrics: [
            { value: "Filament", label: { en: "Admin panel", es: "Panel admin" } },
        ],
        translations: {
            en: {
                name: "Los Encargos de Caro",
                tagline: "Sales & orders management app",
                description:
                    "Sales and orders management app built with <b>Laravel</b> and a <b>Filament 4</b> admin panel, with <b>PDF generation</b> and a dockerized <b>Nginx + MySQL</b> stack deployed to production.",
                highlights: [
                    "Laravel + Filament 4 admin panel",
                    "PDF generation (dompdf)",
                    "Dockerized Nginx + MySQL production deploy",
                ],
            },
            es: {
                name: "Los Encargos de Caro",
                tagline: "App de gestión de ventas y encargos",
                description:
                    "App de gestión de ventas y encargos construida con <b>Laravel</b> y un panel de administración <b>Filament 4</b>, con <b>generación de PDF</b> y un stack dockerizado <b>Nginx + MySQL</b> desplegado en producción.",
                highlights: [
                    "Panel de administración Laravel + Filament 4",
                    "Generación de PDF (dompdf)",
                    "Despliegue en producción dockerizado con Nginx + MySQL",
                ],
            },
        },
    },
    {
        id: "project-larapark",
        image: "/projects/larapark.webp",
        status: "opensource",
        liveUrl: null,
        repoUrl: "https://github.com/zackisaza/gestor-de-parqueaderos-con-laravel",
        repoPrivate: false,
        tags: ["Laravel", "Tailwind", "JavaScript", "Vite"],
        metrics: [
            { value: "OSS", label: { en: "Open source", es: "Código abierto" } },
        ],
        translations: {
            en: {
                name: "Larapark",
                tagline: "Free parking-lot management system",
                description:
                    "Open-source app to manage parking lots efficiently, built with <b>Laravel</b>, <b>Tailwind</b> and <b>Vite</b>. Free and public on GitHub.",
                highlights: [
                    "Parking operations management",
                    "Laravel + Tailwind UI",
                    "Open source & free to use",
                ],
            },
            es: {
                name: "Larapark",
                tagline: "Sistema gratuito de gestión de parqueaderos",
                description:
                    "App de código abierto para gestionar parqueaderos de forma eficiente, construida con <b>Laravel</b>, <b>Tailwind</b> y <b>Vite</b>. Gratuita y pública en GitHub.",
                highlights: [
                    "Gestión de operaciones de parqueadero",
                    "UI con Laravel + Tailwind",
                    "Código abierto y de uso gratuito",
                ],
            },
        },
    },
    {
        id: "project-generador-poemas",
        image: "/projects/generador-poemas.webp",
        status: "client",
        liveUrl: "https://zackisaza.github.io/generador-poemas/",
        repoUrl: "https://github.com/zackisaza/generador-poemas",
        repoPrivate: false,
        tags: ["HTML", "CSS", "JavaScript", "Canvas"],
        metrics: [
            { value: "0", label: { en: "Build step", es: "Sin build" } },
        ],
        translations: {
            en: {
                name: "Poem Instagrammer",
                tagline: "Browser canvas studio: poems → Instagram-ready images",
                description:
                    "Zero-build, no-backend studio that renders poems into <b>Instagram-ready images</b> entirely in <code>&lt;canvas&gt;</code>: 4 aspect ratios, 8 themes, markdown formatting and localStorage state. Built for a client (@sr.zrro).",
                highlights: [
                    "Full render pipeline in the browser canvas",
                    "4 ratios, 8 themes, markdown formatting",
                    "No build, no backend — pure HTML/CSS/JS",
                ],
            },
            es: {
                name: "Instagrameador de Poemas",
                tagline: "Estudio en canvas: poemas → imágenes listas para Instagram",
                description:
                    "Estudio sin build ni backend que convierte poemas en <b>imágenes listas para Instagram</b> renderizando todo en <code>&lt;canvas&gt;</code>: 4 proporciones, 8 temas, formato markdown y estado en localStorage. Hecho para un cliente (@sr.zrro).",
                highlights: [
                    "Pipeline de render completo en el canvas del navegador",
                    "4 proporciones, 8 temas, formato markdown",
                    "Sin build ni backend — HTML/CSS/JS puro",
                ],
            },
        },
    },
];

export { services, technologies, experiences, servicesShowcase, projects };
