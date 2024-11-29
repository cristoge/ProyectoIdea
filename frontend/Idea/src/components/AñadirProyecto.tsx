import { getAuth } from 'firebase/auth'; // Importa el método de autenticación de Firebase
import { app } from '../../firebaseConfig'; // Asegúrate de que esto apunte a tu archivo de configuración de Firebase
import { useState } from 'react';

const CreateProject = () => {
  const [loading, setLoading] = useState(false); // Estado para indicar si la solicitud está en curso
  const [projectTitle, setProjectTitle] = useState(''); // Estado para el título del proyecto
  const [projectDescription, setProjectDescription] = useState(''); // Estado para la descripción del proyecto

  const createProject = async () => {
    try {
      setLoading(true); // Establece el estado de carga a true cuando comienza la solicitud

      // Obtén el token del usuario autenticado desde Firebase
      const auth = getAuth(app);
      const currentUser = auth.currentUser;

      if (currentUser) {
        const token = await currentUser.getIdToken(); // Obtén el token de ID del usuario

        // Cuerpo del proyecto a enviar (incluyendo título y descripción)
        const projectData = {
          title: projectTitle, // El título del proyecto
          description: projectDescription, // La descripción del proyecto
        };

        const response = await fetch("http://localhost:3000/projects", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el header de autorización
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData), // El cuerpo de la solicitud con los datos del proyecto
        });

        const data = await response.json(); // Convierte la respuesta a JSON

        if (response.ok) {
          console.log("Proyecto creado correctamente:", data); // Muestra la respuesta en la consola
        } else {
          console.error("Error al crear el proyecto:", data.error); // Muestra el error si ocurre
        }
      } else {
        console.error("No user is authenticated.");
      }
    } catch (error) {
      console.error("Error durante la solicitud:", error); // Maneja los errores en la solicitud
    } finally {
      setLoading(false); // Establece el estado de carga a false cuando la solicitud termina
    }
  };

  return (
    <div>
      <h2>Create Project</h2>
      <input
        type="text"
        placeholder="Enter project title"
        value={projectTitle}
        onChange={(e) => setProjectTitle(e.target.value)} // Actualiza el título del proyecto
      />
      <textarea
        placeholder="Enter project description"
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)} // Actualiza la descripción del proyecto
      />
      <button
        onClick={createProject}
        disabled={loading || !projectTitle || !projectDescription} // Deshabilita el botón si faltan datos
      >
        {loading ? "Loading..." : "Create Project"}
      </button>
      <p>Check the console for project creation result.</p>
    </div>
  );
};

export default CreateProject;
