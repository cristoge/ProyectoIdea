import { FastifyReply, FastifyRequest } from "fastify";
import * as userModel from "../models/userModel"; // Importa el modelo de usuarios
import { User } from "../types/user";
import { auth } from "firebase-admin";

export const getUsers = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const users: User[] = await userModel.getAllUsers(); // Llama al modelo
    reply.send(users);
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al obtener los usuarios" });
  }
};
export const getUserData = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = request.user.uid;
    const userData = await userModel.getUserById(userId);
    reply.send(userData);
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al obtener el usuario" });
  }
};

export const addUserWithGithub = async (
  request: FastifyRequest<{
    Body: {
      idToken: string;
      githubToken: string;
      displayName: string;
      email: string;
    };
  }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    // § Obtiene los datos del cuerpo de la petición
    const { idToken, githubToken, displayName, email } = request.body;
    console.log("ID Token recibido:", idToken);

    const newUser: User = await userModel.addUserWithGithub({
      idToken,
      githubToken,
      displayName,
      email,
    });

    // Devuelve un mensaje de éxito con los datos del nuevo usuario
    reply.send({ message: "Usuario agregado con GitHub", user: newUser });
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al agregar el usuario con GitHub" });
  }
};

export const addUserWithEmail = async (
  request: FastifyRequest<{ Body: User }>,
  reply: FastifyReply
): Promise<void> => {
  //
  try {
    //devuelve el id pero ahora mismo no lo estoy usando
    const docRef = await userModel.addUserWithEmail(request.body);
    reply.send({ message: "Usuario agregado" });
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al agregar el usuario" });
  }
};

export const deleteUser = async (
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params; // obtiene el id
    await userModel.deleteUser(userId); //va al modelo y elimina
    reply.send({ message: "Usuario eliminado" });
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al eliminar el usuario" });
  }
};

export const loginUser = async (
  request: FastifyRequest<{ Body: { token: string } }>,
  reply: FastifyReply
) => {
  try {
    const { token } = request.body;
    const decodedToken = await auth().verifyIdToken(token);

    const userId = decodedToken.uid;
    const userEmail = decodedToken.email;

    console.log("Verified user:", userEmail);

    // Mensaje de éxito
    reply.send({ message: "Login successful", userId, userEmail });
  } catch (error) {
    console.error("Error ", error);
    reply.status(401).send({ error: "Invalid or expired token" });
  }
};

export const updateProfilePicture = async (
  request: FastifyRequest<{ Body: { profilePicture: string } }>,
  reply: FastifyReply
) => {
  try {
    const { profilePicture } = request.body;
    const userId = request.user.uid;
    await userModel.updateProfilePicture(userId, profilePicture);
    reply.send({ message: "Foto de perfil actualizada" });
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al actualizar la foto de perfil" });
  }
};
