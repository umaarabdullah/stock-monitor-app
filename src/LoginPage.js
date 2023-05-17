import { useState } from "react";
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import Swal from 'sweetalert2';
import './LoginPage.css'
import { db } from "./firebase_db";

function LoginPage(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onHideLoginPage } = props;
  const { onCancelLoginPage } = props;

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
      console.log(`${user.email} logged in successfully`);
      onHideLoginPage(); // Hide the login page after successful login
      Swal.fire({   // Pop up Alert
        title: 'Login',
        icon: 'success',
        text: `Welcome Back ${user.email}`,
      });
    })
    .catch((error) => {
      // user doesnt exist
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      Swal.fire({   // Pop up Alert
        title: 'Login Error!',
        icon: 'error',
        text: 'No account exists with this email',
      });
    });

  }

  function handleSignup () {

    // First check if the email is already in use or not
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Login successful
      const user = userCredential.user;
      console.log(`${user.email} already exists`);
      // Pop up Alert
      Swal.fire({
        title: 'Email Already Exists!',
        icon: 'warning',
        text: 'You must login',
      });
      return;
    })
    .catch((error) => {
      // user doesnt exist
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });

    // check if password is greater than 8 characters
    if(password.length > 8){
      // Perform Signup
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
          
          console.log(`${user.email} Signed up successfully`);
          onHideLoginPage(); // Hide the login page after successful login
          Swal.fire({   // Pop up Alert
            title: 'Signed Up',
            icon: 'success',
            text: `Welcome ${user.email}`,
          });
      })
      .catch((error) => {
        console.error('Error signing up:', error);
      });
    }
   else{
    Swal.fire({   // Pop up Alert
      title: 'Password too short',
      icon: 'warning',
      text: 'Password must be greater than 8 characters',
    });
   }

  }

  return (
    <div className="login_page">
      <form>
        <label>Email:</label>
        <input type="email" value={email} onChange={handleEmailChange} />
        <label>Password:</label>
        <input type="password" value={password} onChange={handlePasswordChange} />
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleSignup}>Signup</button>
        <button onClick={onCancelLoginPage}>Cancel</button>
      </form>
    </div>
  );
}

export default LoginPage;


