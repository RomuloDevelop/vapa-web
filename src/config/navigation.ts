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
    href: "",
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
        label: "VAPA Links",
        href: "/about/links",
        description: "Useful resources and partner connections.",
      },
      {
        label: "VAPA ResPro",
        href: "/about/respro",
        description: "Our professional responsibility and ethics program.",
      },
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
