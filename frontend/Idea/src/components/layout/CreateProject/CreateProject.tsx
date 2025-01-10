'use client'

import { useState, ChangeEvent } from 'react'
import { getAuth } from "firebase/auth"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { app } from "../../../../firebaseConfig"
import './CreateProject.css'

export const CreateProject = () => {
  const [loading, setLoading] = useState(false)
  const [projectTitle, setProjectTitle] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [projectLink, setProjectLink] = useState("")  // Nuevo estado para el enlace

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags((prevTags) => [...prevTags, newTag])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove))
  }

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const storage = getStorage(app)
    const storageRef = ref(storage, `projects/${file.name}-${Date.now()}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          resolve(downloadURL)
        }
      )
    })
  }

  const createProject = async () => {
    try {
      setLoading(true)
      const auth = getAuth(app)
      const currentUser = auth.currentUser

      if (!currentUser) {
        console.error("No user is authenticated.")
        return
      }

      const token = await currentUser.getIdToken()
      let imageVideoUrl = ""

      if (imageFile) {
        imageVideoUrl = await uploadImageToStorage(imageFile)
      }

      const projectData = {
        title: projectTitle,
        description: projectDescription,
        imageVideoUrl,
        tags,
        link: projectLink,  // Incluir el link en los datos del proyecto
      }

      const response = await fetch("http://localhost:3000/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("Proyecto creado correctamente:", data)
        
      } else {
        console.error("Error al crear el proyecto:", data.error);
      }
    } catch (error) {
      console.error("Error durante la solicitud:", error)
    } finally {
      setLoading(false)
    }
  }

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
      <button
        onClick={createProject}
        disabled={loading || !projectTitle || !projectDescription || !imageFile}
        className="create-project-btn"
      >
        {loading ? "Creando Proyecto..." : "Crear Proyecto"}
      </button>
    </div>
  )
}
