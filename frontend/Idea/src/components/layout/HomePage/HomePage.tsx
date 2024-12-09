import { useEffect, useState } from "react";
import { Card } from "../../common";

export const HomePage = () => {
  interface DataItem {
    title: string;
    description: string;
    imageVideoUrl: string;
  }

  const [data, setData] = useState<DataItem[]>([]); // Estado para guardar los datos
  const [loading, setLoading] = useState(true); // Estado para mostrar un loader
  const [error, setError] = useState(null); // Estado para manejar errores

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
        setError(err as any); // Maneja errores
      } finally {
        setLoading(false); // Finaliza el loading
      }
    };

    fetchData();
  }, []); // Solo se ejecuta una vez cuando se monta el componente

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {data.map((item, index) => (
        <Card
          key={index} // Usa un identificador único para evitar problemas en el renderizado
          title={item.title} // Ajusta los nombres según los campos de tu API
          description={item.description}
          image={item.imageVideoUrl}
        />
      ))}
    </div>
  );
};







