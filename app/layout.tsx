import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { SITE_NAME } from "@/lib/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-bricolage",
  display: "swap"
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: `${SITE_NAME} | Software Developer`,
  description: `Portfolio of ${SITE_NAME}, a Rwanda Coding Academy software development and embedded systems student building frontend, AI, full-stack, and hardware-connected systems.`,
  metadataBase: new URL("https://aubierge.dev"),
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  keywords: [
    SITE_NAME,
    "frontend developer",
    "software developer",
    "Rwanda Coding Academy",
    "AI applications",
    "embedded systems",
    "robotics",
    "full-stack development"
  ],
  openGraph: {
    title: `${SITE_NAME} | Software Developer`,
    description:
      "Frontend, AI, full-stack, embedded systems, and technology-for-impact projects.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${dmSans.variable}`}>
      <body className="font-body">
        {/* Without JavaScript nothing would ever lift the loader. */}
        <noscript>
          <style>{"[data-site-loader]{display:none!important}"}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
