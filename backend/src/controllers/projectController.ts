import { FastifyReply, FastifyRequest } from "fastify";
import * as projectModel from "../models/projectModel"; // Importa el modelo de proyectos
import { Project } from "../types/project";

// Crear un proyecto Donde se le pasa nombre, la imagen, y la descripción, el usuario lo saca del token
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
    await projectModel.createProject(projectData, userData); // Llama al modelo para crear el proyecto
    reply.send({ message: "Proyecto creado correctamente" });
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al crear el proyecto" });
  }
};

// Editar un proyecto
export const updateProject = async (
  request: FastifyRequest<{
    Params: { projectId: string };
    Body: Partial<Project>;
  }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { projectId } = request.params;
    const projectData = request.body;
    const userData = request.user.user_id;
    await projectModel.updateProject(projectId, projectData, userData); // Llama al modelo para actualizar el proyecto
    reply.send({ message: "Proyecto actualizado correctamente" });
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al actualizar el proyecto" });
  }
};

// Eliminar un proyecto
// no aplicado en el front
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

// Obtener todos los proyectos de la base de datos
export const getAllProjects = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const projects = await projectModel.getAllProjects();
    reply.send(projects);
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al obtener los proyectos" });
  }
};

// Obtener un proyecto por ID de la base de datos
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

// Obtener los proyectos de un usuario falta por completar
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
};

// Dar like a un proyecto, completado falta dar dislike si eso
export const likeProject = async (
  request: FastifyRequest<{ Params: { projectId: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { projectId } = request.params;
    const userData = request.user.user_id;
    await projectModel.likeProject(projectId, userData);
    reply.send({ message: "Proyecto liked" });
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al dar like al proyecto" });
  }
};


// Ranking de proyectos por likes, aun no aplicado en el front
export const rankingProjects = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const projects = await projectModel.rankingProjects();
    reply.send(projects);
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al obtener los proyectos" });
  }
};

// Comentar un proyecto, funcional no tiene la opcion de eliminar el comentario ni editarlo
export const addComment = async (
  request: FastifyRequest<{ Body: { comment: string }; Params: { projectId: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { projectId } = request.params;
    const { comment } = request.body;
    const userId = request.user.user_id;
    await projectModel.addComment(projectId, userId, comment);
    reply.send({ message: "Comentario agregado correctamente" });
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al agregar el comentario" });
  }
}

// Obtener los comentarios de un proyecto, funcional, pequeño error en react por la key
export const getComments = async (
  request: FastifyRequest<{ Params: { projectId: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { projectId } = request.params;
    const comments = await projectModel.getCommentsByProjectId(projectId);
    reply.send(comments);
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al obtener los comentarios" });
  }
}