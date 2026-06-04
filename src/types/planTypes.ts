export interface PlaceInPlan {
  planPlaceId: number;
  placeId: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  day: number;
  sequence: number;
  memo?: string;
  category?: string;
}

export interface Plan {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  places: PlaceInPlan[];
}

export interface TravelPlanRequestDTO {
  title: string;
  startDate: string;
  endDate: string;
  userId: number;
}

