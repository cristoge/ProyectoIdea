import { FastifyInstance } from "fastify";
import { User } from "../types/user"; // Adjust the import path as necessary
import * as userController from "../controllers/userController"; // Importa el controlador de usuarios
import { authMiddleware } from "../middlewares/authenticateToken";
export const userRoutes = async (app: FastifyInstance) => {
  // Ruta para obtener todos los usuarios
  app.get("/users", userController.getUsers);
  app.get("/userData", { preHandler: authMiddleware }, userController.getUserData);
  
  
  app.post<{ Body: User }>("/users", userController.addUserWithEmail);
  app.post("/users/github", userController.addUserWithGithub);
  app.post<{ Body: { token: string } }>("/login",{ preHandler: authMiddleware }, userController.loginUser);
  
  
  app.delete("/users/:userId", userController.deleteUser);
};
