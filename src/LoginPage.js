import { useState } from "react";
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import './LoginPage.css'

function LoginPage(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onHideLoginPage } = props;

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleLogin(e) {
    e.preventDefault();
    
    // Perform login with Firebase authentication
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Login successful
      const user = userCredential.user;
      onHideLoginPage(); // Hide the login page after successful login
    })
    .catch((error) => {
      // Handle login error
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  }

  return (
    <div className="login_page">
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input type="email" value={email} onChange={handleEmailChange} />
        <label>Password:</label>
        <input type="password" value={password} onChange={handlePasswordChange} />
        <button type="submit">Login</button>
        <button onClick={onHideLoginPage}>Cancel</button>
      </form>
    </div>
  );
}

export default LoginPage;


