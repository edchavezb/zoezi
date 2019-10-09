var exerciseCount = 0;
var chosenTimers = [10];
var exerciseName = ["Get set!"];
var exerciseGifs = {};
var currentTimer = 0;
var currentCycle = 0;
var timerTime = 0;
var globalTime = 0;
var currentExercise;
var currentGif;
var exerciseTimer;
var global;
var running = false;
var routineType = "";
var routineCycles = 0;

var announce = new Audio("sounds/next_exercise.mp3");
var changeWhistle = new Audio("sounds/whistle_change.mp3");
var finalSound = new Audio("sounds/success.mp3");
var getReady = new Audio("sounds/get_ready.mp3");

function routineStart(){
  $(".global").html(timeConverter(globalTime));
  global = setInterval(countUp, 1000);
  currentCycle = 1;
  $(".cycle-info").show();
  $("#current-cycle").html(currentCycle);
  $("#routine-cycles").html(routineCycles);
  startExercise();
  getGifs();
}

//This function is executed every second to keep track of the global timer and switch exercises when the current exercise timer gets to zero
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
  if (currentTimer >= chosenTimers.length && currentCycle === routineCycles){
    console.log("Finished")
    currentExercise = "Victory";
    $(".finish").html("Finished!");
    $(".time-left").html("0");
    clearInterval(exerciseTimer);
    clearInterval(global);
    finalSound.play();

  } else if (currentTimer >= chosenTimers.length){
    currentCycle++
    $("#current-cycle").html(currentCycle);
    currentTimer = 0;
    clearInterval(exerciseTimer);
    startExercise();
    finalSound.play();
  }
};

//This function only takes care of counting down depending on the length of the current exercise
function countDown() {
  timerTime--;
  $(".time-left").html(timerTime);
};

function startExercise(){
  timerTime = chosenTimers[currentTimer];
  currentExercise = exerciseName[currentTimer];
  currentGif = exerciseGifs[currentTimer];
  console.log(currentExercise);
  $(".time-left").html(timerTime);
  $(".exercise-name").text(currentExercise);
  $(".z-image").attr("src", currentGif)
  exerciseTimer = setInterval(countDown, 1000);
};

$(document.body).on("click", ".launch-routine", function() {
  $(".pause-routine").hide();
  $(".cycle-info").hide();
  $(".start-routine").text("Start");
  $(".start-routine").attr("data-routine", $(this).closest(".routinecard").attr("data"));
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

  routineSelect = $(this).closest(".routinecard").attr("data");
  console.log(routineSelect);
  $(".routine-title").text(routineData[routineSelect].name);
  $(".exercise-name").text("Ready!");
  exerciseCount = routineData[routineSelect].exercises.length
  routineType = routineData[routineSelect].type
  routineCycles = routineData[routineSelect].cycles
  for (var i = 1; i<=exerciseCount; i++){
    chosenTimers[i] = routineData[routineSelect].exercises[i-1].length;
    exerciseName[i] = routineData[routineSelect].exercises[i-1].name;
  }
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

function getGifs(){
  for(var i = 0; i < exerciseName.length; i++){
    queryURL = "https://api.giphy.com/v1/gifs/search?api_key=F9wmLY3JsMMhA2tALUQLQp8ED9AB4GcM&q="+ exerciseName[i] +"&limit=15&offset=5&rating=G&lang=en"
    $.ajax({
      url: queryURL,
      method: "GET",
      gifIndex: i
    }).then(function(response) {
      var resultGif = response.data[Math.floor(Math.random()*10)].images.original.url
      exerciseGifs[this.gifIndex] = resultGif;
    });
  }
  console.log(exerciseGifs);
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
  } else {
    location.href = "index.html";
    console.log("User is signed out");
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
