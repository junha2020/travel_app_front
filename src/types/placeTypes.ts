export interface Place {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  description: string;
  category: string;
  rating: number;
}
