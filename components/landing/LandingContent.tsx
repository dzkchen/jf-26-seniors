"use client";

import Link from "next/link";
import { motion } from "motion/react";

const COLORS = {
  navy: "#15375c",
  primary: "#1581f4",
  deep: "#0e3c6f",
};

export function LandingHero() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 sm:py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl"
      >
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4"
          style={{ color: COLORS.navy }}
        >
          John Fraser Secondary
        </h1>
        <p
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6"
          style={{ color: COLORS.primary }}
        >
          Class of 2026
        </p>
        <p
          className="text-lg sm:text-xl mb-10 max-w-xl mx-auto"
          style={{ color: COLORS.deep }}
        >
          To be filled out as the project progresses
        </p>
        <Link
          href="/survey"
          className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:opacity-95"
          style={{ backgroundColor: COLORS.primary }}
        >
          Survey Form
        </Link>
      </motion.div>
    </section>
  );
}

const cards = [
  {
    href: "/class-profile",
    title: "Class Profile",
    description: "Releasing in June",
  },
  {
    href: "/graduates",
    title: "Stay Connected",
    description: "Releasing in June",
  },
  {
    href: "/rewind",
    title: "Rewind",
    description: "Releasing in June",
  },
] as const;

export function LandingCards() {
  return (
    <section className="px-6 pb-24 sm:pb-32 max-w-5xl mx-auto w-full">
      <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
        {cards.map(({ href, title, description }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link
              href={href}
              className="block rounded-2xl p-6 shadow-md transition hover:shadow-lg h-full border border-white/80"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
            >
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: COLORS.navy }}
              >
                {title}
              </h3>
              <p className="text-sm" style={{ color: COLORS.deep }}>
                {description}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
