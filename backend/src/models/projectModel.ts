import { db } from "../config/firebaseconfig";
import { Project } from "../types/project";
import { Comment } from "../types/project";
// Función para crear un nuevo proyecto


//Se crea un proyecto con los datos que se pasan desde el front abajo indicados
export const createProject = async (
  projectData: Project,
  userData: string
): Promise<void> => {
  try {
    const projectRef = db.collection("project").doc();
    projectData.projectId = projectRef.id;

    const newProject: Project = {
      ...projectData, //deberia ser los datos pasados desde el front.
      projectId: projectRef.id,
      // title: "",
      // description:      "",
      // imageVideoUrl:    "",
      // repositoryLink:   "",
      creationDate: new Date(),
      creatorId: userData,
      likeCounts: 0,
      likedBy: [],
    };

    await projectRef.set(newProject);
    console.log("Proyecto creado correctamente");
    // Crear la subcolección 'comments' vacía
    
  } catch (error) {
    console.error("Error al crear el proyecto o agregar comentarios:", error);
    throw new Error("No se pudo crear el proyecto o agregar comentarios");
  }
};


// Función para editar un proyecto existente
export const updateProject = async (
  projectId: string,
  projectData: Partial<Project>,
  userId: any
): Promise<void> => {
  try {
    const projectRef = db.collection("project").doc(projectId);
    const projectDoc = await projectRef.get();
    if (!projectDoc.exists) {
      throw new Error("Proyecto no encontrado");
    }
    const project = projectDoc.data();
    if (!project) {
      throw new Error("Proyecto no encontrado");
    }
    if (project.creatorId !== userId) {
      throw new Error("No tienes permisos para actualizar este proyecto");
    }
    await projectRef.update(projectData);
    console.log("Proyecto actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar el proyecto:", error);
    throw new Error("No se pudo actualizar el proyecto");
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    const projectRef = db.collection("projects").doc(projectId);
    await projectRef.delete();
    console.log("Proyecto eliminado correctamente");
  } catch (error) {
    console.error("Error al eliminar el proyecto:", error);
    throw new Error("No se pudo eliminar el proyecto");
  }
};

// Función para obtener todos los proyectos
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const projectSnapshot = await db.collection("project").get();
    const projects: Project[] = projectSnapshot.docs.map(
      (doc) => doc.data() as Project
    );
    return projects;
  } catch (error) {
    console.error("Error al obtener los proyectos:", error);
    throw new Error("No se pudieron obtener los proyectos");
  }
};

// Función para obtener un proyecto por su ID
export const getProjectById = async (
  projectId: string
): Promise<Project | null> => {
  try {
    const projectDoc = await db.collection("project").doc(projectId).get();
    if (!projectDoc.exists) {
      return null;
    }
    return projectDoc.data() as Project;
  } catch (error) {
    console.error("Error al obtener el proyecto:", error);
    throw new Error("No se pudo obtener el proyecto");
  }
};
export const getProjectsByUserId = async (
  userId: string
): Promise<Project[]> => {
  try {
    const projectSnapshot = await db
      .collection("project")
      .where("creatorId", "==", userId)
      .get();
    const projects: Project[] = projectSnapshot.docs.map(
      (doc) => doc.data() as Project
    );
    return projects;
  } catch (error) {
    console.error("Error al obtener los proyectos:", error);
    throw new Error("No se pudieron obtener los proyectos");
  }
};

export const likeProject = async (
  projectId: string,
  userId: string
): Promise<void> => {
  try {
    const projectRef = db.collection("project").doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      throw new Error("Proyecto no encontrado");
    }

    const project = projectDoc.data();
    if (!project) {
      throw new Error("Proyecto no encontrado");
    }

    if (project.likedBy.includes(userId)) {
      throw new Error("Ya has dado like a este proyecto");
    }

    // Actualizar el proyecto con el like
    await projectRef.update({
      likeCounts: project.likeCounts + 1,
      likedBy: [...project.likedBy, userId],
    });

    // Ahora actualizamos los favoritos del usuario
    const userRef = db.collection("user").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error("Usuario no encontrado");
    }

    const user = userDoc.data();
    if (!user) {
      throw new Error("Datos de usuario inválidos");
    }

    // Si el usuario no tiene una lista de favoritos, la inicializamos como un array vacío
    const updatedFavorites = Array.isArray(user.favorites) ? user.favorites : [];
    
    if (updatedFavorites.includes(projectId)) {
      throw new Error("Este proyecto ya está en tus favoritos");
    }

    // Actualizar los favoritos del usuario
    await userRef.update({
      favorites: [...updatedFavorites, projectId],
    });

    console.log("Proyecto actualizado y agregado a los favoritos correctamente");
  } catch (error) {
    console.error("Error al actualizar el proyecto y los favoritos del usuario:", error);
    throw new Error("No se pudo actualizar el proyecto y los favoritos");
  }
};

export const rankingProjects = async (): Promise<Project[]> => {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1); // hace 1 mes
    const projectSnapshot = await db
      .collection("project")
      .orderBy("likeCounts", "desc")
      .limit(10)
      .get();
    const projects: Project[] = projectSnapshot.docs.map(
      (doc) => doc.data() as Project
    );
    return projects;
  } catch (error) {
    console.error("Error al obtener los proyectos:", error);
    throw new Error("No se pudieron obtener los proyectos");
  }
};


export const addComment = async (
  projectId: string,        
  userId: string,           
  content: string
): Promise<void> => {
  try {
    const projectRef = db.collection("project").doc(projectId); 
    const commentsRef = projectRef.collection("comments"); 

    const newComment: Comment = {
      commentId: "", // Puedes dejarlo vacío aquí
      userId,                    
      content,                
      creationDate: new Date(),  
    };

    // Se agrega el comentario y se obtiene el ID generado
    const docRef = await commentsRef.add(newComment);
    
    // Ahora asignamos el ID generado al campo `commentId`
    newComment.commentId = docRef.id;

    // Se actualiza el comentario con su propio ID
    await docRef.update({ commentId: newComment.commentId });

    console.log("Comentario agregado correctamente");
  } catch (error) {
    console.error("Error al agregar el comentario:", error);
    throw new Error("No se pudo agregar el comentario");
  }
};

export const getCommentsByProjectId = async (
  projectId: string
): Promise<Comment[]> => {
  try {
    const projectRef = db.collection("project").doc(projectId);
    const commentsSnapshot = await projectRef.collection("comments").get();
    const comments: Comment[] = commentsSnapshot.docs.map(
      (doc) => doc.data() as Comment
    );
    return comments;
  } catch (error) {
    console.error("Error al obtener los comentarios:", error);
    throw new Error("No se pudieron obtener los comentarios");
  }
}