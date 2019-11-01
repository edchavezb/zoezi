var exerciseCount = 0;
var chosenTimers = [10];
var exerciseNames = ["Get set!"];
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
var routineCycles = 0;

var exerciseAnnounce = new Audio("sounds/next_exercise.mp3");
var restAnnounce = new Audio("sounds/rest.mp3");
var changeWhistle = new Audio("sounds/whistle_change.mp3");
var finalSound = new Audio("sounds/success.mp3");
var getReady = new Audio("sounds/get_ready.mp3");
var cycleChange = new Audio("sounds/cycle.mp3");

//This function is executed every second to keep track of the global timer and switch exercises when the current exercise timer gets to zero
function countUp(){
  if (currentExercise !== "Get set!"){
    globalTime++;
    $(".global").html(timeConverter(globalTime));
  }
  if (timerTime === 8 && currentTimer + 1 < chosenTimers.length && currentTimer !== 0){
    var nextExerciseName = exerciseNames[currentTimer + 1]
    if(nextExerciseName==="Rest"){
      restAnnounce.play();
    }
    else{
      exerciseAnnounce.play();
    }
  };
  if (timerTime === 1){
    currentTimer++;
    clearInterval(exerciseTimer);
    switchExercise();
    console.log("Switch");
    if(currentTimer + 1 !== chosenTimers.length + 1){
      changeWhistle.play();
    }
  };
  if (currentTimer >= chosenTimers.length && currentCycle === routineCycles){
    console.log("Finished")
    currentExercise = "Finished!"
    $(".exercise-name").text(currentExercise);
    $(".next-div").hide()
    $(".time-left").removeClass("pause");
    $(".pause-button").hide();
    $(".stop-routine").text("Re-start");
    $(".time-left").html("<i class=\"fas fa-trophy\"></i>");
    clearInterval(exerciseTimer);
    clearInterval(global);
    finalSound.play();

  } else if (currentTimer >= chosenTimers.length){
    currentCycle++
    $("#current-cycle").html(currentCycle);
    currentTimer = 0;
    clearInterval(exerciseTimer);
    switchExercise();
    cycleChange.play();
  }
};

//This function only takes care of counting down depending on the length of the current exercise
function countDown() {
  timerTime--;
  $(".time-left").html(timerTime);
};

function switchExercise(){
  var nextExerciseName = currentTimer + 1 < chosenTimers.length ? exerciseNames[currentTimer + 1] : "Finish";
  timerTime = chosenTimers[currentTimer];
  currentExercise = exerciseNames[currentTimer];
  currentGif = exerciseGifs[currentTimer];
  console.log(currentExercise);
  $(".time-left").html(timerTime);
  $(".exercise-name").text(currentExercise);
  $(".next-exercise-name").text(nextExerciseName)
  $(".global").html(timeConverter(globalTime));
  $(".z-image").attr("src", currentGif)
  if (currentTimer <= exerciseCount){
    $("#exercise-number").html(currentTimer);
  }
  if (running == true){
    exerciseTimer = setInterval(countDown, 1000);
  }
};

function getGifs(){
  for(var i = 0; i < exerciseNames.length; i++){
    queryURL = "https://api.giphy.com/v1/gifs/search?api_key=F9wmLY3JsMMhA2tALUQLQp8ED9AB4GcM&q="+ exerciseNames[i] +"&limit=15&offset=5&rating=G&lang=en"
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

function routineStart(){
  getReady.play();
  $(".pause-button").show();
  $(".pause-button").text("Pause");
  $(".next-div").show()
  running = true;
  $(".start-routine").text("Stop").addClass("stop-routine").removeClass("start-routine");
  $(".global").html(timeConverter(globalTime));
  global = setInterval(countUp, 1000);
  currentCycle = 1;
  $("#current-cycle").html(currentCycle);
  $(".time-left").addClass("pause");
  switchExercise();
  getGifs();
}

function routineReset() {
  clearInterval(exerciseTimer);
  clearInterval(global);
  running = false;
  currentTimer = 0;
  timerTime = chosenTimers[currentTimer];
  globalTime = 0;
  currentCycle = 0;
  $(".z-image").attr("src","images/deadlift.jpg")
  $("#current-cycle").html(currentCycle);
  $("#exercise-number").html(currentTimer);
  $(".time-left").html("00");
  $(".global").html(timeConverter(globalTime));
  $(".exercise-name").text("Ready!");
  $(".pause-button").hide();
  $(".next-div").hide()
  $(".stop-routine").text("Start").addClass("start-routine").removeClass("stop-routine");
};

function routineDataLoad() {
  exerciseNames = ["Get set!"];
  exerciseCount = routineData[routineSelect].exercises.length
  routineCycles = routineData[routineSelect].cycles
  for (var i = 1; i<=exerciseCount; i++){
    chosenTimers[i] = routineData[routineSelect].exercises[i-1].length;
    exerciseNames[i] = routineData[routineSelect].exercises[i-1].name;
  }
  $(".routine-title").text(routineData[routineSelect].name);
  $("#routine-cycles").html(routineCycles);
  $("#total-exercises").html(exerciseCount);
};

$(document.body).on("click", ".launch-routine", function() {
  routineSelect = $(this).closest(".routinecard").attr("data");
  console.log(routineSelect);
  $("#routine-player").modal("show");
  routineReset();
  routineDataLoad();
});

$(document.body).on("click", ".start-routine", function() {
  routineStart();
});

$(document.body).on("click", ".stop-routine", function() {
  routineReset();
});

$(document.body).on("click", ".pause", function() {
  if(running === true){
    $(".pause-button").text("Resume");
    clearInterval(exerciseTimer);
    clearInterval(global);
    running = false;
  }
  else{ 
    $(".pause-button").text("Pause");
    exerciseTimer = setInterval(countDown, 1000);
    global = setInterval(countUp, 1000);
    running = true;
  }
});

$(document.body).on("click", ".next-exercise", function() {
  currentTimer++;
  clearInterval(exerciseTimer);
  switchExercise();
  changeWhistle.play();
});

$(document.body).on("click", ".previous-exercise", function() {
  currentTimer--;
  clearInterval(exerciseTimer);
  switchExercise();
  changeWhistle.play();
});

$(".close").on("click", function (){
  clearInterval(exerciseTimer);
  clearInterval(global);
  $("#routine-player").modal("hide");
});

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

$(document.body).on("click", "#log-out", function() {
  console.log("log out")
  firebase.auth().signOut()
  location.href = "index.html"
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  } else {
    location.href = "index.html";
    console.log("User is signed out");
  }
});

