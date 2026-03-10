import axios from "axios";

// 모든 장소 목록 가져오는 API
export const fetchPlaces = async () => {
  const response = await axios.get("/api/places");
  return response.data;
};

// 특정 장소 목록 가져오는 API
export const fetchPlaceDetail = async (id: number) => {
  const response = await axios.get(`/api/places/${id}`);
  return response.data;
};
