import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ProjectPost = () => {
  const { id } = useParams<{ id: string }>(); 
  const [post, setPost] = useState<any>(null); 
  const [creatorName, setCreatorName] = useState<string>(""); 
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
                
        const creatorResponse = await fetch(`http://localhost:3000/users/${postData.creatorId}`);
        if (!creatorResponse.ok) {
          throw new Error("Error al obtener los datos del creador");
        }
        const creatorData = await creatorResponse.json();
        setCreatorName(creatorData.username); 
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
    <>
    <div>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      <img src={post.imageVideoUrl} alt={post.title} />
      <p>Creado por: {creatorName}</p>
      <p>Likes: {post.likeCounts}</p>
    </div>
    <div>
      <h1>Comentarios</h1>
      
    </div>
    </>
  );
};
