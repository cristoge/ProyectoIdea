import { db, auth } from "../config/firebaseconfig";
import { User } from "../types/user";
import { auth as adminAuth } from "firebase-admin";

// Función para obtener todos los usuarios
export const getAllUsers = async (): Promise<User[]> => {
  const usersList = await db.collection("user").get();
  const usersMap: User[] = usersList.docs.map((doc) => {
    const data = doc.data();
    return {
      userId: doc.id,
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role,
    } as User;
  });
  return usersMap;
};
export const addUserWithGithub={
  
}

export const addUserWithEmail = async (userData: User): Promise<void> => {
  //Falta añadir la validacion de datos
  try {
    if (!userData.username || !userData.email || !userData.password) {
      throw new Error("Faltan datos obligatorios");
    }
    const { username, email, password, role } = userData;
    // Creacion de usuarios con autenticacion de firebase
    const userRecord = await adminAuth().createUser({
      email,
      password,
      displayName: username,
    });
    const newUser: User = {
      userId: userRecord.uid,
      username,
      email,
      password,
      role: role || "Normal",
    };

    //guarda el usuario en la base de datos
    await db
      .collection("user")
      .doc(userRecord.uid || "defaultId")
      .set(newUser);

    console.log("Usuario registrado y datos guardados en Firestore");
  } catch (error) {
    console.error("Error al agregar el usuario:", error);
    throw new Error();
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  await db.collection("user").doc(userId).delete();
};
