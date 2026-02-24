import axios from "axios";

export const fetchPlaces = async () => {
  const response = await axios.get("/api/places");
  return response.data;
};
