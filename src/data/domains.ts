import type { IconName } from '../components/Icon'

export type ValueProp = {
  id: string
  title: string
  description: string
  icon: IconName
}

export type Domain = {
  id: string
  title: string
  description: string
  capabilities: readonly string[]
  icon: IconName
}

export type ProcessStep = {
  id: string
  step: number
  title: string
  description: string
}

export type Testimonial = {
  id: string
  quote: string
  company: string
  role: string
}

export const valueProps: readonly ValueProp[] = [
  {
    id: 'speed',
    title: 'Startup speed',
    description:
      'We move at startup velocity: tight feedback loops, senior-only teams, and no layers between you and the people building. Most teams ship a first working version in weeks, not quarters.',
    icon: 'bolt',
  },
  {
    id: 'ai',
    title: 'AI-first',
    description:
      "AI isn't an add-on here. We design systems around models, agents, and automation from the first whiteboard sketch, so the work compounds long after launch.",
    icon: 'sparkles',
  },
  {
    id: 'e2e',
    title: 'End-to-end',
    description:
      'Strategy, design, engineering, marketing, and cloud — one team, one thread of accountability. You stop coordinating vendors and start shipping outcomes.',
    icon: 'layers',
  },
  {
    id: 'roi',
    title: 'Measurable ROI',
    description:
      'Every engagement ties to numbers you care about: revenue, retention, cost, speed. We instrument from day one so the impact is visible, not assumed.',
    icon: 'trending',
  },
]

export const domains: readonly Domain[] = [
  {
    id: 'engineering',
    title: 'Software engineering',
    description:
      'Web, mobile, and platform engineering built to scale and to last. Clean architecture, strong typing, and tests you can trust.',
    capabilities: ['Product engineering', 'API & platform', 'Mobile apps', 'QA & reliability'],
    icon: 'code',
  },
  {
    id: 'marketing',
    title: 'Digital marketing & SEO',
    description:
      'Growth that compounds. Technical SEO, content engines, and performance marketing tuned to your funnel and your numbers.',
    capabilities: ['Technical SEO', 'Content & strategy', 'Paid media', 'Analytics'],
    icon: 'search',
  },
  {
    id: 'ai',
    title: 'AI automation',
    description:
      'Agents, copilots, and workflows that take real work off your team\u2019s plate — designed safely, with humans in the loop where it matters.',
    capabilities: ['LLM apps', 'Agentic workflows', 'RAG & data', 'Eval & safety'],
    icon: 'cpu',
  },
  {
    id: 'cloud',
    title: 'Cloud infrastructure',
    description:
      'Cloud that scales without surprises. Well-architected, observable, and cost-aware — from first deploy to global scale.',
    capabilities: ['Cloud architecture', 'DevOps & CI/CD', 'Observability', 'Cost optimization'],
    icon: 'cloud',
  },
]

export const processSteps: readonly ProcessStep[] = [
  {
    id: 'discover',
    step: 1,
    title: 'Discover',
    description:
      'We map the problem, the users, and the constraints. No assumptions — we turn ambiguity into a shared brief everyone signs off on.',
  },
  {
    id: 'architect',
    step: 2,
    title: 'Architect',
    description:
      'We design the system before we build it: data, services, interfaces, and risks. The blueprint that makes the rest predictable.',
  },
  {
    id: 'design',
    step: 3,
    title: 'Design',
    description:
      'We shape the experience: flows, screens, and a design system that feels inevitable. Premium and usable from the first click.',
  },
  {
    id: 'build',
    step: 4,
    title: 'Build',
    description:
      'Senior engineers ship in tight iterations with tests and reviews baked in. You see working software early and often.',
  },
  {
    id: 'launch',
    step: 5,
    title: 'Launch',
    description:
      'We deploy with care: rollout, monitoring, and a runbook. Then we watch the real numbers, not the demo.',
  },
  {
    id: 'evolve',
    step: 6,
    title: 'Evolve',
    description:
      'We measure, learn, and improve. The best systems are never finished — they get sharper with every cycle.',
  },
]

export const testimonials: readonly Testimonial[] = [
  {
    id: 'marketing-addict',
    quote:
      'Cynbit rebuilt our marketing stack and the pipeline followed — qualified leads doubled in a single quarter.',
    company: 'Marketing Addict',
    role: 'Head of Growth',
  },
  {
    id: 'evento',
    quote:
      'They shipped our event platform ahead of schedule, and it held up through our biggest launch yet.',
    company: 'Evento',
    role: 'Co-founder',
  },
  {
    id: 'urban-wardrobe',
    quote:
      'The redesign lifted conversion and finally felt like our brand. Worth every conversation.',
    company: 'Urban Wardrobe',
    role: 'Founder',
  },
  {
    id: 'cloudy-tales',
    quote:
      'Their SEO work put us on page one for the terms that actually convert. The numbers speak for themselves.',
    company: 'Cloudy Tales',
    role: 'Marketing Lead',
  },
  {
    id: 'econtentprep',
    quote:
      'A genuinely senior team. They understood our content model before we finished explaining it.',
    company: 'EContentPreP',
    role: 'Product Owner',
  },
  {
    id: 'sofiasa',
    quote:
      'The AI assistant they built handles support volume we used to drown in. Our team finally got their time back.',
    company: 'Sofiasa',
    role: 'Operations Lead',
  },
  {
    id: 'wild-basil',
    quote:
      'Clean cloud architecture cut our bill by a third while traffic kept climbing. Exactly the result we wanted.',
    company: 'Wild Basil',
    role: 'CTO',
  },
  {
    id: 'pragya-healths',
    quote:
      'Careful, compliant, and fast — rare to find all three in healthcare software.',
    company: 'Pragya Healths',
    role: 'Director',
  },
  {
    id: 'wizhealth',
    quote:
      'From scope to launch, the process was transparent. We always knew what we were getting and why.',
    company: 'WizHealth',
    role: 'CEO',
  },
]
