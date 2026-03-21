"use client";

import { motion } from "motion/react";
import { PersonCard } from "@/components";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const formerBoard = [
  {
    name: "Pedro Martínez",
    title: "President",
    image: "/images/people/former-1.jpg",
  },
  {
    name: "Elena Gutiérrez",
    title: "Vice-President",
    image: "/images/people/former-2.jpg",
  },
  {
    name: "Ricardo Flores",
    title: "Secretary",
    image: "/images/people/former-3.jpg",
  },
  {
    name: "Diana Castro",
    title: "Director",
    image: "/images/people/former-4.jpg",
  },
];

const formerAdvisory = [
  {
    name: "Manuel Reyes",
    title: "Advisor",
    image: "/images/people/former-5.jpg",
  },
  {
    name: "Sandra Núñez",
    title: "Advisor",
    image: "/images/people/former-6.jpg",
  },
  {
    name: "José Medina",
    title: "Advisor",
    image: "/images/people/former-7.jpg",
  },
  {
    name: "Rosa Delgado",
    title: "Advisor",
    image: "/images/people/former-8.jpg",
  },
];

const electoralCouncil = [
  {
    name: "Alberto García",
    title: "President",
    image: "/images/people/former-9.jpg",
  },
  {
    name: "Lucia Herrera",
    title: "Secretary",
    image: "/images/people/former-10.jpg",
  },
  {
    name: "Felipe Ortiz",
    title: "Member",
    image: "/images/people/former-11.jpg",
  },
];

const vapaNextGen = [
  {
    name: "Alejandro Paredes",
    title: "Coordinator",
    image: "/images/people/former-12.jpg",
  },
  {
    name: "Valentina Rojas",
    title: "Member",
    image: "/images/people/former-13.jpg",
  },
  {
    name: "Daniel Vega",
    title: "Member",
    image: "/images/people/former-14.jpg",
  },
];

interface SectionProps {
  title: string;
  members: { name: string; title: string; image: string }[];
}

function MemberSection({ title, members }: SectionProps) {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <motion.h2
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-xl md:text-2xl lg:text-[32px] font-bold text-foreground"
      >
        {title}
      </motion.h2>
      <div className="flex flex-wrap gap-4 md:gap-5 lg:gap-6">
        {members.map((person, index) => (
          <PersonCard
            key={person.name}
            name={person.name}
            title={person.title}
            image={person.image}
            size="small"
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

export function FormersContent() {
  return (
    <section className="flex flex-col gap-12 md:gap-14 lg:gap-16 px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[80px] bg-surface-elevated">
      <MemberSection title="Former Board of Directors" members={formerBoard} />
      <MemberSection title="Former Advisory Council" members={formerAdvisory} />
      <MemberSection title="Electoral Council" members={electoralCouncil} />
      <MemberSection title="VAPA Next Gen" members={vapaNextGen} />
    </section>
  );
}
