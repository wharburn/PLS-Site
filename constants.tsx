import { Language, translations } from './translations.ts';
import { Partner, Service, ServiceType } from './types.ts';

export const COLORS = {
  heritageBlue: '#0f172a',
  royalBlue: '#1e40af',
  slate: '#1e293b',
  prestigeGold: '#c5a059',
  goldGradient: 'linear-gradient(135deg, #c5a059 0%, #ecd4a1 50%, #c5a059 100%)',
  parchmentCream: '#fdfcfb',
  successGreen: '#10b981',
  aiPurple: '#7c3aed',
};

export const CREDENTIAL_DEFS: Record<string, string> = {
  'BA Hons': 'Bachelor of Arts with Honours from a UK University',
  TFL: 'Teaching Foreign Languages Qualification',
  ELB: 'English Language & Business Specialist',
  CML: 'Chartered Member of Linguists',
  MCIL: 'Member of the Chartered Institute of Linguists (UK)',
};

export const BRAND_LOGOS = {
  PLS_MAIN: '/images/pls-logo.png',
  ACCA: '/images/partners/acca-logo.png',
  AQ_ARCHERS: '/images/partners/aq-archers-logo.png',
  MONTAGUE: '/images/partners/montague-logo.png',
  CIOL: '/images/partners/CIOL-logo.png',
  PEDRO_XAVIER: '/images/team/pedro.jpg',
  NOVO_AVATAR: '/images/services/avatar.png',
  NOVO_AVATAR_TALKING: '/images/services/avatar_speak.gif',
};

export const LOGO_COMPONENT = (className: string) => (
  <img src="/images/pls-logo.png" alt="PLS Consultants" className={className} />
);

export const SERVICES: Service[] = [
  {
    id: ServiceType.LEGAL,
    title: 'Solicitors (Partner Firms)',
    description: 'Premier legal representation via world-class partner law firms.',
    longDescription:
      'Expertise in Property, Immigration, Family, and Portuguese Law through partnerships with Millbank, Montague, and AQ Archers.',
    image:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200',
    icon: '⚖️',
    color: COLORS.heritageBlue,
  },
  {
    id: ServiceType.ACCOUNTANCY,
    title: 'Accountancy & Tax',
    description: 'ACCA registered accounting, HMRC registered, HMRC Agent.',
    longDescription:
      'Strategic tax planning, financial statement preparation, and business advisory services for UK and PT entities.',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200',
    icon: '📊',
    color: '#0d9488',
  },
  {
    id: ServiceType.TRANSLATION,
    title: 'Translation Services',
    description: 'Chartered linguists specializing in legal and certified translations.',
    longDescription:
      'Certified translation for legal documents, contracts, and certificates with CIOL accreditation.',
    image:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200',
    icon: '🗣️',
    color: COLORS.aiPurple,
  },
  {
    id: ServiceType.BUSINESS,
    title: 'Business Consultancy',
    description: 'Cross-border business setup and strategic management.',
    longDescription:
      'Guidance on company formation, market entry strategies, and operational compliance in UK and Portugal.',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    icon: '💼',
    color: COLORS.prestigeGold,
  },
];

export const PARTNERS: Partner[] = [
  {
    name: 'Montague Solicitors',
    logo: BRAND_LOGOS.MONTAGUE,
    url: '#',
    specialization: 'Family & Property',
    description: 'Specialists in Family Law and Conveyancing.',
  },
  {
    name: 'AQ Archers',
    logo: BRAND_LOGOS.AQ_ARCHERS,
    url: '#',
    specialization: 'Immigration',
    description: 'Experts in UK Immigration and Visas.',
  },
  {
    name: 'ACCA',
    logo: BRAND_LOGOS.ACCA,
    url: '#',
    specialization: 'Accountancy',
    description: 'Association of Chartered Certified Accountants.',
  },
  {
    name: 'CIOL',
    logo: BRAND_LOGOS.CIOL,
    url: '#',
    specialization: 'Linguistics',
    description: 'Chartered Institute of Linguists.',
  },
];

export const getTranslatedServices = (lang: Language): Service[] => {
  const t = translations[lang].serviceCards;
  return [
    {
      id: ServiceType.LEGAL,
      title: t.legalTitle,
      description: t.legalDesc,
      longDescription: t.legalLong,
      image:
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200',
      icon: '⚖️',
      color: COLORS.heritageBlue,
    },
    {
      id: ServiceType.ACCOUNTANCY,
      title: t.accountancyTitle,
      description: t.accountancyDesc,
      longDescription: t.accountancyLong,
      image:
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200',
      icon: '📊',
      color: '#0d9488',
    },
    {
      id: ServiceType.TRANSLATION,
      title: t.translationTitle,
      description: t.translationDesc,
      longDescription: t.translationLong,
      image:
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200',
      icon: '🗣️',
      color: COLORS.aiPurple,
    },
    {
      id: ServiceType.BUSINESS,
      title: t.businessTitle,
      description: t.businessDesc,
      longDescription: t.businessLong,
      image:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
      icon: '💼',
      color: COLORS.prestigeGold,
    },
  ];
};

export const getTranslatedPartners = (lang: Language): Partner[] => {
  const t = translations[lang].partners;
  return [
    {
      name: 'Montague Solicitors',
      logo: BRAND_LOGOS.MONTAGUE,
      url: '#',
      specialization: t.familyProperty,
      description: t.familyPropertyDesc,
    },
    {
      name: 'AQ Archers',
      logo: BRAND_LOGOS.AQ_ARCHERS,
      url: '#',
      specialization: t.immigration,
      description: t.immigrationDesc,
    },
    {
      name: 'ACCA',
      logo: BRAND_LOGOS.ACCA,
      url: '#',
      specialization: t.accountancy,
      description: t.accountancyDesc,
    },
    {
      name: 'CIOL',
      logo: BRAND_LOGOS.CIOL,
      url: '#',
      specialization: t.linguistics,
      description: t.linguisticsDesc,
    },
  ];
};
