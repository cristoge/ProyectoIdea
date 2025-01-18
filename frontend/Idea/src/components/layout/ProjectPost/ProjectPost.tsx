import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import "./ProjectPost.css";

const githubt = import.meta.env.VITE_GITHUB;

export const ProjectPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [creatorName, setCreatorName] = useState<string>("");
  const [creatorAvatar, setCreatorAvatar] = useState<string>(""); // Para la imagen del avatar
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar si estamos editando
  const [editPostData, setEditPostData] = useState<{
    title: string;
    description: string;
    tags: string[];
  }>({
    title: "",
    description: "",
    tags: [],
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const { currentUser } = useAuth();
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
        setEditPostData({
          title: postData.title,
          description: postData.description,
          tags: postData.tags || [],
        });
        setLoading(false);

        const creatorResponse = await fetch(
          `${apiUrl}/users/${postData.creatorId}`
        );
        if (!creatorResponse.ok) {
          throw new Error("Error al obtener los datos del creador");
        }
        const creatorData = await creatorResponse.json();
        setCreatorName(creatorData.username);

        // Obtener la imagen del perfil desde GitHub
        const githubResponse = await fetch(
          `https://api.github.com/users/${creatorData.username}`
        );
        if (githubResponse.ok) {
          const githubData = await githubResponse.json();
          setCreatorAvatar(githubData.avatar_url);
        }
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    };

    const fetchComments = async (postId: string) => {
      try {
        const response = await fetch(`${apiUrl}/projects/${postId}/comments`);
        if (!response.ok) {
          throw new Error("Error al obtener los comentarios");
        }
        const commentsData = await response.json();

        const commentsWithUsernamesAndAvatars = await Promise.all(
          commentsData.map(async (comment: any) => {
            const userResponse = await fetch(
              `${apiUrl}/users/${comment.userId}`
            );
            if (!userResponse.ok) {
              throw new Error("Error al obtener el nombre de usuario");
            }
            const userData = await userResponse.json();

            // Obtener la imagen de perfil de GitHub para cada comentario
            const githubResponse = await fetch(
              `https://api.github.com/users/${userData.username}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${githubt}`,
                },
              }
            );
            const githubData = await githubResponse.json();
            return {
              ...comment,
              username: userData.username,
              avatarUrl: githubData.avatar_url,
            };
          })
        );

        setComments(commentsWithUsernamesAndAvatars);
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
      const idToken = await currentUser.getIdToken();
      const response = await fetch(`${apiUrl}/projects/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          comment: newComment,
        }),
      });

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
      const idToken = await currentUser.getIdToken();
      const response = await fetch(`${apiUrl}/projects/${id}/like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({}),
      });

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

  const handleEditClick = () => {
    if (currentUser?.uid === post.creatorId) {
      setIsEditing(true);
    } else {
      alert("No tienes permisos para editar este proyecto");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const idToken = await currentUser?.getIdToken();
      const response = await fetch(`${apiUrl}/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(editPostData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el proyecto");
      }

      const updatedPost = await response.json();
      setPost(updatedPost);
      setIsEditing(false); // Deshabilitar el modo de edición
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
        {currentUser?.uid === post.creatorId && !isEditing && (
          <button onClick={handleEditClick}>Editar</button>
        )}

      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            value={editPostData.title}
            onChange={(e) => setEditPostData({ ...editPostData, title: e.target.value })}
          />
          <textarea
            value={editPostData.description}
            onChange={(e) => setEditPostData({ ...editPostData, description: e.target.value })}
          />

          <button type="submit">Guardar cambios</button>
        </form>
      ) : (
        <>
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
        </>
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
            <div className="comment-header" onClick={() => navigate(`/profile/${comment.userId}`)}>
              <img
              src={comment.avatarUrl}
              alt={comment.username}
              className="comment-avatar"
              />
              <p className="comment-user">{comment.username}</p>
            </div>
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
            rows={3}
          ></textarea>
          <button type="submit">Comentar</button>
        </form>
      </div>
    </div>
  );
};
