import { db } from "../config/firebaseconfig";
import { User } from "../types/user";
// Función para obtener todos los usuarios
export const getAllUsers = async (): Promise<User[]> => {
  const usersSnapshot = await db.collection("user").get(); // Cambia 'User' a 'users'
  const users: any[] = [];

  usersSnapshot.forEach((doc) => {
    // Agrega el usuario directamente al array
    users.push({ id: doc.id, ...doc.data() }); // No es necesario hacer la conversión a User
  });

  return users; // Retorna el arreglo de usuarios
};

export const addUser = async (newUser:User): Promise<void> => {
  await db.collection("user").add(newUser);
};

export const deleteUser = async (userId:string): Promise<void> => {
  await db.collection("user").doc(userId).delete();
}