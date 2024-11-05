import { FastifyInstance } from "fastify";
import * as userController from "../controllers/userController"; // Importa el controlador de usuarios

export const userRoutes = async (app: FastifyInstance) => {
  // Ruta para obtener todos los usuarios
  app.get("/users", userController.getUsers);
};
