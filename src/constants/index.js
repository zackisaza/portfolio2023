import {
    gif,
    gif2,
    gif3,
    gif4,
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
    carrent,
    jobit,
    tripguide,
    
} from "../assets";

export const navLinks = [
    {
        id: "about",
        title: "About",
    },
    {
        id: "tech",
        title: "Techs",
    },
    {
        id: "experience",
        title: "Experience",
    },
    {
        id: "projects",
        title: "Projects",
    },
    {
        id: "contact",
        title: "Contact",
    },
];

const services = [
    {
        title: "Deep technical mastery",
        description:
            "Data structures, algorithms, databases, concurrency, and system architecture.      ",
        icon: "mastery",
    },
    {
        title: "System design & scalability",
        description:
            "Distributed systems, queues, caching, microservices, and load balancing end-to-end.",
        icon: "system",
    },
    {
        title: "Automation & DevOps",
        description:
            "CI/CD pipelines, Docker, Kubernetes, Git, testing, and cloud deployment.           ",
        icon: "devops",
    },
    {
        title: "Technical leadership",
        description:
            "Code reviews, mentoring, architectural communication, and quality enforcement.     ",
        icon: "leadership",
    },
];

const technologies = [
    {
        name: "JavaScript",
        icon: javascript,
    },
    {
        name: "TypeScript",
        icon: typescript,
    },
    {
        name: "React JS",
        icon: reactjs,
    },
    {
        name: "Redux Toolkit",
        icon: redux,
    },
    {
        name: "Tailwind CSS",
        icon: tailwind,
    },
    {
        name: "Node JS",
        icon: nodejs,
    },
    {
        name: "MongoDB",
        icon: mongodb,
    },
    {
        name: "AWS",
        icon: aws,
    },
    {
        name: "Docker",
        icon: docker,
    },
    {
        name: "Kubernetes",
        icon: kubernetes,
    },
    {
        name: "Python",
        icon: python,
    },
    {
        name: "Next.js",
        icon: nextjs,
    },
    {
        name: "Django",
        icon: django,
    },
    {
        name: "PostgREST",
        icon: postgrest,
    }
];

const experiences = [
    {
        title: "Senior Backend Engineer",
        company_name: "Conversion Monster – Buffalo, NY (Remote)",
        icon: conversion,
        iconBg: "#000",
        date: "Jun 2024 – Present",
        points: [
            "Leading backend architecture and modernization using Node.js (NestJS), Python (FastAPI), and PHP (Laravel 11).",
            "Designed and maintained microservice-based systems with PostgreSQL, MongoDB, and Redis, ensuring scalability and fault tolerance.",
            "Deployed and monitored production systems using Docker, Kubernetes, and AWS ECS/Lambda.",
            "Implemented event-driven architecture with RabbitMQ and Kafka for asynchronous workflows.",
            "Improved CI/CD automation pipelines using GitHub Actions, Terraform, and AWS CodeBuild.",
            "Mentored developers, conducted code reviews, and enforced clean architecture and DDD principles across the team.",
        ],
    },
    {
        title: "Mid–Senior Backend Engineer",
        company_name: "Conversion Monster – Buffalo, NY (Remote)",
        icon: conversion,
        iconBg: "#000",
        date: "Nov 2023 – Jun 2024",
        points: [
            "Developed and maintained RESTful and GraphQL APIs using Node.js (Express) and Python (Django).",
            "Migrated monolithic systems into modular services, improving performance and maintainability.",
            "Integrated AWS services (S3, EC2, RDS) and optimized data handling with PostgreSQL and MongoDB.",
            "Implemented containerized environments using Docker and introduced Git-based deployment workflows.",
            "Collaborated with frontend, QA, and product teams to ensure efficient feature delivery and system stability.",
        ],
    },
    {
        title: "Front-End Engineer",
        company_name: "Soluciones Star – Medellín, CO (Hybrid)",
        icon: soluciones,
        iconBg: "#000",
        date: "Mar 2023 – Nov 2023",
        points: [
            "Developed modern, user-centric interfaces using React.js, Next.js, and TypeScript.",
            "Led project deployments with Vercel, collaborating closely with backend teams for seamless integration.",
            "Focused on performance optimization and accessibility best practices.",
        ],
    },
    {
        title: "Mid–Level Software Engineer",
        company_name: "System Life – Armenia, CO (Remote)",
        icon: systemlife,
        iconBg: "#000",
        date: "Sep 2021 – Mar 2023",
        points: [
            "Led backend development for Manager-Pyme and Mr. Lukas POS systems using Laravel and MySQL.",
            "Refactored legacy modules, improving performance and maintainability by over 30%.",
            "Integrated third-party APIs and implemented custom reporting dashboards for clients.",
            "Participated in sprint planning, code reviews, and deployment automation.",
            "Mentored junior developers and contributed to improving internal coding standards.",
        ],
    },
    {
        title: "Junior Software Engineer",
        company_name: "System Life – Armenia, CO (Remote)",
        icon: systemlife,
        iconBg: "#000",
        date: "Oct 2020 – Sep 2021",
        points: [
            "Assisted in the development and maintenance of POS and management systems built on Laravel and MySQL.",
            "Fixed bugs, improved UI consistency, and implemented small backend modules.",
            "Gained experience with Git, REST APIs, and responsive web interfaces.",
            "Collaborated closely with designers to ensure high-quality deliverables and usability.",
        ],
    },
    {
        title: "Freelance Developer",
        company_name: "Remote",
        icon: independent,
        iconBg: "#000",
        date: "2019 – 2023",
        points: [
            "Designed and developed custom software solutions, including web platforms, management tools, and e-commerce systems.",
            "Built applications using Laravel, React.js, Node.js, and Python, integrating REST APIs and cloud services.",
            "Delivered end-to-end development from planning to deployment for clients across multiple industries.",
            "Provided ongoing maintenance, optimizations, and feature upgrades to ensure long-term software reliability.",
        ],
    },
];



const projects = [
    {
        name: "Car Rent",
        description:
            "Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.",
        tags: [
            {
                name: "react",
                color: "blue-text-gradient",
            },
            {
                name: "mongodb",
                color: "green-text-gradient",
            },
            {
                name: "tailwind",
                color: "pink-text-gradient",
            },
        ],
        image: carrent,
        source_code_link: "https://github.com/",
    },
    {
        name: "Job IT",
        description:
            "Web application that enables users to search for job openings, view estimated salary ranges for positions, and locate available jobs based on their current location.",
        tags: [
            {
                name: "react",
                color: "blue-text-gradient",
            },
            {
                name: "restapi",
                color: "green-text-gradient",
            },
            {
                name: "scss",
                color: "pink-text-gradient",
            },
        ],
        image: jobit,
        source_code_link: "https://github.com/",
    },
    {
        name: "Trip Guide",
        description:
            "A comprehensive travel booking platform that allows users to book flights, hotels, and rental cars, and offers curated recommendations for popular destinations.",
        tags: [
            {
                name: "nextjs",
                color: "blue-text-gradient",
            },
            {
                name: "supabase",
                color: "green-text-gradient",
            },
            {
                name: "css",
                color: "pink-text-gradient",
            },
        ],
        image: tripguide,
        source_code_link: "https://github.com/",
    },
];

export { services, technologies, experiences, projects };
