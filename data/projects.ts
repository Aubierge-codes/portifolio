import type { Locale, Project, ProjectText } from "@/types/content";

export const githubUrl = "https://github.com/Aubierge-codes/";

const repo = (name: string) => `https://github.com/Aubierge-codes/${name}`;

/**
 * Language-neutral facts, in story order. Each entry is one chapter of the
 * Work world. Copy lives in `text` below, one block per locale.
 */
const base: Omit<Project, keyof ProjectText>[] = [
  {
    id: "heringress",
    name: "HerIngress",
    tags: ["React", "Node.js", "MongoDB", "OpenAI API"],
    team: [
      "Mutimutuje Hope Nancy Mizero",
      "Shimirwa Teta Sonia",
      "Aubierge Umurerwa"
    ],
    mentor: "Hilaire Hatangimbabazi",
    links: [
      { label: "Frontend", href: repo("Asha-ai-frontend") },
      { label: "Backend", href: repo("Asha-ai-backend") }
    ]
  },
  {
    id: "umucocore",
    name: "UMUCOCore",
    tags: ["React", "PostgreSQL", "Leaflet", "Framer Motion"]
  },
  {
    id: "gwiza",
    name: "Gwiza",
    tags: ["Next.js", "Tailwind CSS", "REST API"],
    links: [
      { label: "Frontend", href: repo("Gwiza-frontend") },
      { label: "Backend", href: repo("Gwiza-backend") }
    ]
  },
  {
    id: "velora",
    name: "Velora",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"]
  },
  {
    id: "eco-girls",
    name: "Eco Girls Collective",
    tags: ["Next.js", "NestJS", "Prisma", "PostgreSQL"],
    team: ["Gender Avengers"],
    mentor: "Abigael Anaza-Mark",
    coach: "Kudirat Abiola",
    links: [
      { label: "Frontend", href: repo("She-leads-front") },
      { label: "Backend", href: repo("She-leads-back") }
    ]
  },
  {
    id: "zero-bite",
    name: "Zero Bite",
    tags: ["Python", "FastAPI", "Machine learning", "Raspberry Pi"],
    links: [{ label: "Repository", href: repo("Zero-bite") }]
  },
  {
    id: "kinetiq",
    name: "KinetiQ",
    tags: ["Piezoelectric", "NodeMCU ESP-12E", "Streamlit"]
  },
  {
    id: "weather",
    name: "My Weather App",
    tags: ["JavaScript", "OpenWeatherMap API", "Async UI"],
    links: [{ label: "Repository", href: repo("my-weather-app") }]
  },
  {
    id: "bookstore",
    name: "Mugisha's Book Store",
    tags: ["Node.js", "Express", "MongoDB"],
    links: [{ label: "Repository", href: repo("book_store") }]
  },
  {
    id: "java-projects",
    name: "My Java Projects",
    tags: ["Java", "OOP", "Data structures"],
    links: [
      { label: "Save-Wise", href: repo("save-wise") },
      { label: "Java OOP", href: repo("java-oop-project") }
    ]
  }
];

const text: Record<Locale, Record<string, ProjectText>> = {
  en: {
    heringress: {
      summary: "An AI guide that helps young women find real opportunities.",
      alsoKnownAs: "Asha",
      problem:
        "Opportunities for young people are scattered across many sites.",
      role: "Full-stack development and AI interaction design with Team Dev Girls.",
      decision: "An AI assistant that guides, instead of another static list.",
      outcome: "Technovation 2026 Semifinalist.",
      context: "Technovation 2026"
    },
    umucocore: {
      summary: "Rwandan culture, places and stories, explored on one map.",
      alsoKnownAs: "Umuco Hub",
      problem: "Cultural stories, places and maps live in separate tools.",
      role: "Full-stack development of a multilingual cultural platform.",
      decision: "Pair structured content with maps and an AI guide concept.",
      outcome: "A modern cultural product without visual clichés."
    },
    gwiza: {
      summary:
        "Recruitment that connects people and roles through clear workflows.",
      problem: "Hiring needs structure so people and roles can meet.",
      role: "Frontend and backend development across two repositories.",
      decision: "Split the product into a frontend and a separate API.",
      outcome: "A verified frontend and backend product direction."
    },
    velora: {
      summary: "A polished, typed frontend built for maintainability.",
      problem: "Modern web products need structure beyond static pages.",
      role: "Frontend developer, Velora Internship Dev Community.",
      decision: "Typed Next.js with linting, formatting and clear components.",
      outcome: "Production-minded frontend architecture."
    },
    "eco-girls": {
      summary: "Climate action data for communities, led by girls.",
      alsoKnownAs: "SHE Leads",
      problem: "Flooding and waste shape the conditions girls grow up in.",
      role: "Product and technology, Girl in Bloom Ambassador Program 2026.",
      decision: "A dashboard that turns local data into community action.",
      outcome: "Climate awareness, girls' leadership and usable software.",
      context: "Girl in Bloom Global Ambassador Program 2026"
    },
    "zero-bite": {
      summary: "Exploring malaria risk in Gisagara with data and hardware.",
      problem: "Malaria risk data is spread across many environmental sources.",
      role: "Data collection, prediction tooling and messaging channels.",
      decision: "Link machine learning to real data and a Raspberry Pi.",
      outcome: "Systems work beyond the browser, without medical overclaims."
    },
    kinetiq: {
      summary: "Footsteps become energy, and energy becomes readable data.",
      alsoKnownAs: "Piezo Energy Rwanda",
      problem: "Energy prototypes need hardware and data that people can read.",
      role: "Data analyst on a hardware and software team.",
      decision: "Piezo tiles feeding a NodeMCU and a Streamlit report.",
      outcome: "A working bridge between hardware and data."
    },
    weather: {
      summary: "Live weather, with an interface that changes with the sky.",
      problem: "Weather UIs must handle async data and changing states.",
      role: "Frontend and API integration.",
      decision: "Real-time data driving dynamic imagery.",
      outcome: "Clean async state handling in a compact app."
    },
    bookstore: {
      summary: "A clean REST API for managing a bookstore's catalogue.",
      problem: "A bookstore needs reliable CRUD for its books.",
      role: "Backend development and data modelling.",
      decision: "Express routes over MongoDB with Mongoose.",
      outcome: "Solid backend and CRUD fundamentals."
    },
    "java-projects": {
      summary: "Object-oriented Java: student records and personal savings.",
      alsoKnownAs: "Student Management System · Save-Wise",
      problem: "Strong fundamentals need more than visual interfaces.",
      role: "Java development focused on OOP design.",
      decision:
        "Practise abstraction, interfaces and repositories on real logic.",
      outcome: "Deeper engineering foundations."
    }
  },
  fr: {
    heringress: {
      summary:
        "Un guide IA qui aide les jeunes femmes à trouver des opportunités.",
      alsoKnownAs: "Asha",
      problem:
        "Les opportunités pour les jeunes sont dispersées sur trop de sites.",
      role: "Développement full-stack et design d'interaction IA avec Team Dev Girls.",
      decision: "Un assistant IA qui guide, plutôt qu'une liste statique.",
      outcome: "Demi-finaliste Technovation 2026.",
      context: "Technovation 2026"
    },
    umucocore: {
      summary: "La culture rwandaise, ses lieux et récits, sur une carte.",
      alsoKnownAs: "Umuco Hub",
      problem:
        "Récits, lieux et cartes culturels vivent dans des outils séparés.",
      role: "Développement full-stack d'une plateforme culturelle multilingue.",
      decision: "Associer contenus structurés, cartes et un guide IA.",
      outcome: "Un produit culturel moderne, sans clichés visuels."
    },
    gwiza: {
      summary: "Un recrutement qui relie personnes et postes simplement.",
      problem:
        "Le recrutement a besoin de structure pour réunir talents et postes.",
      role: "Développement frontend et backend sur deux dépôts.",
      decision: "Séparer le produit en un frontend et une API.",
      outcome: "Une direction produit frontend et backend vérifiée."
    },
    velora: {
      summary: "Un frontend soigné et typé, pensé pour durer.",
      problem: "Un produit web moderne exige plus que des pages statiques.",
      role: "Développeuse frontend, Velora Internship Dev Community.",
      decision: "Next.js typé, linting, formatage et composants clairs.",
      outcome: "Une architecture frontend prête pour la production."
    },
    "eco-girls": {
      summary:
        "Des données climatiques au service des communautés, menées par des filles.",
      alsoKnownAs: "SHE Leads",
      problem: "Inondations et déchets pèsent sur le quotidien des filles.",
      role: "Produit et technologie, programme Girl in Bloom 2026.",
      decision: "Un tableau de bord qui transforme les données en action.",
      outcome: "Climat, leadership des filles et logiciel utile.",
      context: "Girl in Bloom Global Ambassador Program 2026"
    },
    "zero-bite": {
      summary: "Explorer le risque de paludisme à Gisagara par les données.",
      problem:
        "Les données de risque sont dispersées entre de nombreuses sources.",
      role: "Collecte de données, outils de prédiction et messagerie.",
      decision:
        "Relier l'apprentissage automatique à des données réelles et un Raspberry Pi.",
      outcome: "Des systèmes au-delà du navigateur, sans promesse médicale."
    },
    kinetiq: {
      summary: "Les pas deviennent énergie, et l'énergie des données lisibles.",
      alsoKnownAs: "Piezo Energy Rwanda",
      problem:
        "Les prototypes énergétiques doivent rendre leurs données lisibles.",
      role: "Analyste de données dans une équipe matériel et logiciel.",
      decision: "Dalles piézo, NodeMCU et rapport Streamlit.",
      outcome: "Un pont concret entre matériel et données."
    },
    weather: {
      summary: "La météo en direct, avec une interface qui suit le ciel.",
      problem: "Une app météo doit gérer des données asynchrones.",
      role: "Frontend et intégration d'API.",
      decision: "Des données en temps réel qui pilotent l'image.",
      outcome: "Une gestion d'état asynchrone propre."
    },
    bookstore: {
      summary: "Une API REST claire pour gérer le catalogue d'une librairie.",
      problem: "Une librairie a besoin d'un CRUD fiable.",
      role: "Développement backend et modélisation des données.",
      decision: "Routes Express sur MongoDB avec Mongoose.",
      outcome: "Des bases backend solides."
    },
    "java-projects": {
      summary: "Java orienté objet : dossiers d'élèves et épargne personnelle.",
      alsoKnownAs: "Student Management System · Save-Wise",
      problem: "De bonnes bases demandent plus que des interfaces.",
      role: "Développement Java centré sur la POO.",
      decision:
        "Pratiquer abstraction, interfaces et dépôts sur une vraie logique.",
      outcome: "Des fondations d'ingénierie plus profondes."
    }
  },
  es: {
    heringress: {
      summary: "Una guía con IA que ayuda a jóvenes a encontrar oportunidades.",
      alsoKnownAs: "Asha",
      problem:
        "Las oportunidades para jóvenes están dispersas en muchos sitios.",
      role: "Desarrollo full-stack y diseño de interacción con IA, Team Dev Girls.",
      decision: "Un asistente de IA que guía, no otra lista estática.",
      outcome: "Semifinalista de Technovation 2026.",
      context: "Technovation 2026"
    },
    umucocore: {
      summary: "La cultura de Ruanda, sus lugares e historias, en un mapa.",
      alsoKnownAs: "Umuco Hub",
      problem:
        "Historias, lugares y mapas culturales viven en herramientas separadas.",
      role: "Desarrollo full-stack de una plataforma cultural multilingüe.",
      decision: "Unir contenido estructurado, mapas y una guía con IA.",
      outcome: "Un producto cultural moderno, sin clichés visuales."
    },
    gwiza: {
      summary: "Reclutamiento que conecta personas y puestos con claridad.",
      problem:
        "Contratar necesita estructura para que personas y puestos se encuentren.",
      role: "Desarrollo frontend y backend en dos repositorios.",
      decision: "Separar el producto en un frontend y una API.",
      outcome: "Una dirección de producto frontend y backend verificada."
    },
    velora: {
      summary: "Un frontend cuidado y tipado, pensado para durar.",
      problem: "Un producto web moderno necesita más que páginas estáticas.",
      role: "Desarrolladora frontend, Velora Internship Dev Community.",
      decision: "Next.js tipado, linting, formato y componentes claros.",
      outcome: "Arquitectura frontend lista para producción."
    },
    "eco-girls": {
      summary:
        "Datos climáticos al servicio de comunidades, liderados por chicas.",
      alsoKnownAs: "SHE Leads",
      problem: "Inundaciones y residuos marcan la vida de las chicas.",
      role: "Producto y tecnología, programa Girl in Bloom 2026.",
      decision: "Un panel que convierte datos locales en acción.",
      outcome: "Clima, liderazgo de chicas y software útil.",
      context: "Girl in Bloom Global Ambassador Program 2026"
    },
    "zero-bite": {
      summary: "Explorar el riesgo de malaria en Gisagara con datos.",
      problem: "Los datos de riesgo están dispersos en muchas fuentes.",
      role: "Recolección de datos, predicción y canales de mensajes.",
      decision: "Unir aprendizaje automático, datos reales y una Raspberry Pi.",
      outcome: "Sistemas más allá del navegador, sin promesas médicas."
    },
    kinetiq: {
      summary: "Los pasos se vuelven energía, y la energía datos legibles.",
      alsoKnownAs: "Piezo Energy Rwanda",
      problem: "Los prototipos de energía deben mostrar datos comprensibles.",
      role: "Analista de datos en un equipo de hardware y software.",
      decision: "Baldosas piezo, NodeMCU y un informe en Streamlit.",
      outcome: "Un puente real entre hardware y datos."
    },
    weather: {
      summary: "El clima en vivo, con una interfaz que sigue al cielo.",
      problem: "Una app del clima debe manejar datos asíncronos.",
      role: "Frontend e integración de API.",
      decision: "Datos en tiempo real que guían la imagen.",
      outcome: "Manejo limpio de estado asíncrono."
    },
    bookstore: {
      summary: "Una API REST clara para el catálogo de una librería.",
      problem: "Una librería necesita un CRUD fiable.",
      role: "Desarrollo backend y modelado de datos.",
      decision: "Rutas Express sobre MongoDB con Mongoose.",
      outcome: "Bases sólidas de backend."
    },
    "java-projects": {
      summary:
        "Java orientado a objetos: registros escolares y ahorro personal.",
      alsoKnownAs: "Student Management System · Save-Wise",
      problem: "Unas buenas bases necesitan más que interfaces.",
      role: "Desarrollo Java centrado en POO.",
      decision:
        "Practicar abstracción, interfaces y repositorios con lógica real.",
      outcome: "Fundamentos de ingeniería más profundos."
    }
  }
};

export const localizedProjects: Record<Locale, Project[]> = {
  en: base.map((p) => ({ ...p, ...text.en[p.id] })),
  fr: base.map((p) => ({ ...p, ...text.fr[p.id] })),
  es: base.map((p) => ({ ...p, ...text.es[p.id] }))
};
