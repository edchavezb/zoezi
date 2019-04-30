var config = {
  apiKey: "AIzaSyC-ZLRM_MXbFLVFfHBN0XViz_46CHTmUMU",
  authDomain: "zoezi-74ea6.firebaseapp.com",
  databaseURL: "https://zoezi-74ea6.firebaseio.com",
  projectId: "zoezi-74ea6",
  storageBucket: "zoezi-74ea6.appspot.com",
  messagingSenderId: "413250730618"
};

firebase.initializeApp(config);
var database = firebase.database();
var routines = "[]";

$(document.body).on("click", "#sign-up", function(e) {
  
  e.preventDefault()
  console.log("botton sign in.")
  var email = $("#email-input").val();
  var password = $("#password-input").val();

  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error){
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  $(".alert-message").text(errorMessage);
  });


});
$(document.body).on("click", "#log-in", function(e) {
  
  e.preventDefault()
  console.log("log in click")
  var email = $("#email-input").val();
  var password = $("#password-input").val();

  console.log(email, password)

  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    
  $(".alert-message").text(errorMessage);
  });
  


});

$(document.body).on("click", "#log-out", function(e) {
  e.preventDefault()
  console.log("log out")
  firebase.auth().signOut()

  location.href = "index.html"
});



firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    email = user.email;
    // var emailVerified = user.emailVerified;
    // var photoURL = user.photoURL;
    // var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    // var providerData = user.providerData;



    console.log(email, uid);

    database.ref("/Users/"+uid).child("userInfo").set({
    dbEmail: email,
    dbname: displayName,
    });

    location.href = "routines.html"
    // ...
  } else {
    // User is signed out.
    // ...
  }
});



