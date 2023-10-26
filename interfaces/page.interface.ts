export interface ILandingPage {
  id: number;
  data?: ILandingPageData;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface ILandingPageData {
  img: string;
  title: ICustomTranslation;
  features: IFeature[];
  description: ICustomTranslation;
}

interface IFeature {
  img: string;
  title: ICustomTranslation;
  description: ICustomTranslation;
}

export interface ICustomTranslation {
  [key: string]: string;
}

export interface IStatistics {
  users: number;
  orders: number;
}
