import type { FaqItem, Locale, ProcessStep, TranslationKey } from "@/types/content";

type TranslationBundle = Record<TranslationKey, string> & {
  credibility: string[];
  process: ProcessStep[];
  faq: FaqItem[];
};

export const languages: { code: Locale; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "fr", label: "Francais", short: "FR" },
  { code: "es", label: "Espanol", short: "ES" }
];

export const translations: Record<Locale, TranslationBundle> = {
  en: {
    skip: "Skip loading animation",
    brand: "Aubierge.",
    "nav.work": "Work",
    "nav.process": "Process",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.viewWork": "View Work",
    "language.label": "Select language",
    "hero.eyebrow": "Software Developer · Frontend · AI · Embedded Systems",
    "hero.title": "I build software that turns ideas into useful experiences.",
    "hero.copy":
      "Software developer at Rwanda Coding Academy, building interfaces, intelligent applications, and technology that connects ideas to real-world problems.",
    "hero.primary": "View My Work",
    "hero.secondary": "About Me",
    "hero.scroll": "Scroll to selected work",
    "credibility.title": "Signals",
    "work.eyebrow": "Selected work",
    "work.title": "Projects built around real problems, not empty tech demos.",
    "work.copy":
      "Each project is presented through the problem, Aubierge's role, a key technical decision, and the current result.",
    "project.problem": "Problem",
    "project.role": "Role",
    "project.decision": "Decision",
    "project.outcome": "Outcome",
    "project.result": "Result",
    "project.technology": "Technology",
    "stories.eyebrow": "Project stories",
    "stories.title": "The work moves from interface craft to systems that touch hardware, data, and community.",
    "stories.copy":
      "The strongest thread is learning by building: turn a problem into a prototype, then refine it until people can use it.",
    "process.eyebrow": "How Aubierge works",
    "process.title": "A practical build loop for ideas that need to become real.",
    "process.copy":
      "The process is intentionally simple: understand the problem, make something testable, learn from what breaks, and improve.",
    "about.eyebrow": "About",
    "about.title": "Software, hardware, and people belong in the same conversation.",
    "about.copy":
      "Aubierge Umurerwa studies Software Development and Embedded Systems at Rwanda Coding Academy. She enjoys building the interface, the backend, and the physical or data layer when the problem asks for it.",
    "about.note":
      "Her projects sit across Technovation, robotics, AI, community technology, product prototyping, and leadership training.",
    "faq.eyebrow": "FAQ",
    "faq.title": "Practical answers for recruiters, collaborators, and clients.",
    "contact.eyebrow": "Contact",
    "contact.title": "Have an idea worth building?",
    "contact.copy":
      "Let's turn the problem, idea, or prototype into something people can actually use.",
    "contact.primary": "Start a Conversation",
    "contact.secondary": "View GitHub",
    "footer.role": "Software Developer · Frontend · AI · Embedded Systems",
    "footer.explore": "Explore",
    "footer.connect": "Connect",
    "footer.languages": "Languages",
    "footer.built": "Built with intention.",
    "form.name": "Name",
    "form.email": "Email",
    "form.message": "Message",
    "form.send": "Send",
    "form.note": "This form is prepared for a future email service. Email is the fastest path today.",
    credibility: [
      "Rwanda Coding Academy",
      "Technovation 2026 Semifinalist",
      "Girl in Bloom Global Ambassador 2026",
      "AI · Web · Embedded Systems",
      "Robotics & Innovation"
    ],
    process: [
      {
        number: "01",
        title: "Understand",
        body: "Start with the problem, the people affected, and the constraints that will shape the system.",
        skills: ["Product thinking", "Research", "Accessible technology"]
      },
      {
        number: "02",
        title: "Prototype",
        body: "Turn the idea into something testable before pretending it is finished.",
        skills: ["React", "Vite", "Framer Motion", "Figma thinking"]
      },
      {
        number: "03",
        title: "Build",
        body: "Design the interface and architecture together so the product feels clear and holds up technically.",
        skills: ["Next.js", "TypeScript", "Node.js", "Express", "NestJS"]
      },
      {
        number: "04",
        title: "Test",
        body: "Look for broken states, unclear flows, slow interactions, and data assumptions that need pressure.",
        skills: ["REST APIs", "Swagger", "PostgreSQL", "MongoDB"]
      },
      {
        number: "05",
        title: "Ship",
        body: "Package the working idea into something usable, responsive, and understandable.",
        skills: ["Git", "GitHub", "Vercel", "Tailwind CSS"]
      },
      {
        number: "06",
        title: "Iterate",
        body: "Improve through evidence, feedback, community context, and new technical learning.",
        skills: ["OpenAI API", "Python", "FastAPI", "Raspberry Pi", "Sensors"]
      }
    ],
    faq: [
      {
        question: "What do you build?",
        answer:
          "Frontend interfaces, full-stack applications, AI-assisted products, embedded prototypes, and community-focused technology projects."
      },
      {
        question: "What technologies do you work with?",
        answer:
          "React, Next.js, JavaScript, TypeScript, Node.js, Express, NestJS, PostgreSQL, MongoDB, Prisma, Python, FastAPI, OpenAI API, Arduino, ESP32, Raspberry Pi, and related tools."
      },
      {
        question: "Are you available for internships or collaborations?",
        answer:
          "Yes. The portfolio is designed for internship conversations, collaborators, mentors, and clients with useful problems to solve."
      },
      {
        question: "Do you work on both frontend and backend?",
        answer:
          "Yes. Several projects include interface work, API design, authentication, databases, integrations, and deployment-oriented structure."
      },
      {
        question: "Do you build embedded and AI projects too?",
        answer:
          "Yes. Aubierge works with AI-powered applications, robotics-related projects, Raspberry Pi, NodeMCU, sensors, and data-driven prototypes."
      },
      {
        question: "Where can I see your code?",
        answer:
          "Start with GitHub at github.com/Aubierge-codes. Public repositories are linked from project cards when verified."
      }
    ]
  },
  fr: {
    skip: "Passer l'animation de chargement",
    brand: "Aubierge.",
    "nav.work": "Projets",
    "nav.process": "Processus",
    "nav.about": "A propos",
    "nav.contact": "Contact",
    "nav.viewWork": "Voir les projets",
    "language.label": "Choisir la langue",
    "hero.eyebrow": "Developpeuse logiciel · Frontend · IA · Systemes embarques",
    "hero.title": "Je construis des logiciels qui transforment les idees en experiences utiles.",
    "hero.copy":
      "Developpeuse a Rwanda Coding Academy, elle cree des interfaces, des applications intelligentes et des technologies reliees aux problemes reels.",
    "hero.primary": "Voir mon travail",
    "hero.secondary": "A propos",
    "hero.scroll": "Aller aux projets selectionnes",
    "credibility.title": "Reperes",
    "work.eyebrow": "Travaux selectionnes",
    "work.title": "Des projets construits autour de vrais problemes, pas de simples demos techniques.",
    "work.copy":
      "Chaque projet presente le probleme, le role d'Aubierge, une decision technique importante et le resultat actuel.",
    "project.problem": "Probleme",
    "project.role": "Role",
    "project.decision": "Decision",
    "project.outcome": "Resultat",
    "project.result": "Resultat",
    "project.technology": "Technologie",
    "stories.eyebrow": "Histoires de projets",
    "stories.title": "Le travail va de l'interface aux systemes qui touchent le materiel, les donnees et la communaute.",
    "stories.copy":
      "Le fil conducteur est l'apprentissage par la construction: transformer un probleme en prototype, puis l'ameliorer jusqu'a ce qu'il soit utilisable.",
    "process.eyebrow": "Methode de travail",
    "process.title": "Une boucle de construction pratique pour les idees qui doivent devenir reelles.",
    "process.copy":
      "Le processus reste simple: comprendre le probleme, creer quelque chose de testable, apprendre de ce qui casse, puis ameliorer.",
    "about.eyebrow": "A propos",
    "about.title": "Le logiciel, le materiel et les personnes doivent rester dans la meme conversation.",
    "about.copy":
      "Aubierge Umurerwa etudie le developpement logiciel et les systemes embarques a Rwanda Coding Academy. Elle aime construire l'interface, le backend et la couche physique ou data quand le probleme le demande.",
    "about.note":
      "Ses projets croisent Technovation, la robotique, l'IA, la technologie communautaire, le prototypage produit et la formation au leadership.",
    "faq.eyebrow": "FAQ",
    "faq.title": "Des reponses pratiques pour recruteurs, collaborateurs et clients.",
    "contact.eyebrow": "Contact",
    "contact.title": "Vous avez une idee qui merite d'etre construite ?",
    "contact.copy":
      "Transformons le probleme, l'idee ou le prototype en quelque chose que les gens peuvent vraiment utiliser.",
    "contact.primary": "Commencer une conversation",
    "contact.secondary": "Voir GitHub",
    "footer.role": "Developpeuse logiciel · Frontend · IA · Systemes embarques",
    "footer.explore": "Explorer",
    "footer.connect": "Connecter",
    "footer.languages": "Langues",
    "footer.built": "Construit avec intention.",
    "form.name": "Nom",
    "form.email": "Email",
    "form.message": "Message",
    "form.send": "Envoyer",
    "form.note": "Ce formulaire est pret pour un futur service email. Aujourd'hui, l'email reste le chemin le plus rapide.",
    credibility: [
      "Rwanda Coding Academy",
      "Demi-finaliste Technovation 2026",
      "Ambassadrice Girl in Bloom Global 2026",
      "IA · Web · Systemes embarques",
      "Robotique & innovation"
    ],
    process: [
      {
        number: "01",
        title: "Comprendre",
        body: "Commencer par le probleme, les personnes concernees et les contraintes qui vont guider le systeme.",
        skills: ["Produit", "Recherche", "Technologie accessible"]
      },
      {
        number: "02",
        title: "Prototyper",
        body: "Transformer l'idee en quelque chose de testable avant de la declarer terminee.",
        skills: ["React", "Vite", "Framer Motion", "Pensee design"]
      },
      {
        number: "03",
        title: "Construire",
        body: "Concevoir l'interface et l'architecture ensemble pour obtenir un produit clair et solide.",
        skills: ["Next.js", "TypeScript", "Node.js", "Express", "NestJS"]
      },
      {
        number: "04",
        title: "Tester",
        body: "Chercher les etats casses, les parcours flous, les lenteurs et les hypotheses data fragiles.",
        skills: ["REST APIs", "Swagger", "PostgreSQL", "MongoDB"]
      },
      {
        number: "05",
        title: "Livrer",
        body: "Transformer l'idee fonctionnelle en experience utilisable, responsive et comprehensible.",
        skills: ["Git", "GitHub", "Vercel", "Tailwind CSS"]
      },
      {
        number: "06",
        title: "Iterer",
        body: "Ameliorer grace aux preuves, aux retours, au contexte communautaire et aux nouveaux apprentissages.",
        skills: ["OpenAI API", "Python", "FastAPI", "Raspberry Pi", "Capteurs"]
      }
    ],
    faq: [
      {
        question: "Que construisez-vous ?",
        answer:
          "Des interfaces frontend, des applications full-stack, des produits aides par l'IA, des prototypes embarques et des projets technologiques communautaires."
      },
      {
        question: "Quelles technologies utilisez-vous ?",
        answer:
          "React, Next.js, JavaScript, TypeScript, Node.js, Express, NestJS, PostgreSQL, MongoDB, Prisma, Python, FastAPI, OpenAI API, Arduino, ESP32 et Raspberry Pi."
      },
      {
        question: "Etes-vous disponible pour des stages ou collaborations ?",
        answer:
          "Oui. Ce portfolio est concu pour ouvrir des discussions avec recruteurs, collaborateurs, mentors et clients."
      },
      {
        question: "Travaillez-vous sur le frontend et le backend ?",
        answer:
          "Oui. Plusieurs projets incluent interface, API, authentification, bases de donnees, integrations et structure de deploiement."
      },
      {
        question: "Construisez-vous aussi des projets embarques et IA ?",
        answer:
          "Oui. Aubierge travaille sur des applications IA, des projets de robotique, Raspberry Pi, NodeMCU, capteurs et prototypes data."
      },
      {
        question: "Ou voir votre code ?",
        answer:
          "Commencez par GitHub: github.com/Aubierge-codes. Les depots publics verifies sont lies depuis les projets."
      }
    ]
  },
  es: {
    skip: "Saltar animacion de carga",
    brand: "Aubierge.",
    "nav.work": "Trabajo",
    "nav.process": "Proceso",
    "nav.about": "Sobre mi",
    "nav.contact": "Contacto",
    "nav.viewWork": "Ver trabajo",
    "language.label": "Seleccionar idioma",
    "hero.eyebrow": "Desarrolladora de software · Frontend · IA · Sistemas embebidos",
    "hero.title": "Construyo software que convierte ideas en experiencias utiles.",
    "hero.copy":
      "Desarrolladora en Rwanda Coding Academy, creando interfaces, aplicaciones inteligentes y tecnologia conectada con problemas reales.",
    "hero.primary": "Ver mi trabajo",
    "hero.secondary": "Sobre mi",
    "hero.scroll": "Ir al trabajo seleccionado",
    "credibility.title": "Senales",
    "work.eyebrow": "Trabajo seleccionado",
    "work.title": "Proyectos creados alrededor de problemas reales, no demos vacias.",
    "work.copy":
      "Cada proyecto muestra el problema, el rol de Aubierge, una decision tecnica clave y el estado actual.",
    "project.problem": "Problema",
    "project.role": "Rol",
    "project.decision": "Decision",
    "project.outcome": "Resultado",
    "project.result": "Resultado",
    "project.technology": "Tecnologia",
    "stories.eyebrow": "Historias de proyecto",
    "stories.title": "El trabajo va desde interfaces hasta sistemas con hardware, datos y comunidad.",
    "stories.copy":
      "La linea principal es aprender construyendo: convertir un problema en prototipo y mejorarlo hasta que sea usable.",
    "process.eyebrow": "Como trabaja Aubierge",
    "process.title": "Un ciclo practico para que las ideas se vuelvan reales.",
    "process.copy":
      "El proceso es simple: entender el problema, crear algo comprobable, aprender de lo que falla y mejorar.",
    "about.eyebrow": "Sobre mi",
    "about.title": "Software, hardware y personas pertenecen a la misma conversacion.",
    "about.copy":
      "Aubierge Umurerwa estudia Desarrollo de Software y Sistemas Embebidos en Rwanda Coding Academy. Disfruta crear la interfaz, el backend y la capa fisica o de datos cuando el problema lo requiere.",
    "about.note":
      "Sus proyectos conectan Technovation, robotica, IA, tecnologia comunitaria, prototipado de productos y liderazgo.",
    "faq.eyebrow": "FAQ",
    "faq.title": "Respuestas practicas para reclutadores, colaboradores y clientes.",
    "contact.eyebrow": "Contacto",
    "contact.title": "Tienes una idea que vale la pena construir?",
    "contact.copy":
      "Convirtamos el problema, la idea o el prototipo en algo que la gente pueda usar de verdad.",
    "contact.primary": "Iniciar conversacion",
    "contact.secondary": "Ver GitHub",
    "footer.role": "Desarrolladora de software · Frontend · IA · Sistemas embebidos",
    "footer.explore": "Explorar",
    "footer.connect": "Conectar",
    "footer.languages": "Idiomas",
    "footer.built": "Construido con intencion.",
    "form.name": "Nombre",
    "form.email": "Email",
    "form.message": "Mensaje",
    "form.send": "Enviar",
    "form.note": "Este formulario queda preparado para un futuro servicio de correo. Hoy, el email es el camino mas rapido.",
    credibility: [
      "Rwanda Coding Academy",
      "Semifinalista Technovation 2026",
      "Embajadora Girl in Bloom Global 2026",
      "IA · Web · Sistemas embebidos",
      "Robotica e innovacion"
    ],
    process: [
      {
        number: "01",
        title: "Entender",
        body: "Empezar con el problema, las personas afectadas y las restricciones que daran forma al sistema.",
        skills: ["Producto", "Investigacion", "Tecnologia accesible"]
      },
      {
        number: "02",
        title: "Prototipar",
        body: "Convertir la idea en algo comprobable antes de fingir que esta terminada.",
        skills: ["React", "Vite", "Framer Motion", "Pensamiento de diseno"]
      },
      {
        number: "03",
        title: "Construir",
        body: "Disenar la interfaz y la arquitectura juntas para que el producto sea claro y resistente.",
        skills: ["Next.js", "TypeScript", "Node.js", "Express", "NestJS"]
      },
      {
        number: "04",
        title: "Probar",
        body: "Buscar estados rotos, flujos confusos, interacciones lentas e hipotesis de datos fragiles.",
        skills: ["REST APIs", "Swagger", "PostgreSQL", "MongoDB"]
      },
      {
        number: "05",
        title: "Publicar",
        body: "Convertir la idea funcional en un producto usable, responsive y comprensible.",
        skills: ["Git", "GitHub", "Vercel", "Tailwind CSS"]
      },
      {
        number: "06",
        title: "Iterar",
        body: "Mejorar con evidencia, feedback, contexto comunitario y nuevo aprendizaje tecnico.",
        skills: ["OpenAI API", "Python", "FastAPI", "Raspberry Pi", "Sensores"]
      }
    ],
    faq: [
      {
        question: "Que construyes?",
        answer:
          "Interfaces frontend, aplicaciones full-stack, productos asistidos por IA, prototipos embebidos y proyectos de tecnologia comunitaria."
      },
      {
        question: "Con que tecnologias trabajas?",
        answer:
          "React, Next.js, JavaScript, TypeScript, Node.js, Express, NestJS, PostgreSQL, MongoDB, Prisma, Python, FastAPI, OpenAI API, Arduino, ESP32 y Raspberry Pi."
      },
      {
        question: "Estas disponible para pasantias o colaboraciones?",
        answer:
          "Si. Este portfolio esta pensado para conversaciones con reclutadores, colaboradores, mentores y clientes."
      },
      {
        question: "Trabajas en frontend y backend?",
        answer:
          "Si. Varios proyectos incluyen interfaz, APIs, autenticacion, bases de datos, integraciones y estructura para despliegue."
      },
      {
        question: "Tambien creas proyectos embebidos y de IA?",
        answer:
          "Si. Aubierge trabaja con aplicaciones de IA, proyectos de robotica, Raspberry Pi, NodeMCU, sensores y prototipos con datos."
      },
      {
        question: "Donde puedo ver tu codigo?",
        answer:
          "Empieza en GitHub: github.com/Aubierge-codes. Los repositorios publicos verificados estan enlazados desde los proyectos."
      }
    ]
  }
};
