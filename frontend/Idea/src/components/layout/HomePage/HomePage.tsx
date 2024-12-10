import { useEffect, useState } from "react";
import { Card } from "../../common";
import "./HomePage.css";
import { Link } from "react-router-dom";
export const HomePage = () => {
  interface DataItem {
    title: string;
    description: string;
    imageVideoUrl: string;
    creationDate: string;
    creatorId: string;
    likedCount: number;
    projectId: string;
  }

  const [data, setData] = useState<DataItem[]>([]); // Estado para guardar los datos

  useEffect(() => {
    // Llamada a la API
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/projects");
        if (!response.ok) {
          throw new Error("Error en la respuesta de la API");
        }
        const result = await response.json();
        setData(result); // Actualiza el estado con los datos obtenidos
      } catch (err) {
      // Maneja errores
      }
    };
    fetchData();
  }, []); 

  return (
    <div className="home-page">
      {data.map((item) => (
        <Link to={`/project/${item.projectId}`} key={item.projectId}>
          <Card
            title={item.title}
            description={item.description}
            image={item.imageVideoUrl}
            date={item.creationDate}
            author={item.creatorId}
          />
        </Link>
      ))}
    </div>
  );
};
