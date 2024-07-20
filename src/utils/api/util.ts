export interface QueryResult<T> {
  data: T;
}

export interface ApiResponse<T> {
  data?: T;
  error: any;
  message: string;
  status: number;
}

/// Define TypeScript interfaces

export interface Agency {
  id?: number;
  name?: string;
  userId?: number;
  description?: string;
  logo?: string;
  contactInfo?: string;
  address?: string;
}

export interface City {
  id: number;
  name: string;
}

export interface Seat {
  number: string;
  status: string;
}

export interface Route {
  routeId: number;
  agency: Agency;
  origin: City;
  destination: City;
  midPoints: Midpoint[];
  seats: Seat[];
  scheduleDate: string;
  pricePerTrveller: number;
  createdAt: Date;
}

// xxx
export interface Midpoint {
  cityId: number;
  cityName: string;
  cityOrder: number;
}
