export interface Plan {
  id: number;
  title: string;
  startDate: number;
  endDate: number;
  isPublic: boolean;
  places: [];
}
