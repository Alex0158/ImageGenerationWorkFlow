interface OutcomeShift {
  label: string;
  title: string;
  text: string;
}

interface ProjectFit {
  label: string;
  title: string;
  bestFor: string;
  action: string;
}

interface EngagementOption {
  label: string;
  title: string;
  timeline: string;
  budgetGuide: string;
  recommended?: boolean;
  text: string;
  bestFor: string;
  includes: string[];
  cta: string;
}

interface BookingCue {
  label: string;
  value: string;
}

interface DecisionNote {
  question: string;
  answer: string;
}

export const outcomeShifts: OutcomeShift[] = [
  {
    label: 'Recognition',
    title: 'Your brand becomes easier to remember.',
    text: 'A tighter visual system gives people a repeatable image of your brand, instead of a collection of disconnected posts and posters.',
  },
  {
    label: 'Trust',
    title: 'The offer feels more intentional before anyone asks the price.',
    text: 'Typography, spacing, image treatment, and hierarchy work together so the business looks considered from the first glance.',
  },
  {
    label: 'Sales clarity',
    title: 'Customers understand what to look at first.',
    text: 'Menus, campaign visuals, and social assets are shaped around decision moments: what it is, why it matters, and what to do next.',
  },
  {
    label: 'Roll-out',
    title: 'You leave with assets that can keep working.',
    text: 'The output is prepared for real use across print, social, launch pages, and future extensions, not just a single attractive image.',
  },
];

export const projectFits: ProjectFit[] = [
  {
    label: 'Launch soon',
    title: 'You need the brand to look ready before the public sees it.',
    bestFor: 'Opening posters, social launch assets, menu or campaign graphics.',
    action: 'Build a launch system',
  },
  {
    label: 'Look sharper',
    title: 'The product is good, but the visual impression feels weaker than the offer.',
    bestFor: 'Identity refresh, type direction, color system, and brand touchpoints.',
    action: 'Sharpen the identity',
  },
  {
    label: 'Sell clearer',
    title: 'Your current visuals look busy, inconsistent, or hard to understand quickly.',
    bestFor: 'Menu hierarchy, offer design, poster systems, and reusable social layouts.',
    action: 'Clarify the visual system',
  },
];

export const engagementOptions: EngagementOption[] = [
  {
    label: 'Focused start',
    title: 'Identity Sprint',
    timeline: '2-3 weeks',
    budgetGuide: 'HKD 5,000 - 15,000',
    text: 'A compact visual identity direction for brands that need to look credible quickly without overbuilding the system.',
    bestFor: 'new brands, personal brands, small hospitality concepts, visual refreshes',
    includes: ['Logo direction', 'Type and color system', 'Core visual rules', 'Starter asset set'],
    cta: 'Start an Identity Sprint',
  },
  {
    label: 'Launch-ready',
    title: 'Campaign Kit',
    timeline: '1-3 weeks',
    budgetGuide: 'HKD 15,000 - 35,000',
    recommended: true,
    text: 'A campaign package that turns one launch, opening, event, or promotion into a coherent set of usable visuals.',
    bestFor: 'openings, seasonal offers, product drops, events, social campaigns',
    includes: ['Key visual', 'Poster or hero graphic', 'Social rollout assets', 'Print and digital exports'],
    cta: 'Build a Campaign Kit',
  },
  {
    label: 'Deeper direction',
    title: 'Visual System',
    timeline: '4-8 weeks',
    budgetGuide: 'HKD 35,000+',
    text: 'A broader design direction for brands that need stronger consistency across identity, campaigns, content, and customer touchpoints.',
    bestFor: 'upmarket repositioning, multi-channel brands, hospitality groups, launch systems',
    includes: ['Art direction', 'Identity system', 'Campaign language', 'Usage guidance'],
    cta: 'Shape a Visual System',
  },
];

export const bookingCues: BookingCue[] = [
  { label: 'Starting point', value: 'HKD 5,000+' },
  { label: 'First reply', value: '24-48h' },
  { label: 'Best for', value: 'Identity / Campaign / Launch' },
];

export const decisionNotes: DecisionNote[] = [
  {
    question: 'Do I need a finished brief before contacting you?',
    answer:
      'No. A rough goal, timeline, budget range, and a few visual references are enough. I can help turn that into a practical scope before design starts.',
  },
  {
    question: 'What files do I receive?',
    answer:
      'Final delivery is prepared for real use: print-ready files where needed, digital exports for social or web, and organized source or guidance files depending on the scope.',
  },
  {
    question: 'How are revisions handled?',
    answer:
      'Revision rounds are defined before the project starts. The goal is to refine an approved direction, not restart the project from zero after production begins.',
  },
  {
    question: 'What kind of project is not a good fit?',
    answer:
      'Rush work without a clear decision-maker, projects that only need cheap template edits, or requests where the visual direction must be copied from another brand.',
  },
];
