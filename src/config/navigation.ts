export interface NavSubItem {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
  mobileOnly?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  scrollTo?: boolean;
  children?: NavSubItem[];
}

export const navigationConfig: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about/history",
    children: [
      {
        label: "Our History",
        href: "/about/history",
        description: "Learn about VAPA's mission, history, and vision.",
      },
      {
        label: "VAPA Links",
        href: "/about/links",
        description: "Useful resources and partner connections.",
      },
      {
        label: "Board of Directors",
        href: "/about/directors",
        description: "Meet our leadership team guiding VAPA's strategic vision.",
      },
      {
        label: "VAPA ResPro",
        href: "/about/respro",
        description: "Our professional responsibility and ethics program.",
      },
      {
        label: "Advisory Board",
        href: "/about/advisory",
        description: "Industry experts providing guidance and expertise.",
      }
    ],
  },
  {
    label: "Events",
    href: "",
    children: [
      {
        label: "Webinars",
        href: "/events/webinars",
        description: "Weekly webinars on energy, economics, and Venezuela.",
      },
      {
        label: "Special Events",
        href: "/events/special",
        description: "Conferences, galas, and landmark occasions.",
      },
    ],
  },
  {
    label: "Membership",
    href: "/membership",
  },
  {
    label: "Donations",
    href: "/donations",
    children: [
      {
        label: "VAPA Donations",
        href: "/donations",
        description: "Support VAPA's mission, programs, and community.",
      },
      {
        label: "Venezuela Earthquake Support",
        href: "/donations/venezuela-earthquake",
        description: "Help families affected by the earthquakes in Venezuela.",
      },
    ],
  },
  {
    label: "Digital Library",
    href: "",
    children: [
      {
        label: "Webinars",
        href: "/digital-library/webinars",
        description: "Recordings and materials from past webinars.",
      },
      {
        label: "References",
        href: "/digital-library/references",
        description: "Reference documents and technical resources.",
      },
      {
        label: "Presentations",
        href: "/digital-library/presentations",
        description: "Slides and materials from presentations.",
      },
    ],
  },
  {
    label: "Contact",
    href: "#contact-form",
    scrollTo: true,
  },
];

export const MEMBERSHIP_URL =
  "https://www.memberplanet.com/Groups/GroupJoinLoginNew.aspx?ISPUB=true&invitee=p7vh47274p43y&mid";

export interface SocialLink {
  label: string;
  icon: "linkedin" | "instagram" | "youtube";
  href: string;
}

export const socialLinks: SocialLink[] = [
  { label: "Visit VAPA on LinkedIn (opens in new tab)", icon: "linkedin", href: "https://www.linkedin.com/company/40898534/" },
  { label: "Visit VAPA on Instagram (opens in new tab)", icon: "instagram", href: "https://www.instagram.com/vapa.us/" },
  { label: "Visit VAPA on YouTube (opens in new tab)", icon: "youtube", href: "https://www.youtube.com/channel/UCT5ejHEYwbGAadcQ7ttmAwA" },
];
