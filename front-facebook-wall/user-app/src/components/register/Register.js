import React, { useState } from 'react';
import axios from 'axios';

export default function Register({handleChangeLogin}) {
  const [userName, setUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleCheckboxChange = () => {
    setIsAdmin(!isAdmin); 
  };

  const handleRegister = () => {
    const registrationData = {
      userName: userName,
      IsAdmin: isAdmin,
    };

    axios.post('http://localhost:5221/Face_Book_App/Create-New-User', registrationData)
      .then(response => {
        setRegistrationStatus('Registration successful!');
        handleChangeLogin(registrationData.userName,isAdmin); 

      })
      .catch(error => {
        console.error('Error registering user:', error);
        setRegistrationStatus('Registration failed. Please try again.');
      });
  };

  return (
    <div>
      <h2>Register</h2>
      <label>
        User Name:
        <input type="text" value={userName} onChange={handleUserNameChange} />
      </label>
      <br />
      <label>
        Admin:
        <input type="checkbox" checked={isAdmin} onChange={handleCheckboxChange} />
      </label>
      <br />
      <button type="button" onClick={handleRegister}>
        Register
      </button>
      {registrationStatus && <p>{registrationStatus}</p>}
    </div>
  );
}
