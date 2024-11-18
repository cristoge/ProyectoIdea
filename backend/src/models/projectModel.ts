import { db } from "../config/firebaseconfig";
import { Project } from "../types/project";

// Función para crear un nuevo proyecto
export const createProject = async (projectData: Project,userData:string): Promise<void> => {
  try {
    const projectRef = db.collection("project").doc();
    projectData.projectId = projectRef.id; 
    
    const newProject : Project = {
      ...projectData,//deberia ser los datos pasados desde el front.           
      projectId: projectRef.id,
      // title: "",
      // description:      "",
      // imageVideoUrl:    "",
      // repositoryLink:   "",
      creatorId: userData,      
      likeCounts: 0,            
      likedBy: [],      
    };

    await projectRef.set(newProject);
    console.log("Proyecto creado correctamente");
  } catch (error) {
    console.error("Errora al crear el proyecto:", error);
    throw new Error("No se pudo crear el proyecto");
  }
};

// Función para editar un proyecto existente
export const updateProject = async (projectId: string, projectData: Partial<Project>,userId:any): Promise<void> => {
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
    const projects: Project[] = projectSnapshot.docs.map(doc => doc.data() as Project);
    return projects;
  } catch (error) {
    console.error("Error al obtener los proyectos:", error);
    throw new Error("No se pudieron obtener los proyectos");
  }
};

// Función para obtener un proyecto por su ID
export const getProjectById = async (projectId: string): Promise<Project | null> => {
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