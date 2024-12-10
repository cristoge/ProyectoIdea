import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ProjectPost = () => {
  const { id } = useParams<{ id: string }>(); 
  const [post, setPost] = useState<any>(null); 
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/projects/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos del post");
        }
        const postData = await response.json();
        setPost(postData); 
        setLoading(false); 
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    };

    if (id) {
      fetchPostData();
    }
  }, [id]); 

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!post) {
    return <div>No se encontró el post.</div>; 
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      <img src={post.imageVideoUrl} alt={post.title} />
      <p>Creado por: {post.creatorId}</p>
      {/* <p>Fecha de creación: {post.creationDate}</p> */}
      <p>Likes: {post.likeCounts}</p>
    </div>
  );
};
