import './UserProfile.css';
import { getAuth } from "firebase/auth"; 
import { useState, useEffect } from "react";
import { app } from "../../../../firebaseConfig"; 

export const UserProfile = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;

        if (!currentUser) {
          throw new Error("No user is authenticated.");
        }

        // Obtener el UID directamente del objeto currentUser
        const uid = currentUser.uid;
        setUserId(uid);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  if (loading) {
    return <p>Loading user profile...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!userId) {
    return <p>No user is logged in</p>;
  }

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <p>User ID: {userId}</p>
    </div>
  );
};
