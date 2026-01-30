"use client";

import { PersonCard } from "@/components";

const advisors = [
  {
    name: "Carlos Sánchez",
    title: "Advisor",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
  },
  {
    name: "María González",
    title: "Advisor",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
  },
  {
    name: "Roberto Pérez",
    title: "Advisor",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    name: "Ana Rodríguez",
    title: "Advisor",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
  },
  {
    name: "Luis Hernández",
    title: "Advisor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    name: "Carmen López",
    title: "Advisor",
    image: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&h=400&fit=crop",
  },
  {
    name: "Fernando Díaz",
    title: "Advisor",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
  },
  {
    name: "Patricia Morales",
    title: "Advisor",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop",
  },
  {
    name: "Jorge Torres",
    title: "Advisor",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    name: "Sofía Ramírez",
    title: "Advisor",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  },
  {
    name: "Miguel Castro",
    title: "Advisor",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
  },
  {
    name: "Laura Mendoza",
    title: "Advisor",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
  },
  {
    name: "Andrés Vargas",
    title: "Advisor",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop",
  },
  {
    name: "Isabella Ruiz",
    title: "Advisor",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop",
  },
];

export function AdvisoryContent() {
  return (
    <section className="flex flex-col gap-8 md:gap-10 px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[80px] bg-[#1A3352]">
      {/* Row 1 - First 5 advisors */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-5 lg:gap-6">
        {advisors.slice(0, 5).map((person, index) => (
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

      {/* Row 2 - Next 4 advisors */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-5 lg:gap-6">
        {advisors.slice(5, 9).map((person, index) => (
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

      {/* Row 3 - Last 5 advisors */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-5 lg:gap-6">
        {advisors.slice(9).map((person, index) => (
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
    </section>
  );
}
