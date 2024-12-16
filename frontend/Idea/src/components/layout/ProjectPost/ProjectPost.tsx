import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ProjectPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [creatorName, setCreatorName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>("");

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

    const fetchComments = async (postId: string) => {
      try {
        const response = await fetch(`http://localhost:3000/projects/${postId}/comments`);
        if (!response.ok) {
          throw new Error("Error al obtener los comentarios");
        }
        const commentsData = await response.json();
        setComments(commentsData);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) {
      fetchPostData();
      fetchComments(id);
    }
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return; // No enviar si el comentario está vacío

    try {
      const response = await fetch(`http://localhost:3000/projects/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`, // Añadir el token de autorización
        },
        body: JSON.stringify({
          comment: newComment, // Solo necesitas el comentario
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el comentario");
      }

      const newCommentData = await response.json();
      setComments([...comments, newCommentData]); // Añadir el nuevo comentario a la lista
      setNewComment(""); // Limpiar el campo de texto
    } catch (err) {
      console.error(err);
    }
  };

  // Función para manejar el clic en el botón de "Dar Like"
  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:3000/projects/${id}/like`, {
        method: "PATCH", // Usamos PATCH para actualizar los likes
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`, 
        },
        body: JSON.stringify({}), // No necesitamos enviar datos adicionales
      });

      if (!response.ok) {
        throw new Error("Error al dar like al proyecto");
      }

      // Si la respuesta es exitosa, actualizamos el contador de likes
      const updatedPost = await response.json();
      setPost((prevPost: any) => ({
        ...prevPost,
        likeCounts: updatedPost.likeCounts, // Actualizamos los likes
      }));
    } catch (err) {
      console.error(err);
    }
  };

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
        <p>
          Dar Like
          <button onClick={handleLike}>👍</button> {/* Aquí está el botón de "Like" */}
        </p>
      </div>

      <div>
        <h1>Comentarios</h1>
        {comments.map((comment) => (
          <div key={comment.commentId}>
            <p>Usuario: {comment.userId}</p>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>

      <div>
        <h2>Agregar comentario</h2>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu comentario..."
            rows={4}
            cols={50}
          />
          <button type="submit">Enviar comentario</button>
        </form>
      </div>
    </>
  );
};
