export type Locale = "en" | "fr" | "es";

export type TranslationKey =
  | "skip"
  | "brand"
  | "nav.work"
  | "nav.process"
  | "nav.about"
  | "nav.contact"
  | "nav.viewWork"
  | "language.label"
  | "hero.eyebrow"
  | "hero.title"
  | "hero.copy"
  | "hero.primary"
  | "hero.secondary"
  | "hero.scroll"
  | "credibility.title"
  | "work.eyebrow"
  | "work.title"
  | "work.copy"
  | "project.problem"
  | "project.role"
  | "project.decision"
  | "project.outcome"
  | "project.result"
  | "project.technology"
  | "stories.eyebrow"
  | "stories.title"
  | "stories.copy"
  | "process.eyebrow"
  | "process.title"
  | "process.copy"
  | "about.eyebrow"
  | "about.title"
  | "about.copy"
  | "about.note"
  | "faq.eyebrow"
  | "faq.title"
  | "contact.eyebrow"
  | "contact.title"
  | "contact.copy"
  | "contact.primary"
  | "contact.secondary"
  | "footer.role"
  | "footer.explore"
  | "footer.connect"
  | "footer.languages"
  | "footer.built"
  | "form.name"
  | "form.email"
  | "form.message"
  | "form.send"
  | "form.note";

export type ProjectSize = "feature" | "large" | "medium" | "small";

export type Project = {
  id: string;
  name: string;
  alsoKnownAs?: string;
  category: string;
  size: ProjectSize;
  problem: string;
  role: string;
  decision: string;
  outcome: string;
  technologies: string[];
  links?: {
    label: string;
    href: string;
  }[];
};

export type ProcessStep = {
  number: string;
  title: string;
  body: string;
  skills: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};
