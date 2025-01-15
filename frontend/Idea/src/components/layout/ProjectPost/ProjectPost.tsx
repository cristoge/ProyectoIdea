import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext"; 
import "./ProjectPost.css";

export const ProjectPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [creatorName, setCreatorName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const apiUrl = import.meta.env.VITE_API_URL;
  // Acceder al usuario autenticado desde el AuthContext
  const { currentUser } = useAuth();

  // Inicializar useNavigate
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`${apiUrl}/projects/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos del post");
        }
        const postData = await response.json();
        setPost(postData);
        setLoading(false);

        const creatorResponse = await fetch(
          `${apiUrl}/users/${postData.creatorId}`
        );
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
        const response = await fetch(
          `${apiUrl}/projects/${postId}/comments`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los comentarios");
        }
        const commentsData = await response.json();

        const commentsWithUsernames = await Promise.all(
          commentsData.map(async (comment: any) => {
            const userResponse = await fetch(
              `${apiUrl}/users/${comment.userId}`
            );
            if (!userResponse.ok) {
              throw new Error("Error al obtener el nombre de usuario");
            }
            const userData = await userResponse.json();
            return {
              ...comment,
              username: userData.username,
            };
          })
        );

        setComments(commentsWithUsernames);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) {
      fetchPostData();
      fetchComments(id);

      const pollingInterval = setInterval(() => {
        fetchComments(id);
        fetchPostData();
      }, 5000);

      return () => {
        clearInterval(pollingInterval);
      };
    }
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    if (!currentUser) {
      alert("Por favor inicia sesión para comentar.");
      return;
    }

    try {
      const idToken = await currentUser.getIdToken(); // Obtener el token del usuario autenticado
      const response = await fetch(
        `${apiUrl}/projects/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            comment: newComment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al enviar el comentario");
      }

      const newCommentData = await response.json();
      setComments([...comments, newCommentData]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      alert("Por favor inicia sesión para dar like.");
      return;
    }

    try {
      const idToken = await currentUser.getIdToken(); // Obtener el token del usuario autenticado
      const response = await fetch(
        `${apiUrl}/projects/${id}/like`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error("Error al dar like al proyecto");
      }

      const updatedPost = await response.json();
      setPost((prevPost: any) => ({
        ...prevPost,
        likeCounts: updatedPost.likeCounts,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const goToCreatorProfile = () => {
    navigate(`/profile/${post.creatorId}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!post) {
    return <div className="not-found">No se encontró el post.</div>;
  }

  return (
    <div className="project-post">
      <div className="header">
        <h1>{post.title}</h1>
        {post.link && (
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            <img
              src="/github-mark.svg"
              alt="Ver Proyecto"
              className="git-icon"
            />
          </a>
        )}
      </div>

      <img src={post.imageVideoUrl} alt={post.title} />
      <p>{post.description}</p>

      {post.tags && post.tags.length > 0 && (
        <div className="tags-info">
          {post.tags.map((tag: string, index: number) => (
            <p key={index} className="tag">
              {tag}
            </p>
          ))}
        </div>
      )}

      <div className="project-info">
        <p className="creator-info">
          Creado por:{" "}
          <span
            className="creator-link"
            onClick={goToCreatorProfile}
            style={{ cursor: "pointer", color: "#0277B6" }}
          >
            {creatorName}
          </span>
        </p>
        <div className="like-info">
          <span>Likes: {post.likeCounts}</span>
          <button className="like-button" onClick={handleLike}>
            ❤️
          </button>
        </div>
      </div>

      <div className="comments-section">
        <h2>Comentarios</h2>
        {comments.map((comment) => (
          <div key={comment.commentId} className="comment">
            <p className="comment-user">{comment.username}</p>
            <p className="comment-content">{comment.content}</p>
          </div>
        ))}
      </div>

      <div className="comment-form">
        <h2>Agregar comentario</h2>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu comentario..."
            rows={4}
          />
          <button type="submit">Enviar comentario</button>
        </form>
      </div>
    </div>
  );
};
