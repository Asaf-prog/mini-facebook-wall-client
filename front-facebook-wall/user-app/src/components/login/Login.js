
import { useState } from 'react';
import axios from 'axios';
import './Login.css';

export default function Login({handleChangeLogin, handleRegisterComponent}) {

    const [userName, setUserName] = useState('');
    const [isLoginDisabled, setIsLoginDisabled] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
  
    const handleUserNameChange = (e) => {
        const enteredUserName = e.target.value;
        setUserName(enteredUserName);
        setIsLoginDisabled(enteredUserName.trim() === '');
    };

    const handleLogin = () => {
      const config = {};

      const endpoint = `http://localhost:5221/Face_Book_App/userLogin/${userName}`;
      
      axios.get(endpoint,config)
          .then(response => {
              const userExists = response.data.isExist;
      
              if (userExists) {
                  handleChangeLogin(userName, response.data.isAdmin);
              } else {
                  setShowAlert(true);
              }
          })
          .catch(error => {
              console.error('Error checking user:', error);
          });
  };
          const handleCloseAlert = () => {
            setShowAlert(false);
          };

          const handleRegister = () => {
            handleRegisterComponent();
          };
   
    return(
        <div>
            <h2>Login</h2>
            <form>
                <label>
                    User Name:
                    <input type="text" value={userName} onChange={handleUserNameChange} />
                </label>
                <br />
                <button type="button" onClick={handleLogin} disabled={isLoginDisabled}> Login </button>
                <button type="button" onClick={handleRegister}>Register</button>
                {showAlert && (
                <div className="custom-alert">
                <p>User does not exist. Please register.</p>
                <button onClick={handleCloseAlert}>Close</button>
        </div>
      )}
            </form>
        </div>
    );
}