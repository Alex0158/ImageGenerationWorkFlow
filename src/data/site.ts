interface SiteMeta {
  name: string;
  title: string;
  description: string;
  ogDescription: string;
  areaServed: string;
  serviceTypes: string[];
  email: string;
  whatsappUrl: string;
  instagramUrl: string;
}

interface NavItem {
  label: string;
  href: string;
}

interface CtaLabels {
  primary: string;
  secondary: string;
  compareScopes: string;
  submitBrief: string;
}

interface ProofPoint {
  value: string;
  label: string;
}

interface ContactLink {
  label: string;
  href: string;
}

interface BriefPromise {
  number: string;
  title: string;
}

export const siteMeta: SiteMeta = {
  name: 'Independent Graphic Design Atelier',
  title: 'Graphic Designer | Brand Identity & Campaign Design',
  description:
    'Graphic design, visual identity, campaign posters, launch systems, and art direction for brands that need a sharper first impression.',
  ogDescription: 'Brand visuals and campaign systems built for a sharper first impression.',
  areaServed: 'Hong Kong',
  serviceTypes: ['Brand Identity', 'Campaign Visuals', 'Poster Design', 'Social Media Design', 'Editorial Graphic Design'],
  email: 'hello@visualatelier.studio',
  whatsappUrl: 'https://wa.me/85200000000',
  instagramUrl: 'https://instagram.com/',
};

export const navItems: NavItem[] = [
  { label: 'Showcase', href: '#showcase' },
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Scope', href: '#engagement' },
  { label: 'Process', href: '#process' },
  { label: 'Brief', href: '#contact' },
];

export const ctaLabels: CtaLabels = {
  primary: 'Send a Brief',
  secondary: 'View the Work',
  compareScopes: 'Compare Scopes',
  submitBrief: 'Send Project Brief',
};

export const heroAssurances: string[] = [
  'Projects from HKD 5,000+',
  '24-48h first reply',
  'Scope before design starts',
  'Files prepared for print and digital use',
];

export const proofPoints: ProofPoint[] = [
  {
    value: '20',
    label: 'Selected commercial visuals across launches, menus, campaigns, and brand refreshes.',
  },
  {
    value: '3',
    label: 'Clear entry points: identity, campaign assets, and hospitality graphics.',
  },
  {
    value: '24-48h',
    label: 'Typical first reply after receiving a focused project brief.',
  },
  {
    value: '1:1',
    label: 'Direct design execution, not template assembly or outsourced production.',
  },
];

export const marqueeItems: string[] = [
  'Less decoration. More direction.',
  'Designed for perception, built for use.',
  'From first impression to final file.',
  'A visual system your brand can actually use.',
];

export const contactLinks: ContactLink[] = [
  { label: 'Email', href: `mailto:${siteMeta.email}` },
  { label: 'WhatsApp', href: siteMeta.whatsappUrl },
  { label: 'Instagram', href: siteMeta.instagramUrl },
];

export const briefPromise: BriefPromise[] = [
  { number: '01', title: 'Tell me the goal' },
  { number: '02', title: 'I shape the scope' },
  { number: '03', title: 'You get a clear next step' },
];

export const projectTypeOptions: string[] = [
  'Brand Identity',
  'Poster / Editorial',
  'Social Media Kit',
  'Campaign Visual',
  'Packaging / Menu',
  'Not sure yet',
];

export const budgetOptions: string[] = [
  'Under HKD 5,000',
  'HKD 5,000 - 15,000',
  'HKD 15,000 - 35,000',
  'HKD 35,000+',
  'Not sure yet',
];

export const timelineOptions: string[] = ['ASAP', '2-4 weeks', '1-2 months', 'Flexible'];
