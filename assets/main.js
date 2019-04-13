var chosenTimers = [10, 20, 10, 20]

function countDown() {
  timeLeft--;
  $(".time-left").html(timeLeft);
  if (timeLeft === 0) {
    stop();
    alert("Time's Up!");
    $(".answer").off("click");
  }
}

function stop() {
  clearInterval(myTime);
  timeRunning = false;
}

var currentTimer = 0; //index array
var timerTime = chosenTimers[currentTimer]
var exerciseTime = 0;

function exerciseStart(){
  myTime = setInterval(countDown, 1000);
  exerciseTime++
  timeRunning = true;
}

currentTimer++

exerciseStart();