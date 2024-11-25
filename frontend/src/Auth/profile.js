import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode'; // Ensure this import is correct
import { React, useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get the token from cookies
    const token = Cookies.get('token');
    console.log('Token from cookies:', token); // Log the token

    if (token) {
      try {
        // Decode the token and set user data
        const decoded = jwtDecode(token);
        console.log('Decoded Token:', decoded); // Log the decoded token
        setUser({ id: decoded.id, age: decoded.age });
      } catch (error) {
        console.error('Error decoding token', error);
      }
    } else {
      console.error('Token not found');
    }
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <p>User ID: {user.id}</p>
          <p>User Age: {user.age}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Profile;
