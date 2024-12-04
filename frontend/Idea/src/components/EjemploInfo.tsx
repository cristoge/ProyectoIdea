import { getAuth } from 'firebase/auth'; // Importa el método de autenticación de Firebase
import { app } from '../../firebaseConfig'; // Asegúrate de que esto apunte a tu archivo de configuración de Firebase
import { useState } from 'react';
//provisional
const UserProfile = () => {
  const [loading, setLoading] = useState(false); // Estado para indicar si la solicitud está en curso

  const fetchUserData = async () => {
    try {
      setLoading(true); // Establece el estado de carga a true cuando comienza la solicitud

      // Obtén el token del usuario autenticado desde Firebase
      const auth = getAuth(app);
      const currentUser = auth.currentUser;

      if (currentUser) {
        const token = await currentUser.getIdToken(); // Obtén el token de ID del usuario

        const response = await fetch("http://localhost:3000/projectuser", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el header de autorización
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json(); // Convierte la respuesta a JSON

        if (response.ok) {
          console.log("User data:", data); // Muestra los datos del usuario en la consola
        } else {
          console.error("Error fetching user data:", data.error); // Muestra el error si ocurre
        }
      } else {
        console.error("No user is authenticated.");
      }
    } catch (error) {
      console.error("Error during fetch:", error); // Maneja los errores en la solicitud
    } finally {
      setLoading(false); // Establece el estado de carga a false cuando la solicitud termina
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      <button onClick={fetchUserData} disabled={loading}>
        {loading ? "Loading..." : "Fetch User Data"}
      </button>
      <p>Check the console for user data.</p>
    </div>
  );
};

export default UserProfile;
