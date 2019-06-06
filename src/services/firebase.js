import firebase from 'firebase';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDRyW6d-XaJ_is_vgHP5gbRSXDZ6vt7RnY",
    authDomain: "spmedicalgroup-241d4.firebaseapp.com",
    databaseURL: "https://spmedicalgroup-241d4.firebaseio.com",
    projectId: "spmedicalgroup-241d4",
    storageBucket: "spmedicalgroup-241d4.appspot.com",
    messagingSenderId: "1003535864510",
    appId: "1:1003535864510:web:60462118cedb16a3"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;