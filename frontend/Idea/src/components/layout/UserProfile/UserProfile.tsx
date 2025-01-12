import { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { Card } from "../../common";

interface ProjectItem {
  title: string;
  description: string;
  imageVideoUrl: string;
  creationDate: string;
  creatorId: string;
  likedCount: number;
  projectId: string;
  creatorName?: string; 
}

export const UserProfile = () => {
  const { currentUser } = useAuth(); // Obtener el usuario desde el AuthContext
  const [loading, setLoading] = useState(false); 
  const [userData, setUserData] = useState<any>(null); 
  const [userProjects, setUserProjects] = useState<ProjectItem[]>([]); // Estado para almacenar los proyectos del usuario

  // Obtener los datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        const token = await currentUser.getIdToken();

        const response = await fetch("http://localhost:3000/userData", {
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

  // Obtener los proyectos del usuario autenticado
  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/projects");
        if (!response.ok) {
          throw new Error("Error fetching projects.");
        }

        const result: ProjectItem[] = await response.json();
        const userProjectData = result.filter(project => project.creatorId === currentUser.uid);

        setUserProjects(userProjectData); // Guardar los proyectos del usuario en el estado
      } catch (error) {
        console.error("Error fetching user projects:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserProjects();
    }
  }, [currentUser]);

  return (
    <div>
      <h2>User Profile</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {userData ? (
            <div>
              <h3>Username: {userData.username}</h3>
              {userData.profilePicture ? (
                <img
                  src={userData.profilePicture}
                  alt={`${userData.username}'s profile`}
                  style={{ width: "150px", height: "150px", borderRadius: "50%" }}
                />
              ) : (
                <p>No profile picture available.</p>
              )}
            </div>
          ) : (
            <p>No user data available.</p>
          )}

          {/* Mostrar los proyectos del usuario */}
          <div>
            <h3>Mis Proyectos</h3>
            {userProjects.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {userProjects.map((project) => (
                  <Card
                    key={project.projectId}
                    projectId={project.projectId}
                    title={project.title}
                    description={project.description}
                    image={project.imageVideoUrl}
                    author={project.creatorName || ''}
                    date={project.creationDate}
                  />
                ))}
              </div>
            ) : (
              <p>No projects available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
