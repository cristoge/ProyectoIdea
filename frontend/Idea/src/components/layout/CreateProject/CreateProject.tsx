import { useState, ChangeEvent, useEffect } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { app } from "../../../../firebaseConfig"
import { useAuth } from '../../../auth/AuthContext'
import './CreateProject.css'
import imageCompression from 'browser-image-compression';

export const CreateProject = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const githubt = import.meta.env.VITE_GITHUB;
  const availableCategories = [
    "Frontend",
    "Backend",
    "Mobile",
    "Data Science",
    "DevOps",
    "Machine Learning",
    "Cybersecurity",
    "Blockchain",
    "Game Development",
    "UI/UX",
    "Artificial Intelligence",
    "Virtual Reality",
    "Database",
  ];
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        const response = await fetch(`${apiUrl}/userData`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUserData(data);
        } else {
          console.error("Error fetching user data:", data.error);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags((prevTags) => [...prevTags, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const fetchGitHubRepos = async () => {
    try {
      const busqueda = userData.username;
      const githubResponse = await fetch(`https://api.github.com/users/${busqueda}/repos`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${githubt}`,
        },
      });
      const githubData = await githubResponse.json();
      setGithubRepos(githubData);
    } catch (error) {
      console.error("Error fetching GitHub repos:", error);
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      return file;
    }
  }

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const compressedFile = await compressImage(file);
    const storage = getStorage(app);
    const storageRef = ref(storage, `projects/${compressedFile.name}-${Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, compressedFile);

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
  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const createProject = async () => {
    try {
      setLoading(true);

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
        imageVideoUrl,
        tags,
        link: projectLink,
        repository: selectedRepo, // Incluir el repositorio seleccionado
        categories: selectedCategories,
      };

      const response = await fetch(`${apiUrl}/projects`, {
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
    <div className="create-project-form">
      <h2>Crear Proyecto</h2>
      <div className="form-group">
        <label htmlFor="projectTitle">Título del Proyecto</label>
        <input
          id="projectTitle"
          type="text"
          placeholder="Ingrese el título del proyecto"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="projectDescription">Descripción del Proyecto</label>
        <textarea
          id="projectDescription"
          placeholder="Ingrese la descripción del proyecto"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          rows={4}
        />
      </div>
      <div className="form-group">
        <label htmlFor="projectImage">Imagen del Proyecto</label>
        <input
          id="projectImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {imageFile && <p className="file-name">{imageFile.name}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="projectLink">Enlace del Proyecto</label>
        <input
          id="projectLink"
          type="url"
          placeholder="Ingrese el enlace"
          value={projectLink}
          onChange={(e) => setProjectLink(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Categorías del Proyecto</label>
        <div className="repos-list">
          {availableCategories.map((category) => (
            <div key={category}>
              <input
                type="checkbox"
                id={`category-${category}`}
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              <label htmlFor={`category-${category}`}>{category}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="projectTags">Etiquetas del Proyecto</label>
        <div className="tag-input">
          <input
            id="projectTags"
            type="text"
            placeholder="Agregar una etiqueta"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
          />
          <button type="button" onClick={handleAddTag} className="add-tag-btn">Agregar</button>
        </div>
        <div className="tags-list">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
              <button onClick={() => handleRemoveTag(tag)} className="remove-tag-btn">X</button>
            </span>
          ))}
        </div>
      </div>

      {/* Checkbox for GitHub repos */}
      <div className="form-group">
        <label>Seleccionar Repositorio de GitHub</label>
        <div className="repos-list">
          {githubRepos.length > 0 ? (
            githubRepos.map((repo) => (
              <div key={repo.id}>
                <input
                  type="radio"
                  id={`repo-${repo.id}`}
                  value={repo.name}
                  checked={selectedRepo === repo.name}
                  onChange={() => setSelectedRepo(repo.name)}
                />
                <label htmlFor={`repo-${repo.id}`}>{repo.name}</label>
              </div>
            ))
          ) : (
            <p>No se encontraron repositorios. Carga los repositorios primero.</p>
          )}
        </div>
        <button type="button" onClick={fetchGitHubRepos} className="fetch-repos-btn">
          Cargar Repositorios
        </button>
      </div>

      <button
        onClick={createProject}
        disabled={loading || !projectTitle || !projectDescription || !imageFile}
        className="create-project-btn"
      >
        {loading ? "Creando Proyecto..." : "Crear Proyecto"}
      </button>
    </div>
  );
};
