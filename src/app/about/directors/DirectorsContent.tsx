"use client";

import { PersonCard } from "@/components";

const directors = [
  {
    name: "Oman Oquendo",
    title: "President",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
  },
  {
    name: "Teresa Martín",
    title: "Vice-President",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
  },
  {
    name: "Héctor Salinas",
    title: "Secretary",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    name: "Ysnardo Romero",
    title: "Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    name: "Elar Rincón",
    title: "Director",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
  },
  {
    name: "Leida Galarraga",
    title: "Director",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
  },
  {
    name: "Flor Pineda",
    title: "Director",
    image: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&h=400&fit=crop",
  },
  {
    name: "Lino Zambrano",
    title: "Director",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    name: "Rafael Serrano",
    title: "Director",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
  },
];

export function DirectorsContent() {
  return (
    <section className="flex flex-col gap-10 md:gap-14 lg:gap-16 px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[80px] bg-surface-elevated">
      {/* Row 1 - First 4 directors */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
        {directors.slice(0, 4).map((person, index) => (
          <PersonCard
            key={person.name}
            name={person.name}
            title={person.title}
            image={person.image}
            size="medium"
            index={index}
          />
        ))}
      </div>

      {/* Row 2 - Next 2 directors */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
        {directors.slice(4, 6).map((person, index) => (
          <PersonCard
            key={person.name}
            name={person.name}
            title={person.title}
            image={person.image}
            size="medium"
            index={index}
          />
        ))}
      </div>

      {/* Row 3 - Last 3 directors */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
        {directors.slice(6).map((person, index) => (
          <PersonCard
            key={person.name}
            name={person.name}
            title={person.title}
            image={person.image}
            size="medium"
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
