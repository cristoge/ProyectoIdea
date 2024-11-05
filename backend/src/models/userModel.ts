import { db } from "../config/firebaseconfig";
import { User } from "../types/user";
// Función para obtener todos los usuarios
export const getAllUsers = async (): Promise<User[]> => {
  const usersSnapshot = await db.collection("User").get(); // Cambia 'User' a 'users'
  const users: any[] = []; // Cambia User[] a any[]

  usersSnapshot.forEach((doc) => {
    // Agrega el usuario directamente al array
    users.push({ id: doc.id, ...doc.data() }); // No es necesario hacer la conversión a User
  });

  return users; // Retorna el arreglo de usuarios
};
