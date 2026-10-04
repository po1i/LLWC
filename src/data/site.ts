// Single source of truth for business facts used across the page.
// Values set to null render a visible placeholder (see Tbd.astro) and are
// listed in README.md under "Before launch".

export const site = {
  brand: 'Level Line',
  legalName: 'Level Line Web Co.',
  tagline: 'New patients for Boston-area med spas.',

  founder: {
    name: 'Poli',
    role: 'Founder',
    city: 'Boston',
    /** Path under /public, e.g. 'poli.jpg'. null shows a placeholder portrait. */
    photo: null as string | null,
  },

  /** Contact email. null shows a placeholder. */
  email: null as string | null,

  /** Cal.com booking link (wired in a later round). */
  calUrl: 'https://cal.com/',
  /** Form endpoint, e.g. Formspree (wired in a later round). */
  formEndpoint: '#',

  price: {
    growth: 1400,
    founding: 900,
    foundingMonths: 6,
    foundingSpots: 3,
    adSpendMin: 1000,
    hourly: 95,
    ownershipPayments: 12,
  },

  terms: {
    minimumMonths: 3,
    /** Notice period from the Standard Terms, e.g. "30 days'". */
    noticePeriod: null as string | null,
    /** Missed-deadline credit, in the agreement's exact wording. Set to '' to remove it from the page. */
    deadlineCredit: null as string | null,
  },
} as const;

export const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
