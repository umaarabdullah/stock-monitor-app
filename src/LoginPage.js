import { useState } from "react";
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import './LoginPage.css'
import { db } from "./firebase_db";

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
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });

    console.log('User doesnt exist so creating user in firebase')
    // User doesn't exist so we create a user
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const { user } = userCredential;
      const userData = {
        displayName: user.displayName,
        email: user.email,
        uid: user.uid
      };
      db.collection('users').doc(user.uid).set(userData)
        .then(() => {
          console.log('User document created successfully.');
        })
        .catch((error) => {
          console.error('Error creating user document:', error);
        });
        onHideLoginPage(); // Hide the login page after successful login
    })
    .catch((error) => {
      console.error('Error signing up:', error);
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


