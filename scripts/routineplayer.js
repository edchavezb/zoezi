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
var myRoutines = [];
var routineData = [];
var routineTypeArr =  [];
var disp = ".MyRoutines"; 

// queryURL = "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1"
// $.ajax({
//     url: queryURL,
//     method: "GET"
//     }).then(function(response) {
//       console.log(response)
//         $(".quote").html(response.content);
//         $(".quote-author").html("-"+response.title);
// });

$(".fa-spinner").show();
setTimeout(dataLoad, 1000)

setTimeout(function(){

  database.ref().on("value", function(snapshot) {
    console.log(snapshot.val().user_1)
    myRoutines = snapshot.val().user_1.split(',')
    console.log("segunda vuelta"+myRoutines)
  });
  
  setTimeout(fetchRoutines, 500);

  console.log("segunda vuelta routines"+routineData);

  // setTimeout( createCards, 7000);
  
  setTimeout(function(){
    for(var i = 0; i < myRoutines.length; i++){

      var newRoutine = $("<div>");
      newRoutine.html($(".template").html());
      newRoutine.addClass("card routinecard text-white mb-3");
      switch(routineData[myRoutines[i]].type){
        case "yoga":
          newRoutine.addClass("bg-info");
          break;
        case "strength":
          newRoutine.addClass("bg-danger");
          break;
        case "cardio":
          newRoutine.addClass("bg-warning");
          break;
        case "fun":
          newRoutine.addClass("bg-success");
          break;
        default:
          newRoutine.addClass("bg-secondary");
      };

      newRoutine.find(".launch-routine").attr("data", myRoutines[i]);
      newRoutine.find(".routinecard-title").text(routineData[myRoutines[i]].name);
      newRoutine.find("#type").text("Type: " + routineData[myRoutines[i]].type);
      newRoutine.find("#duration").text("Duration: " + timeConverter(parseInt(routineData[myRoutines[i]].duration)));
      $(".recommended").append(newRoutine);

    };
    $(".recommended").owlCarousel({
      loop:false,
      margin:10,
      responsive:{
        0:{
          items:1
        },
        600:{
          items:3
        },
        1000:{
          items:5
        }
      }
    });
  },2000)



},3000);

function dataLoad(){
  var user = firebase.auth().currentUser.uid;
  database.ref("Users/" + user + "/userInfo/dbname").on("value", function(snapshot){

    $(".user").text(JSON.parse(snapshot.val()));
    $(".user-name").text(JSON.parse(snapshot.val()));

  });
  database.ref("Users/" + user + "/userRoutines").on("value", function(snapshot) {
    myRoutines = JSON.parse(snapshot.val());
    fetchRoutines();
  });
  
  setTimeout(createCards, 1000);

};

function fetchRoutines(){
  for(var i = 0; i < myRoutines.length; i++){
    database.ref("routines/" + myRoutines[i]).once("value").then(function(snapshot){
      var routineReference = snapshot.key;
      var newObject = snapshot.val();
      routineData[routineReference] = newObject;
    });
  };
}
  
function createCards(){
  $(".fa-spinner").hide();
  for(var i = 0; i < myRoutines.length; i++){

    var newRoutine = $("<div>");
    newRoutine.html($(".template").html());
    newRoutine.addClass("card routinecard text-white");
    switch(routineData[myRoutines[i]].type){
      case "yoga":
        newRoutine.addClass("bg-dark");
      case "strength":
        newRoutine.addClass("bg-danger");
      case "cardio":
        newRoutine.addClass("bg-warning");
      case "fun":
        newRoutine.addClass("bg-success");
      default:
        newRoutine.addClass("bg-secondary");
    };

    newRoutine.find(".launch-routine").attr("data", myRoutines[i]);
    newRoutine.find(".routinecard-title").text(routineData[myRoutines[i]].name);
    newRoutine.find("#type").text("Type: " + routineData[myRoutines[i]].type);
    newRoutine.find("#duration").text("Duration: " + timeConverter(parseInt(routineData[myRoutines[i]].duration)));
    $(".my-routines").append(newRoutine);
  }
  $(".my-routines").owlCarousel({
    loop:false,
    margin:10,
    responsive:{
      0:{
        items:1
      },
      600:{
        items:3
      },
      1000:{
        items:5
      }
    }
  });
}

var exerciseCount = 0;
var chosenTimers = [10];
var exerciseName = ["Get set!"];
var currentTimer = 0;
var timerTime = 0;
var globalTime = 0;
var currentExercise;
var exerciseTimer;
var global;
var running = false;
var routineType ="";

var announce = new Audio("sounds/next_exercise.mp3");
var changeWhistle = new Audio("sounds/whistle_change.mp3");
var finalSound = new Audio("sounds/success.mp3");
var getReady = new Audio("sounds/get_ready.mp3");

function routineStart(){
  $(".global").html(timeConverter(globalTime));
  global = setInterval(countUp, 1000);
  startExercise();
}

function countUp(){
  globalTime++;
  $(".global").html(timeConverter(globalTime));
  if (timerTime === 6){
    announce.play();
  };
  if (timerTime === 1){
    currentTimer++;
    clearInterval(exerciseTimer);
    startExercise();
    console.log("Switch");
    changeWhistle.play();
  };
  if (currentTimer >= chosenTimers.length){
    console.log("Finished")
    currentExercise = "Victory";
    $(".finish").html("Finished!");
    $(".time-left").html("0");
    clearInterval(exerciseTimer);
    clearInterval(global);
    finalSound.play();
    getGif();
  }
};

function countDown() {
  timerTime--;
  $(".time-left").html(timerTime);
};

function startExercise(){
  timerTime = chosenTimers[currentTimer];
  currentExercise = exerciseName[currentTimer];
  console.log(currentExercise);
  $(".time-left").html(timerTime);
  $(".exercise-name").text(currentExercise);
  exerciseTimer = setInterval(countDown, 1000);
  getGif();
};

$(document.body).on("click", ".launch-routine", function() {
  $(".pause-routine").hide();
  $(".start-routine").text("Start");
  $(".start-routine").attr("data-routine", $(this).attr("data"));
  $("#routine-player").modal("show");
  exerciseName = ["Get set!"];
  running = false;
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
    $(".exercise-name").text("Ready!");
  });

});

$(document.body).on("click", ".start-routine", function() {
  getReady.play();
  $(".pause-routine").show();
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
    routineType = snapshot.child("goal").val();


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
  clearInterval(exerciseTimer);
  clearInterval(global);
  $("#routine-player").modal("hide");
});

$(document.body).on("click", ".pause-routine", function() {
  if(running == true){
    $(".pause-routine").text("Resume");
    clearInterval(exerciseTimer);
    clearInterval(global);
    running = false;
  }
  else{  
    $(".pause-routine").text("Pause");
    exerciseTimer = setInterval(countDown, 1000);
    global = setInterval(countUp, 1000);
    running = true;
  }
});

function getGif(){
  queryURL = "https://api.giphy.com/v1/gifs/search?api_key=F9wmLY3JsMMhA2tALUQLQp8ED9AB4GcM&q="+ currentExercise +"&limit=15&offset=5&rating=G&lang=en"
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    $(".z-image").attr("src",response.data[Math.floor(Math.random()*10)].images.original.url)
  });
}

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
    console.log("User is signed out");
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

var quotes = [
  {
    content: "With the new day comes new strength and new thoughts.",
    author: " Eleanor Roosevelt"
  },
  {
    content: "It does not matter how slowly you go as long as you do not stop.",
    author: " Confucius"
  },
  {
    content: "Change your life today. Don't gamble on the future, act now, without delay.",
    author: " Simone de Beauvoir"
  },
  {
    content: "The past cannot be changed. The future is yet in your power.",
    author: "Unknown"
  },
  {
    content: "Failure will never overtake me if my determination to succeed is strong enough.",
    author: " Og Mandino"
  },
  {
    content: "Only I can change my life. No one can do it for me.",
    author: " Carol Burnett"
  },
  {
    content: "I've missed more than 9000 shots in my career. I've lost almost 300 games. 26 times, I've been trusted to take the game winning shot and missed. I've failed over and over and over again in my life. And that is why I succeed.",
    author: " Michael Jordan"
  },
  {
    content: "Some people want it to happen, some wish it would happen, others make it happen.",
    author: " Michael Jordan"
  },
];
var rnd = Math.floor(Math.random()*8);
$(".quote").html("''"+quotes[rnd].content+"''");
$(".quote-author").html("-"+ quotes[rnd].author);
