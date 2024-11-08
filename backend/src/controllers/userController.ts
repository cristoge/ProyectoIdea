import { FastifyReply, FastifyRequest } from "fastify";
import * as userModel from "../models/userModel"; // Importa el modelo de usuarios
import { User } from "../types/user";


export const getUsers = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const users :User[] = await userModel.getAllUsers(); // Llama al modelo 
    reply.send(users); 
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al obtener los usuarios" });
  }
};

//Funcion para poder agregar un usuario con github
// export const addUserWithGithub = async (
//   request: FastifyRequest<{Body:User}>,
//   reply: FastifyReply,
// ):Promise<void> => {
//   try {
//     //devuelve el id pero ahora mismo no lo estoy usando
//     const docRef = await userModel.addUserWithGithub(request.body);
//     reply.send({ message: "Usuario agregado" }); 
//   } catch (error) {
//     request.log.error(error);
//     reply.status(500).send({ error: "Error al agregar el usuario" });
//   }
// }

export const addUserWithEmail = async (
  request: FastifyRequest<{Body:User}>,
  reply: FastifyReply,
):Promise<void> => {
  //
  try {
    //devuelve el id pero ahora mismo no lo estoy usando
    const docRef = await userModel.addUserWithEmail(request.body);
    reply.send({ message: "Usuario agregado" }); 
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
    reply.send({ message: "Usuario eliminado" }); 
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: "Error al eliminar el usuario" });
  }
}
