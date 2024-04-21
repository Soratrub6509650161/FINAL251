import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from '../css/login.module.css';

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/login`, {
        username,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("userType", response.data.userType);
        setIsLoggedIn(true);
        navigate("/");
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className={styles['background-image']}>
      <div className={`${styles.loginWrapper} loginWrapper`}>
        <h2>LOGIN</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.buttonlogin}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.buttonlogin}
            />
          </label>
          <br />
          <button className={styles.loginButton} onClick={handleLogin}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
  
}

export default Login;
