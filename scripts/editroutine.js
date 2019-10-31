$(".time-sum-display").hide();

var database = firebase.database();
var rows = 0;
var schedule = [];
var currentCount = 0;
var uRoutinesArr = [];
var cycleTime;
var totalTime;
var cycles;

function calculateTotal() {
  cycles = parseInt($(".cycles").val());
  cycleTime = 0;
  $(".new-exercise").each(function(){
    cycleTime += parseInt($(this).attr("time"));
  });
  totalTime = cycleTime * cycles;
  console.log(cycles);
  $(".cycle-time").text("Cycle: " + timeConverter(cycleTime));
  $(".total-time").text("Total: " + timeConverter(totalTime));
};

$("#add-exercise").on("click", function () {
  event.preventDefault();
  rows++;
  var name = $("#name-input").val();
  console.log($("#name-input").val().trim());
  var newExercise = $("<div>");
  newExercise.html($("#exercise-template").html());
  newExercise.addClass("new-exercise row mt-1");
  newExercise.attr("time", "30");
  newExercise.attr("row", rows);
  newExercise.find(".name-label").text(name);
  $(".display-routine").append(newExercise);
  $(".time-sum-display").show();
  calculateTotal();
});

$("#add-rest").on("click", function () {
  console.log("Rest");
  rows++;
  console.log("Rest");
  var newBreak = $("<div>");
  newBreak.html($("#exercise-template").html());
  newBreak.addClass("new-exercise row mt-1");
  newBreak.attr("time", "30");
  newBreak.attr("row", rows);
  newBreak.find(".name-label").text("Rest");
  $(".display-routine").append(newBreak);
  $(".time-sum-display").show();
  calculateTotal();
});

$(document.body).on("change keyup", ".seconds", function() {
  var inputTime = $(this).val();
  $(this).closest(".new-exercise").attr("time", inputTime);
  calculateTotal();
  console.log("change");
});

$(document.body).on("click", "#remove-exercise", function () {
  var parentExercise = $(this).closest(".new-exercise");
  parentExercise.remove();
  calculateTotal();
  console.log("removed!");
});

$(document.body).on("click", "#add-time", function () {
  var thisRow = $(this).closest(".new-exercise");
  var timeAttr = parseInt(thisRow.attr("time"));
  var newTime = timeAttr + 10;
  thisRow.attr("time", newTime)
  var displayTime = thisRow.find(".seconds");
  displayTime.val(newTime);
  calculateTotal();
});

$(document.body).on("click", "#subtract-time", function () {
  var thisRow = $(this).closest(".new-exercise");
  var timeAttr = parseInt(thisRow.attr("time"));
  var newTime = timeAttr - 10;
  thisRow.attr("time", newTime)
  var displayTime = thisRow.find(".seconds");
  displayTime.val(newTime);
  calculateTotal();
});

$("#add-cycle").on("click", function () {
  cycles++
  $(".cycles").val(cycles);
  calculateTotal();
});

$("#remove-cycle").on("click", function () {
  cycles--
  $(".cycles").val(cycles);
  calculateTotal();
});

$("#save-days").on("click", function () {
  event.preventDefault();
  schedule.length = 0;
  $.each($("input[id='dropdownCheck']:checked"), function(){ 
    var selectedDay = $(this).val();      
    schedule.push(selectedDay);
  });
  $(this).parents(".dropdown").find("button.dropdown-toggle").dropdown("toggle")
  console.log(schedule);
});

$("#update-routine").on("click", function () {
  var routineArray = [];
  $(".new-exercise").each(function(){
    var exerciseObj = {
      name: $(this).find(".name-label").text(),
      number: $(this).attr("row"),
      length: $(this).find(".seconds").val(),
    };
    routineArray.push(exerciseObj);
  });
  $.each($("input[id='dropdownCheck']:checked"), function(){ 
    var selectedDay = $(this).val();      
    schedule.push(selectedDay);
  });
  console.log(routineArray);
  routinesRef = database.ref("routines");
  var routineId= $("#routine-editor").attr("data-routine");
  targetRoutine = routinesRef.child(routineId);
  targetRoutine.update({
    name: $("#routine-input").val().trim(),
    type: $("#type-input").val(),
    target: $("#target-input").val(),
    days: schedule,
    duration: totalTime,
    cycles: cycles,
    exercises: routineArray,
  });

  fetchRoutines();
  $(".saved-alert").slideToggle();
});

$("#discard").on("click", function () {
  resetRoutine();
});

$(".saved-alert").on("click", function () {
  $(".saved-alert").slideToggle();
});

function resetRoutine(){
  $("#routine-input").val("");
  $("#type-input option:first").attr("selected",true);
  $("#target-input option:first").attr("selected",true);
  $("input[id='dropdownCheck']").prop("checked", false);
  $(".cycles").val("1");
  $(".display-routine").empty();
  $(".time-sum-display").hide();
  $("#name-input").val("");
  cycles = 1;
  rows = 0;
}

$(".close").on("click", function (){
  $("#routine-editor").modal("hide");
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
  //   // Handle Errors here.
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  //   // ...
    
  //   alert(errorCode +"message :"+ errorMessage);
  // });

  location.href = "index.html"
});  