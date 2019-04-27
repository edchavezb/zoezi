
var config = {
  apiKey: "AIzaSyC-ZLRM_MXbFLVFfHBN0XViz_46CHTmUMU",
  authDomain: "zoezi-74ea6.firebaseapp.com",
  databaseURL: "https://zoezi-74ea6.firebaseio.com",
  projectId: "zoezi-74ea6",
  storageBucket: "zoezi-74ea6.appspot.com",
  messagingSenderId: "413250730618"
};

firebase.initializeApp(config);
$(".time-display").hide();

var database = firebase.database();
var rows = 0;
var cycles = 1;
var currentCount = 0;

function calculateTotal() {
  var cycleTime = 0;
  $(".new-exercise").each(function(){
    cycleTime += parseInt($(this).attr("time"));
  });
  var totalTime = cycleTime * cycles;
  $(".cycle-time").text("Cycle duration: " + cycleTime);
  $(".total-time").text("Total duration: " + totalTime);
};

$("#add-exercise").on("click", function () {
  event.preventDefault();
  rows++;
  var name = $("#name-input").val();
  console.log($("#name-input").val().trim());
  var newExercise = $("<div>");
  newExercise.html($("#template").html());
  newExercise.addClass("new-exercise row mt-1");
  newExercise.attr("time", "30");
  newExercise.attr("row", rows);
  newExercise.find(".label").text(name);
  $(".display-routine").append(newExercise);
  $(".time-display").show();
  calculateTotal();
});

$("#add-break").on("click", function () {
  rows++;
  console.log("Break");
  var newBreak = $("<div>");
  newBreak.html($("#template").html());
  newBreak.addClass("new-exercise row mt-1");
  newBreak.attr("time", "30");
  newBreak.attr("row", rows);
  newBreak.find(".label").text("Break");
  $(".display-routine").append(newBreak);
  $(".time-display").show();
  calculateTotal();
});

$(document).on("click", "#add-time", function () {
  var thisRow = $(this).closest(".new-exercise");
  var timeAttr = parseInt(thisRow.attr("time"));
  var newTime = timeAttr + 10;
  thisRow.attr("time", newTime)
  var displayTime = thisRow.find(".seconds");
  displayTime.val(newTime + " sec");
  calculateTotal();
});

$(document).on("click", "#subtract-time", function () {
  var thisRow = $(this).closest(".n ew-exercise");
  var timeAttr = parseInt(thisRow.attr("time"));
  var newTime = timeAttr - 10;
  thisRow.attr("time", newTime)
  var displayTime = thisRow.find(".seconds");
  displayTime.val(newTime + " sec");
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

database.ref().on("value", function(snapshot) {
  if (snapshot.child("routineCount").exists()) {
    currentCount = parseInt(snapshot.val().routineCount);
  }
  else {
    database.ref().set({routineCount: currentCount});
  }
});

$("#save-routine").on("click", function () {
  var routineArray = [];
  $(".new-exercise").each(function(){
    var exerciseObj = {
      name: $(this).find(".label").text(),
      number: $(this).attr("row"),
      length: $(this).attr("time"),
    };
    routineArray.push(exerciseObj);
  });
  console.log(routineArray);
  var updatedCount = currentCount + 1;
  console.log(updatedCount + " routines stored in database");
  routinesRef = database.ref("routines");
  var routineId= "Z-" + updatedCount;
  newRoutine = routinesRef.child(routineId);
  newRoutine.set({
    name: $("#routine-input").val().trim(),
    goal: $("#goal-input").val().trim(),
    target: $("#target-input").val().trim(),
    cycles: cycles,
    exercises: routineArray,
  });
  database.ref().update({routineCount: updatedCount});
});

$("#discard").on("click", function () {

});






