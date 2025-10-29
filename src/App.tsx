import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

interface Place {
    id: number;
    name: string;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
}

function App() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetchPlaces = async () => {
          try {
              setLoading(true);
              setError(null);

              const response = await axios.get<Place[]>('http://localhost:8080/api/places');

              setPlaces(response.data);
              console.log("장소 목록: ", response.data);
          } catch (err) {
              if (axios.isAxiosError(err)) {
                  setError(err.response?.data?.message || err.message || "장소 목록 로딩 실패 (Axios Error)");
              } else {
                  setError("장소 목록을 불러오는 중 알 수 없는 오류 발생");
              }
          } finally {
              setLoading(false);
          }
      };

      fetchPlaces();
  }, []);

  return (
    <>
        <h1>여행 장소 목록</h1>
        {loading && <p>로딩 중...</p>}
        {error && <p style={{ color : 'red' }}>{error}</p>}
        <ul>
            {places.map((place) => (
                <li key={place.id}>
                    <strong>{place.name}</strong> ({place.address || '주소 없음'})
                </li>
            ))}
        </ul>
    </>
  );
}

export default App
