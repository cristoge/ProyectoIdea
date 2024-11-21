import { FastifyReply, FastifyRequest } from "fastify";
import * as projectModel from "../models/projectModel"; // Importa el modelo de proyectos
import { Project } from "../types/project";

// Crear un proyecto
export const createProject = async (
  request: FastifyRequest<{ Body: Project }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const projectData = request.body;
    const userData = request.user.user_id;
    if (!userData) {
      return reply.status(401).send({ error: "Usuario no autenticado" });
    }
    await projectModel.createProject(projectData,userData); // Llama al modelo para crear el proyecto
    reply.send({ message: "Proyecto creado correctamente" });
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al crear el proyecto" });
  }
};

// Editar un proyecto
export const updateProject = async (
  request: FastifyRequest<{ Params: { projectId: string }; Body: Partial<Project> }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { projectId } = request.params;
    const projectData = request.body;
    const userData = request.user.user_id;
    await projectModel.updateProject(projectId, projectData,userData); // Llama al modelo para actualizar el proyecto
    reply.send({ message: "Proyecto actualizado correctamente" });
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al actualizar el proyecto" });
  }
};

// Eliminar un proyecto
export const deleteProject = async (
  request: FastifyRequest<{ Params: { projectId: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { projectId } = request.params;
    await projectModel.deleteProject(projectId); // Llama al modelo para eliminar el proyecto
    reply.send({ message: "Proyecto eliminado correctamente" });
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al eliminar el proyecto" });
  }
};

// Obtener todos los proyectos
export const getAllProjects = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const projects = await projectModel.getAllProjects(); // Llama al modelo para obtener todos los proyectos
    reply.send(projects);
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al obtener los proyectos" });
  }
};

// Obtener un proyecto por ID
export const getProjectById = async (
  request: FastifyRequest<{ Params: { projectId: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { projectId } = request.params;
    const project = await projectModel.getProjectById(projectId); // Llama al modelo para obtener el proyecto por ID
    if (!project) {
      return reply.status(404).send({ error: "Proyecto no encontrado" });
    }
    reply.send(project);
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al obtener el proyecto" });
  }
};

export const getProjectsByUser = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const userData = request.user.user_id;
    if (!userData) {
      return reply.status(401).send({ error: "Usuario no autenticado" });
    }
    const projects = await projectModel.getProjectsByUserId(userData); // Llama al modelo para obtener todos los proyectos
    reply.send(projects);
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al obtener los proyectos" });
  }
}
