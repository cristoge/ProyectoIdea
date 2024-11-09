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

export const addUserWithGithub = async (
  request: FastifyRequest<{ Body: { idToken: string, displayName: string, email: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    // § Obtiene los datos del cuerpo de la petición
    const { idToken, displayName, email } = request.body;
    console.log('ID Token recibido:', idToken);

    const newUser: User = await userModel.addUserWithGithub({
      idToken,
      displayName,
      email
    });

    // Devuelve un mensaje de éxito con los datos del nuevo usuario
    reply.send({ message: "Usuario agregado con GitHub", user: newUser });
  } catch (error) {

    request.log.error(error);
    reply.status(500).send({ error: "Error al agregar el usuario con GitHub" });
  }
};

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
