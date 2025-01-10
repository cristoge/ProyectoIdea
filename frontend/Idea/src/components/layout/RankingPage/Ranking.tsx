import { useEffect, useState } from "react";
import { Card } from "../../common";
import "./Ranking.css";
export const RankingPage = () => {
  interface DataItem {
    title: string;
    description: string;
    imageVideoUrl: string;
    creationDate: string;
    creatorId: string;
    likeCounts: number;
    projectId: string;
    creatorName?: string; 
  }

  const [data, setData] = useState<DataItem[]>([]); 
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/projects");
        if (!response.ok) {
          throw new Error("Error en la respuesta de la API");
        }
        const result: DataItem[] = await response.json();

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
                creatorName: creatorData.username, 
              };
            } catch (err) {
              console.error("Error obteniendo el nombre del creador:", err);
              return item; 
            }
          })
        );
        setData(updatedData);
      } catch (err) {
        console.error("Error obteniendo los proyectos:", err);
      }
    };
    fetchData();
    console.log(filteredData);

  }, []);

  // Filtrar y ordenar los datos basados en el término de búsqueda y los likes
  const filteredData = data
    .filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.creatorName && item.creatorName.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => b.likeCounts - a.likeCounts); // Ordenar por likes de mayor a menor

  return (
    <>
      <div className="header-container">
        <h1 className="page-title">Ranking</h1>
        <input 
          type="text" 
          placeholder="Buscar..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="search-input" 
        />
      </div>

      <div className="home-page">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <Card
              key={item.projectId}
              projectId={item.projectId}
              title={item.title}
              description={item.description}
              image={item.imageVideoUrl}
              date={item.creationDate}
              author={item.creatorName || "Unknown"} 
              
            />
          ))
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </>
  );
};
