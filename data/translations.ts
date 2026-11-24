import type {
  FaqItem,
  Locale,
  ProcessStep,
  TranslationKey
} from "@/types/content";

type TranslationBundle = Record<TranslationKey, string> & {
  credibility: string[];
  achievements: string[];
  process: ProcessStep[];
  faq: FaqItem[];
};

export const languages: { code: Locale; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "fr", label: "Français", short: "FR" },
  { code: "es", label: "Español", short: "ES" }
];

const credibility = [
  "Rwanda Coding Academy",
  "Technovation 2026 Semifinalist",
  "Girl in Bloom Global Ambassador 2026",
  "AI · Web · Embedded Systems",
  "Robotics & Innovation"
];

const achievements = [
  "Rwanda Coding Academy",
  "Technovation 2026 Semifinalist",
  "Girl in Bloom Global Ambassador 2026",
  "First LEGO League Rwanda",
  "AI Hackathon finalist",
  "AIMS National Mathematics Summer Camp 2025",
  "Rwanda Mathematics Competition",
  "ILEAD leadership training"
];

const skills = [
  ["Product thinking", "Research"],
  ["React", "Framer Motion"],
  ["Next.js", "TypeScript", "Node.js"],
  ["REST APIs", "PostgreSQL"],
  ["Git", "Vercel"],
  ["Python", "Raspberry Pi"]
];

export const translations: Record<Locale, TranslationBundle> = {
  en: {
    skip: "Skip to selected work",
    brand: "Aubierge.",
    "nav.work": "Work",
    "nav.process": "Process",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.viewWork": "View Work",
    "nav.menu": "Open menu",
    "nav.closeMenu": "Close menu",
    "nav.sound": "Sound on or off",
    "language.label": "Select language",
    "hero.eyebrow": "Software · AI · Embedded Systems",
    "hero.title": "I build software that turns ideas into useful experiences.",
    "hero.copy": "Developer at Rwanda Coding Academy.",
    "hero.primary": "View My Work",
    "hero.secondary": "About Me",
    "work.eyebrow": "Selected work",
    "work.title": "Ten projects. Scroll through them.",
    "work.copy": "Real problems, built end to end.",
    "work.hint": "Scroll",
    "work.goTo": "Go to project",
    "work.layer": "Layer",
    "work.rain": "Rainfall",
    "work.temp": "Temperature",
    "work.risk": "Relative risk",
    "work.riskNote":
      "Risk exploration from environmental data, not a medical diagnosis.",
    "work.tapTiles": "Tap a tile to step on it.",
    "project.problem": "Problem",
    "project.role": "Role",
    "project.decision": "Decision",
    "project.outcome": "Outcome",
    "project.details": "Details",
    "project.close": "Close",
    "process.eyebrow": "Process",
    "process.title": "How I Build",
    "process.copy": "Understand, test, learn, improve.",
    "process.think": "Think",
    "process.design": "Design",
    "process.build": "Build",
    "process.improve": "Improve",
    "about.eyebrow": "About",
    "about.title": "Software, hardware and people, together.",
    "about.copy":
      "Aubierge Umurerwa studies Software Development and Embedded Systems at Rwanda Coding Academy.",
    "about.note": "She turns problems into systems people can use.",
    "about.background": "Works in English, French and Kinyarwanda.",
    "achievements.eyebrow": "Signals",
    "achievements.title": "A short record.",
    "balloon.next": "NEXT",
    "embedded.eyebrow": "Beyond the browser",
    "embedded.title": "Hardware, data and what sits under the screen.",
    "embedded.copy": "Raspberry Pi, ESP32, Arduino, sensors and ML.",
    "lab.bench": "The bench: real boards, one light.",
    "lab.boards": "Arduino reads. Raspberry Pi computes.",
    "lab.arm": "The arm acts, joint by joint.",
    "lab.inspect": "Inspect",
    "lab.objects": "Objects",
    "lab.run": "Run the arm",
    "lab.stop": "Stop",
    "lab.lid": "Open / close lid",
    "lab.angle": "Angle",
    "lab.light": "Light",
    "lab.front": "Front",
    "lab.threeQuarter": "¾",
    "lab.top": "Top",
    "lab.detail": "Detail",
    "lab.studio": "Studio",
    "lab.dark": "Dark",
    "lab.context": "On the bench",
    "lab.hint": "Drag to turn · scroll or pinch to zoom · arrow keys rotate",
    "lab.parts": "Parts",
    "project.alsoKnown": "Also",
    "project.team": "Team",
    "project.mentor": "Mentor",
    "project.coach": "Coach",
    "project.context": "Context",
    "form.sent": "Opens email with your message.",
    "faq.eyebrow": "FAQ",
    "faq.title": "Quick answers.",
    "contact.eyebrow": "Contact",
    "contact.title": "Have an idea worth building?",
    "contact.copy": "Let's make it something people use.",
    "contact.primary": "Start a Conversation",
    "contact.secondary": "View GitHub",
    "footer.role": "Software · AI · Embedded Systems",
    "footer.explore": "Explore",
    "footer.connect": "Connect",
    "footer.languages": "Languages",
    "footer.built": "Built with intention.",
    "footer.credits": "3D models",
    "footer.modified": "rescaled, re-rigged and re-textured",
    "form.name": "Name",
    "form.email": "Email",
    "form.message": "Message",
    "form.send": "Send",
    "form.note": "Email is the fastest way to reach me.",
    "form.aria": "Contact form",
    "contact.emailLabel": "Email",
    "contact.githubLabel": "GitHub",
    "contact.linkedinPending": "LinkedIn coming soon.",
    credibility,
    achievements,
    process: [
      ["Understand", "Start with the people and the problem."],
      ["Prototype", "Make it testable early."],
      ["Build", "Interface and architecture, together."],
      ["Test", "Find what breaks."],
      ["Ship", "Usable, responsive, clear."],
      ["Iterate", "Improve from evidence."]
    ].map(([title, body], i) => ({
      number: String(i + 1).padStart(2, "0"),
      title,
      body,
      skills: skills[i]
    })),
    faq: [
      {
        question: "What do you build?",
        answer: "Web apps, AI products and embedded prototypes."
      },
      {
        question: "Which technologies?",
        answer:
          "React, Next.js, TypeScript, Node.js, PostgreSQL, Python, Raspberry Pi and Arduino."
      },
      {
        question: "Open to internships?",
        answer: "Yes, and to collaborations with useful problems."
      },
      {
        question: "Where is your code?",
        answer: "github.com/Aubierge-codes"
      }
    ]
  },
  fr: {
    skip: "Aller aux projets",
    brand: "Aubierge.",
    "nav.work": "Projets",
    "nav.process": "Processus",
    "nav.about": "À propos",
    "nav.contact": "Contact",
    "nav.viewWork": "Voir les projets",
    "nav.menu": "Ouvrir le menu",
    "nav.closeMenu": "Fermer le menu",
    "nav.sound": "Son activé ou désactivé",
    "language.label": "Choisir la langue",
    "hero.eyebrow": "Logiciel · IA · Systèmes embarqués",
    "hero.title":
      "Je crée des logiciels qui transforment les idées en expériences utiles.",
    "hero.copy": "Développeuse à Rwanda Coding Academy.",
    "hero.primary": "Voir mon travail",
    "hero.secondary": "À propos",
    "work.eyebrow": "Projets choisis",
    "work.title": "Dix projets. Faites défiler.",
    "work.copy": "De vrais problèmes, construits de bout en bout.",
    "work.hint": "Défiler",
    "work.goTo": "Aller au projet",
    "work.layer": "Couche",
    "work.rain": "Pluie",
    "work.temp": "Température",
    "work.risk": "Risque relatif",
    "work.riskNote":
      "Exploration du risque à partir de données environnementales, pas un diagnostic médical.",
    "work.tapTiles": "Touchez une dalle pour marcher dessus.",
    "project.problem": "Problème",
    "project.role": "Rôle",
    "project.decision": "Décision",
    "project.outcome": "Résultat",
    "project.details": "Détails",
    "project.close": "Fermer",
    "process.eyebrow": "Processus",
    "process.title": "Comment je construis",
    "process.copy": "Comprendre, tester, apprendre, améliorer.",
    "process.think": "Penser",
    "process.design": "Concevoir",
    "process.build": "Construire",
    "process.improve": "Améliorer",
    "about.eyebrow": "À propos",
    "about.title": "Logiciel, matériel et personnes, ensemble.",
    "about.copy":
      "Aubierge Umurerwa étudie le développement logiciel et les systèmes embarqués à Rwanda Coding Academy.",
    "about.note":
      "Elle transforme des problèmes en systèmes que l'on peut utiliser.",
    "about.background": "Travaille en anglais, français et kinyarwanda.",
    "achievements.eyebrow": "Repères",
    "achievements.title": "En bref.",
    "balloon.next": "SUITE",
    "embedded.eyebrow": "Au-delà du navigateur",
    "embedded.title": "Matériel, données et ce qui vit sous l'écran.",
    "embedded.copy": "Raspberry Pi, ESP32, Arduino, capteurs et ML.",
    "lab.bench": "L'établi : de vraies cartes, une seule lumière.",
    "lab.boards": "Arduino lit. Raspberry Pi calcule.",
    "lab.arm": "Le bras agit, articulation par articulation.",
    "lab.inspect": "Inspecter",
    "lab.objects": "Objets",
    "lab.run": "Lancer le bras",
    "lab.stop": "Arrêter",
    "lab.lid": "Ouvrir / fermer",
    "lab.angle": "Angle",
    "lab.light": "Lumière",
    "lab.front": "Face",
    "lab.threeQuarter": "¾",
    "lab.top": "Dessus",
    "lab.detail": "Détail",
    "lab.studio": "Studio",
    "lab.dark": "Sombre",
    "lab.context": "Sur l'établi",
    "lab.hint":
      "Glisser pour tourner · molette ou pincement pour zoomer · flèches pour pivoter",
    "lab.parts": "Composants",
    "project.alsoKnown": "Aussi",
    "project.team": "Équipe",
    "project.mentor": "Mentor",
    "project.coach": "Coach",
    "project.context": "Contexte",
    "form.sent": "Ouvre un e-mail avec votre message.",
    "faq.eyebrow": "FAQ",
    "faq.title": "Réponses rapides.",
    "contact.eyebrow": "Contact",
    "contact.title": "Une idée à construire ?",
    "contact.copy": "Faisons-en quelque chose d'utile.",
    "contact.primary": "Commencer une conversation",
    "contact.secondary": "Voir GitHub",
    "footer.role": "Logiciel · IA · Systèmes embarqués",
    "footer.explore": "Explorer",
    "footer.connect": "Contact",
    "footer.languages": "Langues",
    "footer.built": "Construit avec intention.",
    "footer.credits": "Modèles 3D",
    "footer.modified": "redimensionnés, réarticulés et retexturés",
    "form.name": "Nom",
    "form.email": "E-mail",
    "form.message": "Message",
    "form.send": "Envoyer",
    "form.note": "L'e-mail reste le moyen le plus rapide.",
    "form.aria": "Formulaire de contact",
    "contact.emailLabel": "E-mail",
    "contact.githubLabel": "GitHub",
    "contact.linkedinPending": "LinkedIn bientôt disponible.",
    credibility,
    achievements,
    process: [
      ["Comprendre", "Partir des personnes et du problème."],
      ["Prototyper", "Rendre testable tôt."],
      ["Construire", "Interface et architecture, ensemble."],
      ["Tester", "Trouver ce qui casse."],
      ["Livrer", "Utilisable, responsive, clair."],
      ["Itérer", "Améliorer à partir des faits."]
    ].map(([title, body], i) => ({
      number: String(i + 1).padStart(2, "0"),
      title,
      body,
      skills: skills[i]
    })),
    faq: [
      {
        question: "Que construisez-vous ?",
        answer:
          "Des applications web, des produits IA et des prototypes embarqués."
      },
      {
        question: "Quelles technologies ?",
        answer:
          "React, Next.js, TypeScript, Node.js, PostgreSQL, Python, Raspberry Pi et Arduino."
      },
      {
        question: "Ouverte aux stages ?",
        answer: "Oui, et aux collaborations sur des problèmes utiles."
      },
      {
        question: "Où voir votre code ?",
        answer: "github.com/Aubierge-codes"
      }
    ]
  },
  es: {
    skip: "Ir al trabajo",
    brand: "Aubierge.",
    "nav.work": "Trabajo",
    "nav.process": "Proceso",
    "nav.about": "Sobre mí",
    "nav.contact": "Contacto",
    "nav.viewWork": "Ver trabajo",
    "nav.menu": "Abrir menú",
    "nav.closeMenu": "Cerrar menú",
    "nav.sound": "Sonido sí o no",
    "language.label": "Seleccionar idioma",
    "hero.eyebrow": "Software · IA · Sistemas embebidos",
    "hero.title":
      "Construyo software que convierte ideas en experiencias útiles.",
    "hero.copy": "Desarrolladora en Rwanda Coding Academy.",
    "hero.primary": "Ver mi trabajo",
    "hero.secondary": "Sobre mí",
    "work.eyebrow": "Trabajo seleccionado",
    "work.title": "Diez proyectos. Desplázate.",
    "work.copy": "Problemas reales, resueltos de principio a fin.",
    "work.hint": "Desplazar",
    "work.goTo": "Ir al proyecto",
    "work.layer": "Capa",
    "work.rain": "Lluvia",
    "work.temp": "Temperatura",
    "work.risk": "Riesgo relativo",
    "work.riskNote":
      "Exploración del riesgo con datos ambientales, no un diagnóstico médico.",
    "work.tapTiles": "Toca una baldosa para pisarla.",
    "project.problem": "Problema",
    "project.role": "Rol",
    "project.decision": "Decisión",
    "project.outcome": "Resultado",
    "project.details": "Detalles",
    "project.close": "Cerrar",
    "process.eyebrow": "Proceso",
    "process.title": "Cómo construyo",
    "process.copy": "Entender, probar, aprender, mejorar.",
    "process.think": "Pensar",
    "process.design": "Diseñar",
    "process.build": "Construir",
    "process.improve": "Mejorar",
    "about.eyebrow": "Sobre mí",
    "about.title": "Software, hardware y personas, juntos.",
    "about.copy":
      "Aubierge Umurerwa estudia Desarrollo de Software y Sistemas Embebidos en Rwanda Coding Academy.",
    "about.note": "Convierte problemas en sistemas que la gente puede usar.",
    "about.background": "Trabaja en inglés, francés y kinyarwanda.",
    "achievements.eyebrow": "Señales",
    "achievements.title": "En breve.",
    "balloon.next": "SIGUE",
    "embedded.eyebrow": "Más allá del navegador",
    "embedded.title": "Hardware, datos y lo que vive bajo la pantalla.",
    "embedded.copy": "Raspberry Pi, ESP32, Arduino, sensores y ML.",
    "lab.bench": "El banco: placas reales, una sola luz.",
    "lab.boards": "Arduino lee. Raspberry Pi calcula.",
    "lab.arm": "El brazo actúa, articulación por articulación.",
    "lab.inspect": "Inspeccionar",
    "lab.objects": "Objetos",
    "lab.run": "Mover el brazo",
    "lab.stop": "Detener",
    "lab.lid": "Abrir / cerrar",
    "lab.angle": "Ángulo",
    "lab.light": "Luz",
    "lab.front": "Frente",
    "lab.threeQuarter": "¾",
    "lab.top": "Arriba",
    "lab.detail": "Detalle",
    "lab.studio": "Estudio",
    "lab.dark": "Oscuro",
    "lab.context": "En el banco",
    "lab.hint":
      "Arrastra para girar · rueda o pellizco para acercar · flechas para rotar",
    "lab.parts": "Componentes",
    "project.alsoKnown": "También",
    "project.team": "Equipo",
    "project.mentor": "Mentora",
    "project.coach": "Coach",
    "project.context": "Contexto",
    "form.sent": "Abre un correo con tu mensaje.",
    "faq.eyebrow": "FAQ",
    "faq.title": "Respuestas rápidas.",
    "contact.eyebrow": "Contacto",
    "contact.title": "¿Tienes una idea que construir?",
    "contact.copy": "Hagamos algo que la gente use.",
    "contact.primary": "Iniciar una conversación",
    "contact.secondary": "Ver GitHub",
    "footer.role": "Software · IA · Sistemas embebidos",
    "footer.explore": "Explorar",
    "footer.connect": "Conectar",
    "footer.languages": "Idiomas",
    "footer.built": "Hecho con intención.",
    "footer.credits": "Modelos 3D",
    "footer.modified": "reescalados, rearticulados y retexturizados",
    "form.name": "Nombre",
    "form.email": "Correo",
    "form.message": "Mensaje",
    "form.send": "Enviar",
    "form.note": "El correo es la vía más rápida.",
    "form.aria": "Formulario de contacto",
    "contact.emailLabel": "Correo",
    "contact.githubLabel": "GitHub",
    "contact.linkedinPending": "LinkedIn próximamente.",
    credibility,
    achievements,
    process: [
      ["Entender", "Empezar por las personas y el problema."],
      ["Prototipar", "Hacerlo comprobable pronto."],
      ["Construir", "Interfaz y arquitectura, juntas."],
      ["Probar", "Encontrar lo que falla."],
      ["Entregar", "Usable, adaptable, claro."],
      ["Iterar", "Mejorar con evidencia."]
    ].map(([title, body], i) => ({
      number: String(i + 1).padStart(2, "0"),
      title,
      body,
      skills: skills[i]
    })),
    faq: [
      {
        question: "¿Qué construyes?",
        answer: "Apps web, productos de IA y prototipos embebidos."
      },
      {
        question: "¿Qué tecnologías?",
        answer:
          "React, Next.js, TypeScript, Node.js, PostgreSQL, Python, Raspberry Pi y Arduino."
      },
      {
        question: "¿Abierta a prácticas?",
        answer: "Sí, y a colaboraciones con problemas útiles."
      },
      {
        question: "¿Dónde está tu código?",
        answer: "github.com/Aubierge-codes"
      }
    ]
  }
};
