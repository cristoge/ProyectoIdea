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
    categories: string[]; 
    creatorName?: string; 
  }

  const availableCategories = [
    "Frontend",
    "Backend",
    "Mobile",
    "Data Science",
    "DevOps",
    "Machine Learning",
    "Cybersecurity",
    "Blockchain",
    "Game Development",
    "UI/UX",
    "Artificial Intelligence",
    "Virtual Reality",
    "Database",
  ];

  const [data, setData] = useState<DataItem[]>([]); 
  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // Estado para la categoría seleccionada
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/projects`);
        if (!response.ok) {
          throw new Error("Error en la respuesta de la API");
        }
        const result: DataItem[] = await response.json();

        const updatedData = await Promise.all(
          result.map(async (item) => {
            try {
              const creatorResponse = await fetch(
                `${apiUrl}/users/${item.creatorId}`
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
  }, []);

  const filteredData = data.filter((item) => {
    const matchesSearchTerm = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.creatorName && item.creatorName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === "" || item.categories.includes(selectedCategory); // Cambiamos la lógica para verificar si la categoría seleccionada está en el array

    return matchesSearchTerm && matchesCategory;
  });

  return (
    <>
      <div className="header-container">
        <h1 className="page-title">Proyectos</h1>

        <div className="filters-container">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">Todas las categorías</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
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
