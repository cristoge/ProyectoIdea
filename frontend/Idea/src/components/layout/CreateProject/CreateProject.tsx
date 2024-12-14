import { getAuth } from "firebase/auth"; 
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; 
import { app } from "../../../../firebaseConfig"; 
import { useState } from "react";

export const CreateProject = () => {
  const [loading, setLoading] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const storage = getStorage(app);
    const storageRef = ref(storage, `projects/${file.name}-${Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const createProject = async () => {
    try {
      setLoading(true);
      const auth = getAuth(app);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error("No user is authenticated.");
        return;
      }

      const token = await currentUser.getIdToken();
      let imageVideoUrl = "";

      if (imageFile) {
        imageVideoUrl = await uploadImageToStorage(imageFile);
      }

      const projectData = {
        title: projectTitle,
        description: projectDescription,
        imageVideoUrl, // URL de la imagen subida
      };

      const response = await fetch("http://localhost:3000/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Proyecto creado correctamente:", data);
      } else {
        console.error("Error al crear el proyecto:", data.error);
      }
    } catch (error) {
      console.error("Error durante la solicitud:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Project</h2>
      <input
        type="text"
        placeholder="Enter project title"
        value={projectTitle}
        onChange={(e) => setProjectTitle(e.target.value)}
      />
      <textarea
        placeholder="Enter project description"
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
      />
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        onClick={createProject}
        disabled={loading || !projectTitle || !projectDescription || !imageFile}
      >
        {loading ? "Loading..." : "Create Project"}
      </button>
    </div>
  );
};

