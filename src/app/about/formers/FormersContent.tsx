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
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
  },
  {
    name: "Elena Gutiérrez",
    title: "Vice-President",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
  },
  {
    name: "Ricardo Flores",
    title: "Secretary",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    name: "Diana Castro",
    title: "Director",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
  },
];

const formerAdvisory = [
  {
    name: "Manuel Reyes",
    title: "Advisor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    name: "Sandra Núñez",
    title: "Advisor",
    image: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&h=400&fit=crop",
  },
  {
    name: "José Medina",
    title: "Advisor",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
  },
  {
    name: "Rosa Delgado",
    title: "Advisor",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop",
  },
];

const electoralCouncil = [
  {
    name: "Alberto García",
    title: "President",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    name: "Lucia Herrera",
    title: "Secretary",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  },
  {
    name: "Felipe Ortiz",
    title: "Member",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
  },
];

const vapaNextGen = [
  {
    name: "Alejandro Paredes",
    title: "Coordinator",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop",
  },
  {
    name: "Valentina Rojas",
    title: "Member",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop",
  },
  {
    name: "Daniel Vega",
    title: "Member",
    image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop",
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
        className="text-xl md:text-2xl lg:text-[32px] font-bold text-white"
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
