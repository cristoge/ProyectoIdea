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

export const getUserById = async (userId: string)=> {
  try {
    const user = await db.collection("user").doc(userId).get();
    if (!user.exists) {
      throw new Error("Usuario not found");
    }
    return user.data();
  } catch (error) {
    throw new Error("Error retrieving the user data");
  }
}
//para poder sincronizar con github se necesita un token desde el frontend, podria hacer un patch y que guarde el token de github en la base de datos.
export const addUserWithGithub = async (userData: { idToken: string,githubToken:string, displayName: string, email: string }): Promise<User> => {
  try {
    const { idToken, displayName,githubToken ,email } = userData;

    // Verificacion del token
    const userRecord = await adminAuth().verifyIdToken(idToken);

    const userRef = db.collection("user").doc(userRecord.uid);
    const existingUserDoc = await userRef.get();

    if (existingUserDoc.exists) {
      console.log("Usuario ya registrado. Retornando datos existentes.");
      const existingUser = existingUserDoc.data() as User;
      return existingUser;
    }
    
    const newUser: User = {
      userId: userRecord.uid,
      username: displayName || "", 
      email: email || userRecord.email || "",
      profilePicture: userRecord.photoURL || null,
      githubId: userRecord.uid, 
      githubToken: githubToken, 
      role: "Normal", 
    };

    await db.collection("user").doc(userRecord.uid).set(newUser);
    return newUser;

  } catch (error) {
    console.error("Error al agregar el usuario con GitHub:", error);
    throw new Error("Error al agregar el usuario con GitHub");
  }
};

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
      profilePicture: null,
      githubId: null,
      githubToken: null,
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
export function loginUser(email: string, password: string) {
  throw new Error("Function not implemented.");
}

export const updateProfilePicture = async (userId: string, newProfilePictureUrl: string): Promise<void> => {
  try {
    // Actualizar la URL de la foto de perfil en Firebase Authentication
    await adminAuth().updateUser(userId, {
      photoURL: newProfilePictureUrl
    });

    // También actualizar en la base de datos (Firestore)
    const userDoc = db.collection("user").doc(userId);
    const user = await userDoc.get();

    if (!user.exists) {
      throw new Error("Usuario no encontrado");
    }

    // Actualizar la información del perfil en Firestore
    await userDoc.update({
      profilePicture: newProfilePictureUrl
    });

    console.log("Foto de perfil actualizada correctamente");
  } catch (error) {
    console.error("Error al actualizar la foto de perfil:", error);
    throw new Error("No se pudo actualizar la foto de perfil");
  }
};
