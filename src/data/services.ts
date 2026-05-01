interface Service {
  title: string;
  label: string;
  duration: string;
  featured?: boolean;
  intent: string;
  projectType: string;
  budgetGuide: string;
  fit: string;
  deliverables: string[];
  cta: string;
}

interface ProcessStep {
  title: string;
  text: string;
  output: string;
}

export const services: Service[] = [
  {
    title: 'Launch Campaign System',
    label: 'For openings, product drops, events, and social-first promotions.',
    duration: '1-3 weeks',
    featured: true,
    intent: 'Campaign Kit',
    projectType: 'Campaign Visual',
    budgetGuide: 'HKD 15,000 - 35,000',
    fit: 'A campaign package that turns one launch into posters, banners, menus, stories, and launch assets that feel like one system.',
    deliverables: ['Key visual', 'Poster system', 'Social media assets', 'Print and digital roll-out'],
    cta: 'Build My Launch Visuals',
  },
  {
    title: 'Visual Identity',
    label: 'For brands that need to look polished, memorable, and instantly credible.',
    duration: '2-3 weeks',
    intent: 'Identity Sprint',
    projectType: 'Brand Identity',
    budgetGuide: 'HKD 5,000 - 15,000',
    fit: 'A focused identity sprint for founders, restaurants, lifestyle brands, and personal brands that need a sharper visual presence.',
    deliverables: ['Logo direction', 'Typography system', 'Color and art direction', 'Starter brand kit'],
    cta: 'Shape My Identity',
  },
  {
    title: 'Art Direction',
    label: 'For brands that need a complete visual world, not one-off graphics.',
    duration: '4-8 weeks',
    intent: 'Visual System',
    projectType: 'Not sure yet',
    budgetGuide: 'HKD 35,000+',
    fit: 'A deeper design direction package for brands that want to move upmarket, look more mature, and build consistency across every touchpoint.',
    deliverables: ['Visual strategy', 'Brand identity system', 'Campaign language', 'Launch kit and usage guidance'],
    cta: 'Book Direction Work',
  },
];

export const processSteps: ProcessStep[] = [
  {
    title: 'Read the Market',
    text: 'We clarify your audience, price position, competitors, visual references, and the exact moment your customer needs to trust you.',
    output: 'Positioning / scope / timeline',
  },
  {
    title: 'Set the Direction',
    text: 'I build a visual direction with typography, color, image treatment, and a clear creative logic before production begins.',
    output: 'Moodboard / type system / art direction',
  },
  {
    title: 'Build the System',
    text: 'The approved direction becomes a usable set of posters, identity elements, social assets, menus, campaign visuals, or launch materials.',
    output: 'Core designs / extensions / export plan',
  },
  {
    title: 'Refine and Deliver',
    text: 'Final files are cleaned, organized, and prepared for real-world use across social, print, web, and launch channels.',
    output: 'Final files / usage notes / handoff',
  },
];
