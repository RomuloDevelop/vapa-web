export interface NavSubItem {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
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
        label: "Board of Directors",
        href: "/about/directors",
        description: "Meet our leadership team guiding VAPA's strategic vision.",
      },
      {
        label: "Advisory Board",
        href: "/about/advisory",
        description: "Industry experts providing guidance and expertise.",
      },
      {
        label: "Former Boards",
        href: "/about/formers",
        description: "Honoring past leaders who shaped our organization.",
      },
      {
        label: "VAPA Links",
        href: "",
        description: "Useful resources and partner connections.",
      },
      {
        label: "VAPA ResPro",
        href: "",
        description: "Our professional responsibility and ethics program.",
      },
    ],
  },
  {
    label: "Events",
    href: "#",
  },
  {
    label: "Membership",
    href: "/membership",
  },
  {
    label: "Donations",
    href: "/donations",
  },
  {
    label: "Digital Library",
    href: "/digital-library",
  },
  {
    label: "Contact",
    href: "#contact-form",
    scrollTo: true,
  },
];

export const MEMBERSHIP_URL =
  "https://www.memberplanet.com/Groups/GroupJoinLoginNew.aspx?ISPUB=true&invitee=p7vh47274p43y&mid";
