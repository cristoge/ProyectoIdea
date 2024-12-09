// BlogPost.js
import { useEffect,useState } from "react";

// Componente para formatear la fecha
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', { 
    dateStyle: 'long', 
    timeStyle: 'short', 
    timeZone: 'Europe/Madrid' 
  });
};

// Simulando la data obtenida del endpoint
const getPostData = () => {
  return {
    creationDate: "2024-11-29T16:23:20.000Z",
    creatorId: "G0VFGLAn5lOexLNCGheOAnSTy8q2",
    description: "descripcion1",
    imageVideoUrl:"https://firebasestorage.googleapis.com/v0/b/dam2-proyectocr.firebasestorage.app/o/projects%2F5.jpeg-1733319377212?alt=media&token=f5545463-fb71-4205-a497-f70cad1bbc8b",
    likeCounts: 0,
    likedBy: [],
    projectId: "QK5Sp1zgCWAj8zfZjNMS",
    title: "Titulo 1"
  };
};

export const Proyectos = () => {
  interface Post {
    creationDate: string;
    creatorId: string;
    description: string;
    imageVideoUrl: string;
    likeCounts: number;
    likedBy: string[];
    projectId: string;
    title: string;
  }

  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    // Aquí simulamos la llamada al API y guardamos los datos en el estado
    const data = getPostData();
    setPost(data);
  }, []);

  if (!post) return <p>Cargando...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{post.title}</h1>
      <p><strong>Descripción:</strong> {post.description}</p>
      <p><strong>Fecha de Creación:</strong> {formatDate(post.creationDate)}</p>
      <p><strong>ID del Creador:</strong> {post.creatorId}</p>
      <p><strong>Likes:</strong> {post.likeCounts}</p>
      <img src={post.imageVideoUrl} alt="Imagen del proyecto" style={styles.image} />
      <p><strong>ID del Proyecto:</strong> {post.projectId}</p>
    </div>
  );
};

// Estilos básicos en línea
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '800px',
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  title: {
    color: '#333',
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginTop: '20px',
  }
};

