import { useEffect, useState } from "react";
import { Card } from "../../common";
import "./HomePage.css";

export const HomePage = () => {
  interface DataItem {
    title: string;
    description: string;
    imageVideoUrl: string;
    creationDate: string;
    creatorId: string;
    likedCount: number;
    projectId: string;
    creatorName?: string; // Nuevo campo para almacenar el nombre del creador
  }

  const [data, setData] = useState<DataItem[]>([]); // Estado para guardar los datos

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/projects");
        if (!response.ok) {
          throw new Error("Error en la respuesta de la API");
        }
        const result: DataItem[] = await response.json();

        // Para cada proyecto, obtener el nombre del creador
        const updatedData = await Promise.all(
          result.map(async (item) => {
            try {
              const creatorResponse = await fetch(
                `http://localhost:3000/users/${item.creatorId}`
              );
              if (!creatorResponse.ok) {
                throw new Error("Error al obtener el nombre del creador");
              }
              const creatorData = await creatorResponse.json();
              return {
                ...item,
                creatorName: creatorData.username, // Asigna el nombre del creador
              };
            } catch (err) {
              console.error("Error obteniendo el nombre del creador:", err);
              return item; // Devuelve el proyecto sin cambios en caso de error
            }
          })
        );
        setData(updatedData); // Actualiza el estado con los datos obtenidos
      } catch (err) {
        console.error("Error obteniendo los proyectos:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {data.map((item) => (
          <Card
            key={item.projectId}
            projectId={item.projectId}
            title={item.title}
            description={item.description}
            image={item.imageVideoUrl}
            date={item.creationDate}
            author={item.creatorName || "Unknown"} 
          />
        
      ))}
    </div>
  );
};
