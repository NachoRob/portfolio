/**
 * Datos personales y de marca. Todo lo que aparece aquí proviene del
 * sitio anterior, del README del repositorio o de los READMEs públicos
 * en github.com/NachoRob. No agregar experiencia, métricas ni enlaces
 * que no sean verificables.
 */

export const site = {
  brand: 'NachoDev',
  name: 'Ignacio Robles',
  shortName: 'Nacho',
  philosophy: ['Construir', 'Entender', 'Compartir'] as const,
  // PENDIENTE DE VALIDAR: basado en la firma de tus READMEs
  // ("Cloud Engineer | Full-Stack Developer | AI Solutions Builder").
  roles: ['AI Engineer', 'Full-Stack Developer', 'Cloud Engineer'] as const,
  title: 'NachoDev — Ignacio Robles · AI Engineer, Full-Stack y Cloud',
  description:
    'Portafolio de Ignacio Robles (NachoDev): agentes de IA, sistemas RAG, data engineering en Google Cloud y desarrollo full-stack. Proyectos documentados con su arquitectura y decisiones técnicas.',
  locale: 'es_CL',
  lang: 'es',
  location: 'Chile',
  email: 'ignaciorob86@gmail.com',
  // PENDIENTE: no hay CV en el repositorio. Cuando exista, súbelo a /public/cv.pdf y define la ruta aquí.
  cvUrl: null as string | null,
} as const;

export type SocialLink = {
  label: string;
  href: string;
  handle: string;
  icon: 'github' | 'linkedin' | 'instagram' | 'mail';
};

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/NachoRob', handle: '@NachoRob', icon: 'github' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ignacioroblesr/',
    handle: 'in/ignacioroblesr',
    icon: 'linkedin',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/i_ro_1986/',
    handle: '@i_ro_1986',
    icon: 'instagram',
  },
  { label: 'Email', href: `mailto:${site.email}`, handle: site.email, icon: 'mail' },
];

export const nav = [
  { label: 'Qué hago', href: '#especialidades' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Artículos', href: '#articulos' },
  { label: 'Contacto', href: '#contacto' },
] as const;

/** Rol actual. La trayectoria completa vive en LinkedIn, no en el sitio. */
export const current = {
  company: 'D2B Inteligencia Digital',
  url: 'https://d2b.cl/',
} as const;
