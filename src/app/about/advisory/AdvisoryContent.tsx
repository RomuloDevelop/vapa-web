"use client";

import { PersonCard } from "@/components";

const advisors = [
  {
    name: "Carlos Sánchez",
    title: "Advisor",
    image: "/members/Carlos Sanchez.jpg",
    linkedin: "https://www.linkedin.com/in/carlos-e-sanchez-323a9115/",
  },
  {
    name: "Francisco Gamarra",
    title: "Advisor",
    image: "/members/Francisco.jpeg",
    linkedin: "https://www.linkedin.com/in/francisco-gamarra-652611113",
  },
  {
    name: "Julio Monsalve",
    title: "Advisor",
    image: "/members/Julio Monsalve.png",
    linkedin: "https://www.linkedin.com/in/julio-monsalve-m/",
  },
  {
    name: "Alberto Rial",
    title: "Advisor",
    image: "/members/Alberto Rial.png",
    linkedin: "https://www.linkedin.com/in/alberto-rial-bab79a11/",
  },
  {
    name: "Freddy Goerke",
    title: "Advisor",
    image: "/members/Freddy Goerke.png",
    linkedin: "https://www.linkedin.com/in/freddy-goerke-garcia-0599b960/",
  },
  {
    name: "Ender Barillas",
    title: "Advisor",
    image: "/members/Ender Barillas.png",
    linkedin: "https://www.linkedin.com/in/ebarillas",
  },
  {
    name: "Alexander González",
    title: "Advisor",
    image: "/members/Alexander.jpg",
    linkedin: "https://www.linkedin.com/in/alexander-gonzalez-9b05a87",
  },
  {
    name: "Carlos Moreno",
    title: "Advisor",
    image: "/members/Carlos Moreno.jpg",
    linkedin: "https://www.linkedin.com/in/cmoreno88",
  },
  {
    name: "Lino Carrillo",
    title: "Advisor",
    image: "/members/Lino Carrillo.png",
    linkedin: "https://www.linkedin.com/in/linocarrillo",
  },
  {
    name: "Franklin Sulbaran",
    title: "Advisor",
    image: "/members/Franklin Sulbaran.png",
    linkedin: "https://www.linkedin.com/in/franklin-sulbaran-68a28830/",
  },
];

export function AdvisoryContent() {
  return (
    <section className="flex flex-col gap-8 md:gap-10 px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[80px] bg-surface-elevated">
      {/* Row 1 - First 5 advisors */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-5 lg:gap-6">
        {advisors.slice(0, 5).map((person, index) => (
          <PersonCard
            key={person.name}
            name={person.name}
            title={person.title}
            image={person.image}
            linkedin={person.linkedin}
            size="small"
            index={index}
            priority
          />
        ))}
      </div>

      {/* Row 2 - Last 5 advisors */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-5 lg:gap-6">
        {advisors.slice(5).map((person, index) => (
          <PersonCard
            key={person.name}
            name={person.name}
            title={person.title}
            image={person.image}
            linkedin={person.linkedin}
            size="small"
            index={index}
            priority
          />
        ))}
      </div>
    </section>
  );
}
