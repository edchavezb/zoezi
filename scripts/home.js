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


$(document.body).on("click", "#sign-up", function() {

  console.log("botton sign in.")
  var email = $("#role-input").val();
  var password = $("#name-input").val();
  var name = $("#role-input").val();

  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;


  alert(errorCode +"message :"+ errorMessage);


  });
});
$(document.body).on("click", "#log-in", function() {

  var email = $("#role-input").val();
  var password = $("#name-input").val();
  var name = $("#role-input").val();

  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    
    alert(errorCode +"message :"+ errorMessage);
  });
  


});

$(document.body).on("click", "#log-out", function() {

  console.log("log out")
  firebase.auth().signOut()
  //   // Handle Errors here.
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  //   // ...
    
  //   alert(errorCode +"message :"+ errorMessage);
  // });

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

    database.ref("/Users/"+uid).set({
      dbEmail: email,
      dbname: displayName
    });

    console.log(email, uid);

    // location.href = "routines.html"
    // ...
  } else {
    // User is signed out.
    // ...
  }
});




$(document.body).on("click", "#routines", function() {

  location.href = "routines.html"

});

