"use client";

import { PersonCard } from "@/components";

const directors = [
  {
    name: "Oman Oquendo",
    title: "President",
    image: "/members/Oman Oquendo.png",
    linkedin: "https://www.linkedin.com/in/oman-oquendo-3a719424/",
  },
  {
    name: "Tomás Marta",
    title: "Vice President",
    image: "/members/Tomas Marta.png",
    linkedin: "https://www.linkedin.com/in/tomasjmata/",
  },
  {
    name: "María Bolívar",
    title: "Treasurer",
    image: "/members/Maria Bolivar.png",
    linkedin: "https://www.linkedin.com/in/maria-bolivar-70996247/",
  },
  {
    name: "Tyrone Perdomo",
    title: "Secretary",
    image: "/members/Tyrone Perdomo.jpg",
    linkedin: "https://www.linkedin.com/in/tyrone-perdomo-a3196513",
  },
  {
    name: "Flor Pineda",
    title: "Director",
    image: "/members/Flor.jpg",
    linkedin: "https://www.linkedin.com/in/flor-pineda-054a9216",
  },
  {
    name: "Lirio Quintero",
    title: "Director",
    image: "/members/Lirio Quintero.png",
  },
  {
    name: "Isabel Serrano",
    title: "Director",
    image: "/members/Isabel Serrano.png",
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
            linkedin={person.linkedin}
            size="medium"
            index={index}
            priority
          />
        ))}
      </div>

      {/* Row 2 - Last 3 directors */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
        {directors.slice(4).map((person, index) => (
          <PersonCard
            key={person.name}
            name={person.name}
            title={person.title}
            image={person.image}
            linkedin={person.linkedin}
            size="medium"
            index={index}
            priority
          />
        ))}
      </div>
    </section>
  );
}
