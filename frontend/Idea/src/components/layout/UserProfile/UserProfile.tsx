import { getAuth, User } from 'firebase/auth';
import { app } from '../../../../firebaseConfig'; 
import { useState, useEffect } from 'react';

export const UserProfile = () => {
  const [loading, setLoading] = useState(false); 
  const [userData, setUserData] = useState<any>(null); 
  const [currentUser, setCurrentUser] = useState<User | null>(null); 

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        console.error("No user is authenticated.");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return; // Si no hay usuario autenticado, no continuar

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
      fetchUserData(); // Llamada automática cuando el usuario está autenticado
    }
  }, [currentUser]); // Se ejecuta cuando `currentUser` cambia

  return (
    <div>
      <h2>User Profile</h2>
      {loading ? (
        <p>Loading...</p>
      ) : userData ? (
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
    </div>
  );
};

export default UserProfile;
