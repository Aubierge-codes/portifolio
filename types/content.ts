export type Locale = "en" | "fr" | "es";

export type TranslationKey =
  | "skip"
  | "brand"
  | "nav.work"
  | "nav.process"
  | "nav.about"
  | "nav.contact"
  | "nav.viewWork"
  | "nav.menu"
  | "nav.closeMenu"
  | "language.label"
  | "hero.eyebrow"
  | "hero.title"
  | "hero.copy"
  | "hero.primary"
  | "hero.secondary"
  | "work.eyebrow"
  | "work.title"
  | "work.copy"
  | "work.hint"
  | "work.goTo"
  | "project.details"
  | "project.close"
  | "project.problem"
  | "project.role"
  | "project.decision"
  | "project.outcome"
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
  | "form.note"
  | "form.aria"
  | "contact.emailLabel"
  | "contact.githubLabel"
  | "contact.linkedinPending"
  | "balloon.next"
  | "embedded.eyebrow"
  | "embedded.title"
  | "embedded.copy"
  | "about.background"
  | "achievements.eyebrow"
  | "achievements.title"
  | "project.alsoKnown"
  | "project.team"
  | "project.mentor"
  | "project.coach"
  | "project.context"
  | "form.sent";

/** Per-locale copy for a project. Kept short: the 3D chapter does the talking. */
export type ProjectText = {
  /** One line, 12 words or fewer. */
  summary: string;
  alsoKnownAs?: string;
  /** Details panel only. */
  problem: string;
  role: string;
  decision: string;
  outcome: string;
  context?: string;
};

export type Project = ProjectText & {
  id: string;
  name: string;
  /** Three or four. */
  tags: string[];
  team?: string[];
  mentor?: string;
  coach?: string;
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
