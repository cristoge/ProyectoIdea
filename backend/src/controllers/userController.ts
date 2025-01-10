import { FastifyReply, FastifyRequest } from "fastify";
import * as userModel from "../models/userModel"; // Importa el modelo de usuarios
import { User } from "../types/user";
import { auth } from "firebase-admin";

// Obtener todos los usuarios de la base de datos
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

// Obtener los datos de un usuario, basado en el ID del usuario autenticado
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

// Obtener los datos de un usuario, basado en el ID del usuario autenticado
export const getUserByIdParams = async (
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params;
    const user = await userModel.getUserByIdParams(userId);
    reply.send(user);
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al obtener el usuario" });
  }
}

// Agregar un usuario con GitHub
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


// Agregar un usuario con email y contraseña, no aplicado aun
export const addUserWithEmail = async (
  request: FastifyRequest<{ Body: User }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { email, password, username, role } = request.body;

    // Validación de campos obligatorios
    if (!email || !password || !username) {
      return reply.status(400).send({ error: "Faltan datos obligatorios" });
    }

    // Añade el usuario utilizando el método en el modelo (presumiblemente interactuando con Firestore o Firebase Auth)
    const docRef = await userModel.addUserWithEmail({ email, password, username, role, userId: "", description: "" });

    // Respuesta exitosa
    reply.send({ message: "Usuario agregado correctamente"});
  } catch (error) {
    request.log.error(error);

    // Respuesta de error
    reply.status(500).send({ error: "Error al agregar el usuario" });
  }
};



//No aplicado aun
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

//No aplicado se hace en el front
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

export const editUser = async (
  request: FastifyRequest<{ Body: Partial<User> }>,
  reply: FastifyReply
) => {
  try {
    const userData = request.body;
    const userId = request.user.uid;
    await userModel.editUser(userId, userData);
    reply.send({ message: "Usuario actualizado" });
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al actualizar el usuario" });
  }
}