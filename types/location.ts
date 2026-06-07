export interface District {
  code: string;
  name: string;
  slug: string;
  cityCode: string;
  wards?: Ward[];
}

export interface Ward {
  code: string;
  name: string;
  slug?: string;
  cityCode?: string;
  districtCode?: string;
}

export interface City {
  code: string;
  name: string;
  slug: string;
  districts: District[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  transactionType: 'rent' | 'sale' | 'both';
  icon?: string;
}
