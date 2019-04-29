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

var exerciseCount = 0;
var chosenTimers = [5];
var exerciseName = ["get ready!"];
var currentTimer = 0;
var timerTime = 0;
var globalTime = 0;
var exerciseTimer;
var global;
var running = false;

function routineStart(){
  $(".global").html(timeConverter(globalTime));
  global = setInterval(countUp, 1000);
  startExercise();
}

function countUp(){
  globalTime++;
  $(".global").html(timeConverter(globalTime));
  if (timerTime === 1){
    currentTimer++;
    clearInterval(exerciseTimer);
    startExercise();
    console.log("Switch");
  };
  if (currentTimer >= chosenTimers.length){
    console.log("Finished")
    $(".finish").html("Finished!");
    $(".time-left").html("0");
    clearInterval(exerciseTimer);
    clearInterval(global);
  }
};

function countDown() {
  timerTime--;
  $(".time-left").html(timerTime);
};

function startExercise(){
  timerTime = chosenTimers[currentTimer];
  console.log(exerciseName[currentTimer]);
  $(".time-left").html(timerTime);
  $(".ExeName").text(exerciseName[currentTimer]);
  exerciseTimer = setInterval(countDown, 1000);

  queryURL = "https://api.giphy.com/v1/gifs/search?api_key=F9wmLY3JsMMhA2tALUQLQp8ED9AB4GcM&q="+ exerciseName[currentTimer] +"&limit=15&offset=5&rating=G&lang=en"
  $.ajax({
      url: queryURL,
      method: "GET"
      }).then(function(response) {
          $(".z-image").attr("src",response.data[Math.floor(Math.random()*10)].images.original.url)
  });
};

$(document.body).on("click", ".launch-routine", function() {
  $(".start-routine").text("Start");
  $(".start-routine").attr("data-routine", $(this).attr("data"));
  $("#routine-player").modal("show");
  running = true;
  currentTimer = 0;
  timerTime = chosenTimers[currentTimer];
  globalTime = 0;
  clearInterval(exerciseTimer);
  clearInterval(global);
  $(".time-left").html("00");
  $(".global").html("00:00");
  $(".z-image").attr("src","images/deadlift.jpg")

  routineSelect = $(this).attr("data");
  database.ref("/routines").once('value').then(function(snapshot){
    $(".routine-title").text(snapshot.child("/"+routineSelect+"/name").val());

    $(".ExeName").text("Get Set!");
  });

});

$(document.body).on("click", ".start-routine", function() {
  $(".start-routine").text("Re-Start");
  $(".finish").text("");
  running = true;
  currentTimer = 0;
  timerTime = chosenTimers[currentTimer];
  globalTime = 0;
  clearInterval(exerciseTimer);
  clearInterval(global);
  routineSelect = $(this).attr("data-routine");

  database.ref("/routines/"+ routineSelect).once('value').then(function(snapshot){
    exerciseCount = snapshot.child("exercises").numChildren();

    for (var i = 1; i<=exerciseCount; i++){
      chosenTimers[i] = (JSON.parse(snapshot.child("exercises/"+ (i-1) +"/length").val()));
      exerciseName[i] = snapshot.child("exercises/"+ (i-1) +"/name").val();
    }
  });
  routineStart();
});

$(".close").on("click", function (){
  currentTimer = 0;
  timerTime = chosenTimers[currentTimer]
  globalTime = 0;
  running = true;
  clearInterval(exerciseTimer);
  clearInterval(global);
  $("#routine-player").modal("hide");
});

$(document.body).on("click", ".pause-routine", function() {
  if(running == true){
    clearInterval(exerciseTimer);
    clearInterval(global);
    running = false;
  }
  else{  
    exerciseTimer = setInterval(countDown, 1000);
    global = setInterval(countUp, 1000);
    running = false;
  }


})

function timeConverter(t) {

  var minutes = Math.floor(t / 60);
  var seconds = t - (minutes * 60);

  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (minutes === 0) {
    minutes = "00";
  }
  else if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return minutes + ":" + seconds;
};

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {


    // ...
  } else {
    
    location.href = "index.html";
    consol.log("User is signed out");
    // ...
  }
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
