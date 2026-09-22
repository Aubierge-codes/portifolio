import type { Locale, Project } from "@/types/content";

export const githubUrl = "https://github.com/Aubierge-codes/";

const sharedTech = {
  heringress: [
    "React",
    "Vite",
    "Node.js",
    "Express",
    "MongoDB",
    "OpenAI API",
    "Swagger",
    "Web scraping"
  ],
  umuco: [
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
  ],
  zeroBite: [
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
};

const enProjects: Project[] = [
  {
    id: "heringress",
    name: "HerIngress",
    alsoKnownAs: "Asha",
    category: "AI · Full-Stack · Opportunity Discovery",
    size: "feature",
    problem:
      "Education, programs, competitions, and development opportunities are scattered across websites, making consistent discovery difficult for young people.",
    role: "Frontend and full-stack development, product thinking, API integration, and AI interaction design with Team Dev Girls.",
    decision:
      "Shape the experience around an AI-powered assistant that helps users navigate opportunity information instead of only browsing static lists.",
    outcome:
      "Developed through the Technovation 2026 journey and recognized as a Technovation 2026 Semifinalist.",
    technologies: sharedTech.heringress,
    team: [
      "Mutimutuje Hope Nancy Mizero",
      "Shimirwa Teta Sonia",
      "Aubierge Umurerwa"
    ],
    mentor: "Hilaire Hatangimbabazi",
    context: "Technovation 2026",
    status: "Technovation 2026 Semifinalist",
    links: [
      {
        label: "Asha frontend",
        href: "https://github.com/Aubierge-codes/Asha-ai-frontend"
      },
      {
        label: "Asha backend",
        href: "https://github.com/Aubierge-codes/Asha-ai-backend"
      }
    ]
  },
  {
    id: "umucocore",
    name: "UMUCOCore",
    alsoKnownAs: "Umuco Hub · Rooted in Culture. Inspired by Nature.",
    category: "Full-Stack · Culture · Interactive Web",
    size: "feature",
    problem:
      "Rwandan cultural learning can feel fragmented when stories, places, maps, and exploration tools live in separate experiences.",
    role: "Full-stack product development for a multilingual cultural web experience centered on learning and exploration.",
    decision:
      "Blend structured cultural content with maps, interactive experiences, and an AI guide concept while keeping the interface modern and restrained.",
    outcome:
      "A product concept that contrasts technology and culture without relying on visual cliches.",
    technologies: sharedTech.umuco
  },
  {
    id: "gwiza",
    name: "Gwiza",
    category: "AI / Recruitment / Full-Stack",
    size: "medium",
    problem:
      "Recruitment experiences need structure so people and opportunities can meet through clearer digital workflows.",
    role: "Product ecosystem development across a public frontend and backend codebase.",
    decision:
      "Treat the project as more than a single page by separating frontend and backend repositories.",
    outcome:
      "Public repositories verify a frontend/backend product direction while leaving unverified features out of the portfolio copy.",
    technologies: ["Next.js", "Tailwind CSS", "Frontend app", "Backend API"],
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
    role: "Frontend development through the Velora Internship Dev Community.",
    decision:
      "Use a typed Next.js direction with Tailwind CSS, formatting, linting, and component structure to support maintainability.",
    outcome:
      "Demonstrates frontend architecture and delivery habits beyond static page assembly.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "ESLint",
      "Prettier",
      "Inter"
    ]
  },
  {
    id: "eco-girls",
    name: "Eco Girls Collective",
    alsoKnownAs: "SHE Leads",
    category: "Climate Tech · Community · Web Platform",
    size: "medium",
    problem:
      "Flooding, blocked drainage, and waste disposal can affect communities and shape the education and leadership conditions around girls.",
    role: "Technology and product contribution through the Girl in Bloom Global Ambassador Program 2026 with Team Gender Avengers.",
    decision:
      "Frame the platform as dashboard-oriented documentation and understanding, connected to community action rather than software alone.",
    outcome:
      "A project direction that connects climate awareness, girls' leadership, and usable web systems.",
    technologies: [
      "Next.js",
      "NestJS",
      "Prisma",
      "PostgreSQL",
      "Vercel",
      "Supabase"
    ],
    team: ["Gender Avengers"],
    mentor: "Abigael Anaza-Mark",
    coach: "Kudirat Abiola",
    context: "Girl in Bloom Global Ambassador Program 2026",
    links: [
      {
        label: "Frontend repo",
        href: "https://github.com/Aubierge-codes/She-leads-front"
      },
      {
        label: "Backend repo",
        href: "https://github.com/Aubierge-codes/She-leads-back"
      }
    ]
  },
  {
    id: "zero-bite",
    name: "Zero Bite",
    category: "AI · Data · Health Technology · Embedded Systems",
    size: "medium",
    problem:
      "Malaria risk work in Gisagara District benefits from careful exploration of environmental and contextual data without overstating medical certainty.",
    role: "Software and systems exploration across data collection, prediction tooling, and communication channels.",
    decision:
      "Connect machine-learning experiments with real-world data sources and hardware-aware system thinking.",
    outcome:
      "Shows ability to work beyond traditional websites while avoiding unverified medical claims.",
    technologies: sharedTech.zeroBite,
    links: [
      {
        label: "Repository",
        href: "https://github.com/Aubierge-codes/Zero-bite"
      }
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
    role: "Data Analyst on a team spanning hardware leadership, UI/UX, frontend, backend, and data analysis.",
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
    role: "Frontend implementation focused on API integration and dynamic presentation.",
    decision:
      "Use real-time weather data and dynamic imagery so the interface changes with state.",
    outcome:
      "A compact project demonstrating API calls, responsive UI, state changes, and asynchronous behavior.",
    technologies: ["JavaScript", "OpenWeatherMap API", "Dynamic imagery"],
    links: [
      {
        label: "Repository",
        href: "https://github.com/Aubierge-codes/my-weather-app"
      }
    ]
  },
  {
    id: "bookstore",
    name: "Mugisha's Book Store",
    category: "Backend · REST API · Database",
    size: "small",
    problem:
      "A bookstore needs reliable create, read, update, and delete operations around book information.",
    role: "Backend development and database modeling for a REST API.",
    decision:
      "Use Express routes with MongoDB and Mongoose to keep the API structure clear.",
    outcome:
      "Evidence of backend architecture fundamentals and CRUD workflow understanding.",
    technologies: ["Node.js", "Express", "MongoDB", "Mongoose"],
    links: [
      {
        label: "Repository",
        href: "https://github.com/Aubierge-codes/book_store"
      }
    ]
  },
  {
    id: "java-projects",
    name: "My Java Projects",
    alsoKnownAs: "Student Management System · Save-Wise",
    category: "Software Engineering Fundamentals",
    size: "small",
    problem:
      "Stronger software engineering fundamentals require projects that are not only visual interfaces.",
    role: "Java development focused on object-oriented thinking and project organization.",
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
    ],
    links: [
      {
        label: "Save-Wise",
        href: "https://github.com/Aubierge-codes/save-wise"
      },
      {
        label: "Java OOP",
        href: "https://github.com/Aubierge-codes/java-oop-project"
      }
    ]
  }
];

const frProjects: Project[] = [
  {
    ...enProjects[0],
    category: "IA · Full-Stack · Recherche d'opportunites",
    problem:
      "Les formations, programmes, concours et opportunites de developpement sont disperses sur plusieurs sites, ce qui les rend difficiles a suivre.",
    role: "Frontend, full-stack, pensee produit, integration d'API et design d'interaction IA avec Team Dev Girls.",
    decision:
      "Organiser l'experience autour d'une assistante IA qui aide a explorer les opportunites au lieu de seulement parcourir des listes statiques.",
    outcome:
      "Developpe pendant le parcours Technovation 2026 et reconnu comme demi-finaliste Technovation 2026."
  },
  {
    ...enProjects[1],
    category: "Full-Stack · Culture · Web interactif",
    problem:
      "L'apprentissage culturel rwandais peut sembler fragmente quand les histoires, lieux, cartes et outils d'exploration sont separes.",
    role: "Developpement full-stack d'une experience culturelle multilingue centree sur l'apprentissage et l'exploration.",
    decision:
      "Associer contenu culturel structure, cartes, experiences interactives et concept de guide IA dans une interface moderne et sobre.",
    outcome:
      "Un concept produit qui met en tension technologie et culture sans s'appuyer sur des cliches visuels."
  },
  {
    ...enProjects[2],
    category: "IA / Recrutement / Full-Stack",
    problem:
      "Les experiences de recrutement ont besoin de structure pour relier personnes et opportunites par des parcours numeriques plus clairs.",
    role: "Developpement d'un ecosysteme produit avec un frontend et un backend publics.",
    decision:
      "Presenter le projet comme plus qu'une page unique grace a des depots frontend et backend separes.",
    outcome:
      "Les depots publics confirment une direction frontend/backend sans inventer de fonctionnalites non verifiees.",
    links: [
      {
        label: "Depot frontend",
        href: "https://github.com/Aubierge-codes/Gwiza-frontend"
      },
      {
        label: "Depot backend",
        href: "https://github.com/Aubierge-codes/Gwiza-backend"
      }
    ]
  },
  {
    ...enProjects[3],
    category: "Ingenierie frontend · Web",
    problem:
      "Une experience web moderne demande du responsive, une organisation de composants et des decisions frontend orientees production.",
    role: "Developpement frontend avec la Velora Internship Dev Community.",
    decision:
      "Utiliser Next.js type, Tailwind CSS, formatage, linting et structure de composants pour soutenir la maintenabilite.",
    outcome:
      "Montre des habitudes d'architecture frontend et de livraison au-dela d'une simple page statique."
  },
  {
    ...enProjects[4],
    category: "Climate Tech · Communaute · Plateforme web",
    problem:
      "Les inondations, caniveaux bloques et dechets peuvent affecter les communautes et les conditions d'education et de leadership des filles.",
    role: "Contribution technologie et produit via le Girl in Bloom Global Ambassador Program 2026 avec Team Gender Avengers.",
    decision:
      "Penser la plateforme comme un tableau de bord de documentation relie a l'action communautaire, pas seulement comme un logiciel.",
    outcome:
      "Une direction qui relie climat, leadership des filles et systemes web utilisables."
  },
  {
    ...enProjects[5],
    category: "IA · Data · Technologie sante · Systemes embarques",
    problem:
      "Le travail sur le risque de malaria a Gisagara demande une exploration prudente des donnees environnementales et contextuelles.",
    role: "Exploration logicielle et systeme autour de la collecte de donnees, d'outils predictifs et de canaux de communication.",
    decision:
      "Relier des experiences de machine learning a des sources de donnees reelles et a une pensee systeme proche du materiel.",
    outcome:
      "Montre une capacite a travailler au-dela des sites web classiques sans faire d'affirmations medicales non verifiees."
  },
  {
    ...enProjects[6],
    category: "IoT · Data · Systemes embarques",
    problem:
      "Les prototypes energetiques ont besoin d'un pont entre materiel physique, mesure et donnees comprehensibles.",
    role: "Data Analyst dans une equipe couvrant hardware, UI/UX, frontend, backend et analyse de donnees.",
    decision:
      "Utiliser du materiel piezoelectrique et Streamlit pour rendre les signaux du prototype plus lisibles.",
    outcome:
      "Un prototype d'ingenierie reliant composants physiques, logiciel et interpretation des donnees."
  },
  {
    ...enProjects[7],
    category: "Frontend · Integration API",
    problem:
      "Les interfaces meteo doivent reagir aux donnees asynchrones et communiquer clairement les conditions changeantes.",
    role: "Implementation frontend centree sur l'integration API et la presentation dynamique.",
    decision:
      "Utiliser des donnees meteo en temps reel et des images dynamiques pour faire evoluer l'interface.",
    outcome:
      "Un projet compact montrant appels API, UI responsive, changements d'etat et comportement asynchrone."
  },
  {
    ...enProjects[8],
    category: "Backend · REST API · Base de donnees",
    problem:
      "Une librairie a besoin d'operations fiables pour creer, lire, modifier et supprimer les informations des livres.",
    role: "Developpement backend et modelisation de base de donnees pour une API REST.",
    decision:
      "Utiliser des routes Express avec MongoDB et Mongoose pour garder une structure claire.",
    outcome:
      "Preuve de bases solides en architecture backend et en operations CRUD."
  },
  {
    ...enProjects[9],
    category: "Fondamentaux d'ingenierie logicielle",
    problem:
      "Renforcer les bases d'ingenierie logicielle demande des projets qui ne sont pas seulement des interfaces visuelles.",
    role: "Developpement Java centre sur la pensee objet et l'organisation de projet.",
    decision:
      "Utiliser la gestion d'etudiants et la logique d'epargne personnelle pour pratiquer abstraction, interfaces, repositories, heritage et exceptions.",
    outcome:
      "Montre une progression vers des bases d'ingenierie plus solides, les structures de donnees et le code maintenable."
  }
];

const esProjects: Project[] = [
  {
    ...enProjects[0],
    category: "IA · Full-Stack · Descubrimiento de oportunidades",
    problem:
      "La educacion, los programas, concursos y oportunidades de desarrollo estan dispersos en muchos sitios, lo que dificulta descubrirlos con constancia.",
    role: "Frontend, full-stack, pensamiento de producto, integracion de API y diseno de interaccion con IA junto a Team Dev Girls.",
    decision:
      "Centrar la experiencia en una asistente con IA que ayuda a navegar informacion de oportunidades, no solo listas estaticas.",
    outcome:
      "Desarrollado durante el camino de Technovation 2026 y reconocido como semifinalista de Technovation 2026."
  },
  {
    ...enProjects[1],
    category: "Full-Stack · Cultura · Web interactiva",
    problem:
      "El aprendizaje cultural ruandes puede sentirse fragmentado cuando historias, lugares, mapas y herramientas de exploracion viven separados.",
    role: "Desarrollo full-stack de una experiencia cultural multilingue centrada en aprender y explorar.",
    decision:
      "Combinar contenido cultural estructurado, mapas, experiencias interactivas y un concepto de guia IA con una interfaz moderna y contenida.",
    outcome:
      "Un concepto de producto que contrasta tecnologia y cultura sin depender de cliches visuales."
  },
  {
    ...enProjects[2],
    category: "IA / Reclutamiento / Full-Stack",
    problem:
      "Las experiencias de reclutamiento necesitan estructura para conectar personas y oportunidades mediante flujos digitales mas claros.",
    role: "Desarrollo de ecosistema de producto con un frontend y backend publicos.",
    decision:
      "Tratar el proyecto como algo mayor que una sola pagina separando repositorios de frontend y backend.",
    outcome:
      "Los repositorios publicos verifican una direccion frontend/backend sin inventar funciones no comprobadas.",
    links: [
      {
        label: "Repo frontend",
        href: "https://github.com/Aubierge-codes/Gwiza-frontend"
      },
      {
        label: "Repo backend",
        href: "https://github.com/Aubierge-codes/Gwiza-backend"
      }
    ]
  },
  {
    ...enProjects[3],
    category: "Ingenieria frontend · Web",
    problem:
      "Una experiencia web moderna necesita diseno responsive, organizacion de componentes y decisiones frontend listas para produccion.",
    role: "Desarrollo frontend en la Velora Internship Dev Community.",
    decision:
      "Usar Next.js tipado con Tailwind CSS, formato, linting y estructura de componentes para sostener la mantenibilidad.",
    outcome:
      "Demuestra arquitectura frontend y habitos de entrega mas alla de ensamblar una pagina estatica."
  },
  {
    ...enProjects[4],
    category: "Climate Tech · Comunidad · Plataforma web",
    problem:
      "Las inundaciones, drenajes bloqueados y residuos pueden afectar comunidades y las condiciones de educacion y liderazgo de las ninas.",
    role: "Contribucion de tecnologia y producto en el Girl in Bloom Global Ambassador Program 2026 con Team Gender Avengers.",
    decision:
      "Plantear la plataforma como una experiencia tipo dashboard para documentar y entender, conectada con accion comunitaria.",
    outcome:
      "Una direccion de proyecto que conecta clima, liderazgo de ninas y sistemas web utilizables."
  },
  {
    ...enProjects[5],
    category: "IA · Datos · Tecnologia de salud · Sistemas embebidos",
    problem:
      "El trabajo de riesgo de malaria en Gisagara necesita explorar datos ambientales y contextuales con cuidado y sin exagerar certezas medicas.",
    role: "Exploracion de software y sistemas para recoleccion de datos, herramientas predictivas y canales de comunicacion.",
    decision:
      "Conectar experimentos de machine learning con fuentes reales de datos y pensamiento de sistema cercano al hardware.",
    outcome:
      "Muestra capacidad de trabajar mas alla de sitios web tradicionales sin hacer afirmaciones medicas no verificadas."
  },
  {
    ...enProjects[6],
    category: "IoT · Datos · Sistemas embebidos",
    problem:
      "Los prototipos energeticos necesitan unir hardware fisico, medicion y datos faciles de interpretar.",
    role: "Data Analyst en un equipo con liderazgo de hardware, UI/UX, frontend, backend y analisis de datos.",
    decision:
      "Usar hardware piezoelectrico y reportes en Streamlit para hacer mas legibles las senales del prototipo.",
    outcome:
      "Un prototipo de ingenieria que conecta componentes fisicos, software e interpretacion de datos."
  },
  {
    ...enProjects[7],
    category: "Frontend · Integracion API",
    problem:
      "Las interfaces del clima deben responder a datos asincronos y comunicar condiciones cambiantes con claridad.",
    role: "Implementacion frontend centrada en integracion API y presentacion dinamica.",
    decision:
      "Usar datos meteorologicos en tiempo real e imagenes dinamicas para que la interfaz cambie con el estado.",
    outcome:
      "Un proyecto compacto que demuestra llamadas API, UI responsive, cambios de estado y comportamiento asincrono."
  },
  {
    ...enProjects[8],
    category: "Backend · REST API · Base de datos",
    problem:
      "Una libreria necesita operaciones confiables para crear, leer, actualizar y eliminar informacion de libros.",
    role: "Desarrollo backend y modelado de base de datos para una API REST.",
    decision:
      "Usar rutas Express con MongoDB y Mongoose para mantener clara la estructura de la API.",
    outcome:
      "Evidencia de fundamentos de arquitectura backend y comprension de CRUD."
  },
  {
    ...enProjects[9],
    category: "Fundamentos de ingenieria de software",
    problem:
      "Fortalecer fundamentos de ingenieria requiere proyectos que no sean solo interfaces visuales.",
    role: "Desarrollo Java enfocado en pensamiento orientado a objetos y organizacion de proyectos.",
    decision:
      "Usar gestion de estudiantes y logica de ahorro personal para practicar abstraccion, interfaces, repositorios, herencia y excepciones.",
    outcome:
      "Muestra progreso hacia fundamentos mas profundos, estructuras de datos y codigo mantenible."
  }
];

export const localizedProjects: Record<Locale, Project[]> = {
  en: enProjects,
  fr: frProjects,
  es: esProjects
};

export const projects = enProjects;
