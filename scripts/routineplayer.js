var chosenTimers = [5, 5, 5, 5]
var currentTimer = 0;
var timerTime = chosenTimers[currentTimer]
var globalTime = 0;
var exerciseTimer;

function routineStart(){
  $(".global").html(globalTime);
  global = setInterval(countUp, 1000);
  startExercise();
}

function countUp(){
  globalTime++;
  $(".global").html(globalTime);
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
  timerTime = chosenTimers[currentTimer]
  $(".time-left").html(timerTime);
  exerciseTimer = setInterval(countDown, 1000);
}

$(".launch-routine").on("click", function (){
  $("#routine-player").modal("show");
});

$(".start-routine").on("click", function (){
  routineStart();
});

$(".close").on("click", function (){
  $("#routine-player").modal("hide");
});
