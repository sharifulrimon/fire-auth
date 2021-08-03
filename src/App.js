
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';
firebase.initializeApp(firebaseConfig)

function App() {
  const [user, setUser]=useState({
    isSignedIn: false,
    name:'',
    email:'',
    password:'',
    error:'',
    photo:''
  });
  const[newUser,setNewUSer]= useState(false);
  const provider = new firebase.auth.GoogleAuthProvider();
  var fbprovider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn= ()=>{
    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
      
     const {displayName,photoURL,email}=result.user;
     const signedInUser={
       isSignedIn: true,
       newUser: false,
       name: displayName,
       email: email,
       error: '',
       success: false,
       photo: photoURL
     }


     setUser(signedInUser)
     
    })
    .catch(err=>{
      console.log(err);
      console.log(err.message);
    })
  }
  const fbHandler=()=>{
    firebase
  .auth()
  .signInWithPopup(fbprovider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    
    // The signed-in user info.
    var user = result.user;
    console.log('Fb user after sign in',user);

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.


    // ...
  })
  .catch((error) => {
;

    // ...
  });
  }
  const handleSignOut= ()=>{
    firebase.auth().signOut()
    .then((result) => {
      

     const signedOutUser={
       isSignedIn: false,
      
       name: '',
       email: '',
       error: '',
       success: false,
  
     }


     setUser(signedOutUser)
     
    })
    .catch(err=>{
      console.log(err);
      console.log(err.message);
    })
  }
  const handleChange=(event)=>{
     let  isEmailValid= true;
   if(event.target.name === 'email'){
     isEmailValid= /^\S+@\S+\.\S+$/.test(event.target.value);
     console.log(isEmailValid);
   }
   if(event.target.name === 'password'){
     isEmailValid= event.target.value.length>6;
 

  }
  if(isEmailValid){
    const newUserInfo={...user};
    newUserInfo[event.target.name]= event.target.value;
    setUser(newUserInfo)
  }
  }
  const handleSubmit=(e)=>{
if(newUser && user.email && user.password){
  console.log('clicked');
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then((res) => {
const newUserInfo={...user};
newUserInfo.error='';
newUserInfo.success=true;
setUser(newUserInfo);


  })
  .catch((error) => {
  const newUserInfo= {...user};
  newUserInfo.error= error.message;
  newUserInfo.success=false;
   
    setUser(newUserInfo);
    // ..
  });

}

if(!newUser && user.email && user.password){
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((res) => {
    const newUserInfo={...user};
    newUserInfo.error='';
    newUserInfo.success=true;
    setUser(newUserInfo);
    
  })
  .catch((error) => {
    const newUserInfo= {...user};
  newUserInfo.error= error.message;
  newUserInfo.success=false;
   
    setUser(newUserInfo);
  });
}
  e.preventDefault(); 
  }
  

  return (
    <div className="App">{
      user.isSignedIn?<button onClick={handleSignOut}>Sign out</button> :
      <button onClick={handleSignIn}>Sign in</button>
      
    }
    <button onClick={fbHandler}>Sign in with facebook</button>
      {user.isSignedIn && <div><p>Welcome, {user.name}</p>
      <p>Your Email: {user.email}</p>
      <img src={user.photo} alt=""></img>
      </div>}
      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={()=> setNewUSer(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser">New User SignUp</label>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p>
    <form onSubmit={handleSubmit}>

    <input type="text" name="email" onBlur={handleChange} required/><br/>
    <input type="password" name="password" onBlur={handleChange} id="" required /><br/>
    <input type="submit" value="Submit" />
    </form>
    <p style={{color:'red'}}>{user.error}</p>
  {user.success &&   <p style={{color:'green'}}>User {newUser? 'Created': 'Loggedin'} Successfully</p>}
    </div>
  );
}

export default App;
