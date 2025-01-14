import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import { Card } from "../../common";
import './UserProfile.css';

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
  const { currentUser } = useAuth(); 
  const { userId } = useParams<{ userId: string }>(); 
  const [loading, setLoading] = useState(false); 
  const [userData, setUserData] = useState<any>(null); 
  const [userProjects, setUserProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        const response = await fetch(`http://localhost:3000/users/${userId}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUserData(data); 

          // Obtener foto de perfil desde la API de GitHub si existe el username
          if (data.username) {
            const githubResponse = await fetch(`https://api.github.com/users/${data.username}`);
            const githubData = await githubResponse.json();

            if (githubData.avatar_url) {
              setUserData((prevData: any) => ({
                ...prevData,
                profilePicture: githubData.avatar_url,
              }));
            }
          }
        } else {
          console.error("Error fetching user data:", data.error); 
        }
      } catch (error) {
        console.error("Error during fetch:", error); 
      } finally {
        setLoading(false); 
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/projects");
        if (!response.ok) {
          throw new Error("Error fetching projects.");
        }

        const result: ProjectItem[] = await response.json();
        const userProjectData = result.filter(project => project.creatorId === userId);

        setUserProjects(userProjectData);
      } catch (error) {
        console.error("Error fetching user projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProjects();
  }, [userId]);

  return (
    <div className='container'>
      <h2 className='title'>User Profile</h2>
      {loading ? (
        <p className='loading'>Loading...</p>
      ) : (
        <>
          {userData ? (
            <div className='userCard'>
              <div className='userInfo'>
                {userData.profilePicture ? (
                  <img
                    className='profilePicture'
                    src={userData.profilePicture}
                    alt={`${userData.username}'s profile`}
                  />
                ) : (
                  <div className='profilePicturePlaceholder'>
                    <span>No Image</span>
                  </div>
                )}
                <div>
                  <h3 className='username'>{userData.username}</h3>
                  <p className='userDescription'>{userData.description}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className='noData'>No user data available.</p>
          )}
  
          <div>
            <h3 className='projectsTitle'>Mis Proyectos</h3>
            {userProjects.length > 0 ? (
              <div className='projects'>
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
              <p className='noData'>No projects available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
