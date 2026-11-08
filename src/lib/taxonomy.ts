export const categories = {
  ai: { label: 'AI & Agents', tone: 'ambient' },
  fullstack: { label: 'Full-Stack', tone: 'brand' },
  data: { label: 'Data & ML', tone: 'brand' },
  web: { label: 'Web', tone: 'neutral' },
} as const;

export type Category = keyof typeof categories;

export const articleTopics = {
  'ai-engineering': 'AI Engineering',
  agentes: 'Agentes y automatización',
  backend: 'Backend y arquitectura',
  'google-cloud': 'Google Cloud',
  aeo: 'AEO y LLM Analytics',
} as const;
