"use client";

import { LayoutGroup } from "framer-motion";
import { AboutSection } from "@/components/about/about-section";
import { ContactSection } from "@/components/contact/contact-section";
import { FaqSection } from "@/components/faq/faq-section";
import { SiteFooter } from "@/components/footer/site-footer";
import { Hero } from "@/components/hero/hero";
import { Navigation } from "@/components/navigation/navigation";
import { ProcessSection } from "@/components/process/process-section";
import { EmbeddedSection } from "@/components/projects/embedded-section";
import { WorkSection } from "@/components/work/work-section";
import { useLocale } from "@/hooks/use-locale";

export default function Home() {
  const { locale, setLocale, t, bundle } = useLocale();

  return (
    <LayoutGroup id="aubierge-world">
      <a href="#work" className="skip-link">
        {t("skip")}
      </a>
      <Navigation locale={locale} setLocale={setLocale} t={t} />
      <main>
        <Hero t={t} />
        <WorkSection t={t} locale={locale} />
        <EmbeddedSection t={t} />
        <ProcessSection t={t} steps={bundle.process} />
        <AboutSection t={t} achievements={bundle.achievements} />
        <FaqSection t={t} items={bundle.faq} />
        <ContactSection t={t} />
      </main>
      <SiteFooter locale={locale} setLocale={setLocale} t={t} />
    </LayoutGroup>
  );
}
