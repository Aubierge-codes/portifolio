import type { Project } from "@/types/content";

export const githubUrl = "https://github.com/Aubierge-codes/";

export const projects: Project[] = [
  {
    id: "heringress",
    name: "HerIngress",
    alsoKnownAs: "Asha",
    category: "AI · Full-Stack · Opportunity Discovery",
    size: "feature",
    problem:
      "Education, programs, competitions, and development opportunities are scattered across websites, making consistent discovery difficult for young people.",
    role:
      "Frontend and full-stack development, product thinking, API integration, and AI interaction design with Team Dev Girls.",
    decision:
      "Shape the experience around an AI-powered assistant that helps users navigate opportunity information instead of only browsing static lists.",
    outcome:
      "Developed through the Technovation 2026 journey and recognized as a Technovation 2026 Semifinalist.",
    technologies: [
      "React",
      "Vite",
      "Node.js",
      "Express",
      "MongoDB",
      "OpenAI API",
      "Swagger",
      "Web scraping"
    ]
  },
  {
    id: "umucocore",
    name: "UMUCOCore",
    alsoKnownAs: "Umuco Hub",
    category: "Full-Stack · Culture · Interactive Web",
    size: "feature",
    problem:
      "Rwandan cultural learning can feel fragmented when stories, places, maps, and exploration tools live in separate experiences.",
    role:
      "Full-stack product development for a multilingual cultural web experience centered on learning and exploration.",
    decision:
      "Blend structured cultural content with maps, interactive experiences, and an AI guide concept while keeping the interface modern and restrained.",
    outcome:
      "A product concept that contrasts technology and culture without relying on visual cliches.",
    technologies: [
      "React 18",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "PostgreSQL",
      "JWT",
      "Google OAuth",
      "bcrypt",
      "Multer",
      "Nodemailer",
      "Resend",
      "Leaflet",
      "Framer Motion"
    ]
  },
  {
    id: "gwiza",
    name: "Gwiza",
    category: "AI / Recruitment / Full-Stack",
    size: "medium",
    problem:
      "Recruitment experiences need structure so people and opportunities can meet through clearer digital workflows.",
    role:
      "Product ecosystem development across a public frontend and backend codebase.",
    decision:
      "Treat the project as more than a single page by separating frontend and backend repositories.",
    outcome:
      "Public repositories verify a frontend/backend product direction while leaving unverified features out of the portfolio copy.",
    technologies: ["Frontend app", "Backend API", "Full-stack architecture"],
    links: [
      {
        label: "Frontend repo",
        href: "https://github.com/Aubierge-codes/Gwiza-frontend"
      },
      {
        label: "Backend repo",
        href: "https://github.com/Aubierge-codes/Gwiza-backend"
      }
    ]
  },
  {
    id: "velora",
    name: "Velora",
    category: "Frontend Engineering · Web",
    size: "medium",
    problem:
      "A modern web experience needs responsive design, component organization, and production-oriented frontend decisions.",
    role:
      "Frontend development through the Velora Internship Dev Community.",
    decision:
      "Use a typed Next.js direction with Tailwind CSS, formatting, linting, and component structure to support maintainability.",
    outcome:
      "Demonstrates frontend architecture and delivery habits beyond static page assembly.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "ESLint", "Prettier", "Inter"]
  },
  {
    id: "eco-girls",
    name: "Eco Girls Collective",
    alsoKnownAs: "SHE Leads",
    category: "Climate Tech · Community · Web Platform",
    size: "medium",
    problem:
      "Flooding, blocked drainage, and waste disposal can affect communities and shape the education and leadership conditions around girls.",
    role:
      "Technology and product contribution through the Girl in Bloom Global Ambassador Program 2026 with Team Gender Avengers.",
    decision:
      "Frame the platform as dashboard-oriented documentation and understanding, connected to community action rather than software alone.",
    outcome:
      "A project direction that connects climate awareness, girls' leadership, and usable web systems.",
    technologies: ["Next.js", "NestJS", "Prisma", "PostgreSQL", "Vercel", "Supabase"]
  },
  {
    id: "zero-bite",
    name: "Zero Bite",
    category: "AI · Data · Health Technology · Embedded Systems",
    size: "medium",
    problem:
      "Malaria risk work in Gisagara District benefits from careful exploration of environmental and contextual data without overstating medical certainty.",
    role:
      "Software and systems exploration across data collection, prediction tooling, and communication channels.",
    decision:
      "Connect machine-learning experiments with real-world data sources and hardware-aware system thinking.",
    outcome:
      "Shows ability to work beyond traditional websites while avoiding unverified medical claims.",
    technologies: [
      "Python",
      "FastAPI",
      "Machine learning",
      "Raspberry Pi",
      "Open-Meteo",
      "ERA5",
      "GLDAS",
      "OSMnx",
      "Africa's Talking"
    ]
  },
  {
    id: "kinetiq",
    name: "KinetiQ",
    alsoKnownAs: "Piezo Energy Rwanda",
    category: "IoT · Data · Embedded Systems",
    size: "small",
    problem:
      "Energy-focused prototypes need a bridge between physical hardware, measurement, and understandable data.",
    role:
      "Data Analyst on a team spanning hardware leadership, UI/UX, frontend, backend, and data analysis.",
    decision:
      "Use piezoelectric hardware and Streamlit reporting to make prototype signals easier to inspect.",
    outcome:
      "An engineering prototype connecting physical components, software, and data interpretation.",
    technologies: ["Piezoelectric discs", "NodeMCU ESP-12E", "Streamlit"]
  },
  {
    id: "weather",
    name: "My Weather App",
    category: "Frontend · API Integration",
    size: "small",
    problem:
      "Weather interfaces must respond to asynchronous data and communicate changing conditions clearly.",
    role:
      "Frontend implementation focused on API integration and dynamic presentation.",
    decision:
      "Use real-time weather data and dynamic imagery so the interface changes with state.",
    outcome:
      "A compact project demonstrating API calls, responsive UI, state changes, and asynchronous behavior.",
    technologies: ["JavaScript", "OpenWeatherMap API", "Dynamic imagery"]
  },
  {
    id: "bookstore",
    name: "Mugisha's Book Store",
    category: "Backend · REST API · Database",
    size: "small",
    problem:
      "A bookstore needs reliable create, read, update, and delete operations around book information.",
    role:
      "Backend development and database modeling for a REST API.",
    decision:
      "Use Express routes with MongoDB and Mongoose to keep the API structure clear.",
    outcome:
      "Evidence of backend architecture fundamentals and CRUD workflow understanding.",
    technologies: ["Node.js", "Express", "MongoDB", "Mongoose"]
  },
  {
    id: "java-projects",
    name: "My Java Projects",
    alsoKnownAs: "Student Management System · Save-Wise",
    category: "Software Engineering Fundamentals",
    size: "small",
    problem:
      "Stronger software engineering fundamentals require projects that are not only visual interfaces.",
    role:
      "Java development focused on object-oriented thinking and project organization.",
    decision:
      "Use student-management and personal saving logic to practice abstraction, interfaces, repositories, inheritance, and exception handling.",
    outcome:
      "Shows progression toward deeper engineering foundations, data structures, and maintainable code.",
    technologies: [
      "Java",
      "OOP",
      "Interfaces",
      "Abstraction",
      "Inheritance",
      "Repositories",
      "Data structures",
      "Exception handling"
    ]
  }
];
