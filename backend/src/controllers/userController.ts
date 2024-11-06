import { FastifyReply, FastifyRequest } from "fastify";
import * as userModel from "../models/userModel"; // Importa el modelo de usuarios
import { User } from "../types/user";


export const getUsers = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const users = await userModel.getAllUsers(); // Llama al modelo para obtener todos los usuarios
    reply.send(users); // Responde con la lista de usuarios
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al obtener los usuarios" });
  }
};

export const addUser = async (
  request: FastifyRequest<{Body:User}>,
  reply: FastifyReply,
) => {
  try {
    const { username, email, password, role } = request.body; // Obtiene los datos del body
    const newUser = {
      username,
      email,
      password,
      role: role || 'Normal'  
    };
    // llamar al modelo
    const docRef = await userModel.addUser(newUser);
    reply.send({ message: "Usuario agregado" }); // Responde con un mensaje
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al agregar el usuario" });
  }
}


export const deleteUser = async (
  request: FastifyRequest<{Params:{userId:string}}>,
  reply: FastifyReply,
) => {
  try {
    const {userId} = request.params; // obtiene el id
    await userModel.deleteUser(userId); //va al modelo y elimina
    reply.send({ message: "Usuario eliminado" }); // responde con un mensaje de que se elimino
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al eliminar el usuario" });
  }
}
