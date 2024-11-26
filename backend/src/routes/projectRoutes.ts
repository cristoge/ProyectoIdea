import { FastifyInstance } from "fastify";
import { Project } from "../types/project";
import * as projectController from "../controllers/projectController";
import { authMiddleware } from "../middlewares/authenticateToken";

export const projectRoutes = async (app: FastifyInstance) => {
  // Rutas públicas: obtener todos los proyectos o un proyecto por ID
  app.get("/projects", projectController.getAllProjects);
  app.get("/projects/:projectId", projectController.getProjectById);

  // Rutas protegidas: requieren autenticación para crear, actualizar o eliminar proyectos
  app.post<{ Body: Project }>("/projects", { preHandler: [authMiddleware] }, projectController.createProject);
  app.put<{ Params: { projectId: string }; Body: Partial<Project> }>("/projects/:projectId", { preHandler: [authMiddleware] }, projectController.updateProject);
  app.delete<{ Params: { projectId: string } }>("/projects/:projectId", { preHandler: [authMiddleware] }, projectController.deleteProject);

  app.get("/usersposts",{preHandler: [authMiddleware]}, projectController.getProjectsByUser);
  app.get("/ranking", projectController.rankingProjects);
};

