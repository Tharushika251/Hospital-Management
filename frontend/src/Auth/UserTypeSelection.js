import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserTypeSelection = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  // Function to handle option selection
  const handleOptionSelect = (type) => {
    // Redirect to different pages based on user type
    navigate(`/${type}`); // Use navigate instead of history.push
  };

  const handleOptionSelect2 = (type) => {
    // Redirect to different pages based on user type
    navigate(`/${type}`); // Use navigate instead of history.push
  };

  const handleOptionSelect3 = (type) => {
    // Redirect to different pages based on user type
    navigate(`/${type}`); // Use navigate instead of history.push
  };

  const handleOptionSelect4 = (type) => {
    // Redirect to different pages based on user type
    navigate(`/${type}`); // Use navigate instead of history.push
  };

  

  return (
    <div style={styles.container}>
      <h1>Select User Type</h1>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => handleOptionSelect('admin')}>
          Admin
        </button>
        <button style={styles.button} onClick={() => handleOptionSelect2('patient')}>
          Patient
        </button>
        <button style={styles.button} onClick={() => handleOptionSelect3('doctor')}>
          Doctor
        </button>
        <button style={styles.button} onClick={() => handleOptionSelect4('pharmacist')}>
          Pharmacist
        </button>
      </div>
    </div>
  );
};

// Styles for the component
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  button: {
    padding: '15px 30px',
    fontSize: '18px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    transition: 'background-color 0.3s',
  },
};

export default UserTypeSelection;
