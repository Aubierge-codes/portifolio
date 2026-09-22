"use client";

import { AboutSection } from "@/components/about/about-section";
import { ContactSection } from "@/components/contact/contact-section";
import { CredibilityStrip } from "@/components/credibility/credibility-strip";
import { FaqSection } from "@/components/faq/faq-section";
import { SiteFooter } from "@/components/footer/site-footer";
import { Hero } from "@/components/hero/hero";
import { LoadingSequence } from "@/components/loading/loading-sequence";
import { Navigation } from "@/components/navigation/navigation";
import { ProcessSection } from "@/components/process/process-section";
import { ProjectStories } from "@/components/work/project-stories";
import { WorkSection } from "@/components/work/work-section";
import { useLocale } from "@/hooks/use-locale";

export default function Home() {
  const { locale, setLocale, t, bundle } = useLocale();

  return (
    <>
      <LoadingSequence skipLabel={t("skip")} />
      <Navigation locale={locale} setLocale={setLocale} t={t} />
      <main>
        <Hero t={t} />
        <CredibilityStrip title={t("credibility.title")} items={bundle.credibility} />
        <WorkSection t={t} locale={locale} />
        <ProjectStories t={t} locale={locale} />
        <ProcessSection t={t} steps={bundle.process} />
        <AboutSection t={t} />
        <FaqSection t={t} items={bundle.faq} />
        <ContactSection t={t} />
      </main>
      <SiteFooter locale={locale} setLocale={setLocale} t={t} />
    </>
  );
}
