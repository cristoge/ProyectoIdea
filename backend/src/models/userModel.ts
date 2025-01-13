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

export const getUserById = async (userId: string) => {
  try {
    const user = await db.collection("user").doc(userId).get();
    if (!user.exists) {
      throw new Error("Usuario not found");
    }
    return user.data();
  } catch (error) {
    throw new Error("Error retrieving the user data");
  }
};
//para poder sincronizar con github se necesita un token desde el frontend, podria hacer un patch y que guarde el token de github en la base de datos.
export const addUserWithGithub = async (userData: {
  idToken: string;
  githubToken: string;
  displayName: string;
  email: string;
}): Promise<User> => {
  try {
    const { idToken, displayName, githubToken, email } = userData;

    // Verificación del token
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
      description: "",
      role: "Normal",
    };

    // Crear la subcolección github con los datos relevantes de GitHub
    const githubData = {
      githubId: userRecord.uid,
      githubToken: githubToken,
    };

    // Guardar el documento del usuario
    await userRef.set(newUser);

    // Agregar la subcolección github
    await userRef.collection("github").doc("data").set(githubData);

    return newUser;
  } catch (error) {
    console.error("Error al agregar el usuario con GitHub:", error);
    throw new Error("Error al agregar el usuario con GitHub");
  }
};

export const addUserWithEmail = async (userData: User): Promise<void> => {
  try {
    // Validación de datos
    if (!userData.username || !userData.email || !userData.password) {
      throw new Error("Faltan datos obligatorios: username, email y password son necesarios.");
    }

    const { username, email, password, role } = userData;

    // Creación de usuario con autenticación de Firebase
    const userRecord = await adminAuth().createUser({
      email,
      password,
      displayName: username,
    });

    // Creación de la estructura del nuevo usuario
    const newUser: User = {
      userId: userRecord.uid, 
      username,
      email,
      profilePicture: null, 
      role: role || "Normal", 
      description: "", 
    };

    // Guardar el nuevo usuario en Firestore
    await db.collection("user").doc(userRecord.uid).set(newUser);

    console.log("Usuario registrado y datos guardados en Firestore");
  } catch (error) {
    console.error("Error al agregar el usuario:", error);

    // Lanzar un error con más contexto
    throw new Error(`Error al crear el usuario: ${(error as Error).message}`);
  }
};


export const deleteUser = async (userId: string): Promise<void> => {
  await db.collection("user").doc(userId).delete();
};
export function loginUser(email: string, password: string) {
  throw new Error("Function not implemented.");
}

export const updateProfilePicture = async (
  userId: string,
  newProfilePictureUrl: string
): Promise<void> => {
  try {
    // Actualizar la URL de la foto de perfil en Firebase Authentication
    await adminAuth().updateUser(userId, {
      photoURL: newProfilePictureUrl,
    });

    // También actualizar en la base de datos (Firestore)
    const userDoc = db.collection("user").doc(userId);
    const user = await userDoc.get();

    if (!user.exists) {
      throw new Error("Usuario no encontrado");
    }

    // Actualizar la información del perfil en Firestore
    await userDoc.update({
      profilePicture: newProfilePictureUrl,
    });

    console.log("Foto de perfil actualizada correctamente");
  } catch (error) {
    console.error("Error al actualizar la foto de perfil:", error);
    throw new Error("No se pudo actualizar la foto de perfil");
  }
};

export const getUserByIdParams = async (
  userId: string
): Promise<{ username: string }> => {
  try {
    const userDoc = await db.collection("user").doc(userId).get();
    if (!userDoc.exists) {
      throw new Error("Usuario no encontrado");
    }
    const userData = userDoc.data();
    if (!userData) {
      throw new Error("Datos del usuario no encontrados");
    }
    return {
      username: userData.username,
    };
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    throw new Error("Error al obtener los datos del usuario");
  }
};

//aun no testado
export const editUser = async (
  userId: string,
  userData: Partial<User>
): Promise<void> => {
  try {
    const userRef = db.collection("user").doc(userId);
    const updateData: any = {};
    if (userData.profilePicture) updateData.profilePicture = userData.profilePicture;
    if (userData.description) updateData.description = userData.description;
    await userRef.update(updateData);
  } catch (error) {
    console.error("Error al editar el usuario:", error);
    throw new Error("Error al editar el usuario");
  }
};
