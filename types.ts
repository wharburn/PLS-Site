
export enum ServiceType {
  LEGAL = 'LEGAL',
  ACCOUNTANCY = 'ACCOUNTANCY',
  TRANSLATION = 'TRANSLATION',
  BUSINESS = 'BUSINESS'
}

export interface Service {
  id: ServiceType;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  icon: string;
  color: string;
}

export interface Partner {
  name: string;
  logo: string;
  url: string;
  specialization: string;
  description: string;
}

export interface VisitorLog {
  timestamp: string;
  ip: string;
  location: string;
  page: string;
  action: string;
}
