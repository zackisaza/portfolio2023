import {
    zett,
    javascript,
    typescript,
    html,
    css,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    git,
    aws,
    bootstrap,
    independent,
    systemlife,
    carrent,
    jobit,
    tripguide,
    threejs,
    web3,
    
} from "../assets";

export const navLinks = [
    {
        id: "about",
        title: "About",
    },
    {
        id: "work",
        title: "Work",
    },
    {
        id: "contact",
        title: "Contact",
    },
];

const services = [
    {
        title: "Fron-end Developer",
        icon: zett,
    },
    {
        title: "Web Designer",
        icon: zett,
    },
    {
        title: "Back-end Developer",
        icon: zett,
    },
    {
        title: "Devops Developer",
        icon: zett,
    },
];

const technologies = [
    {
        name: "HTML 5",
        icon: html,
    },
    {
        name: "CSS 3",
        icon: css,
    },
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
        name: "Three JS",
        icon: threejs,
    },
    {
        name: "git",
        icon: git,
    },
    {
        name: "AWS",
        icon: aws,
    },
    {
        name: "Bootstrap 5",
        icon: bootstrap,
    },
    {
        name: "Web 3",
        icon: web3,
    },
];

const experiences = [
    {
        title: "Full-Stack Developer",
        company_name: "Independent",
        icon: independent,
        iconBg: "#383E56",
        date: "July 2019 - March 2020",
        points: [
            "Created and designed websites and apps for different customers. ",
            "A Web3 Decentralized Finance (DApp with front-end on React)",
            "A blog website (NodeJS, EJS, MongoDB)",
            "A mobile App website (Bootstrap, JS), and a weather app (NodeJS, EJS).",
        ],
    },
    {
        title: "Full-Stack Engineer",
        company_name: "System Life INC",
        icon: systemlife,
        iconBg: "#E6DEDD",
        date: "Oct 2020 - Present",
        points: [
            "Developed multiple Apps and Websites as Manager (Pyme) and Mr. Lukas.",
            "Collaborating with cross-functional teams including designers and other developers to create high-quality products.",
            "Implementing responsive design and ensuring cross-browser compatibility.",
            "Participating in code reviews and providing constructive feedback to other developers.",
        ],
    }
    
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