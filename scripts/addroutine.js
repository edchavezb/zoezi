
var config = {
  apiKey: "AIzaSyC-ZLRM_MXbFLVFfHBN0XViz_46CHTmUMU",
  authDomain: "zoezi-74ea6.firebaseapp.com",
  databaseURL: "https://zoezi-74ea6.firebaseio.com",
  projectId: "zoezi-74ea6",
  storageBucket: "zoezi-74ea6.appspot.com",
  messagingSenderId: "413250730618"
};

firebase.initializeApp(config);

var user = firebase.auth().currentUser;
var email, uid, emailVerified;
var totalTime = 0;


if (user != null) {
  email = user.email;
  emailVerified = user.emailVerified;
  uid = user.uid;
}


$(".time-display").hide();

var database = firebase.database();
var rows = 0;
var cycles = 1;
var schedule = [];
var currentCount = 0;
var uRoutinesArr = [];
var cycleTime;
var totalTime;

function calculateTotal() {
  cycleTime = 0;
  $(".new-exercise").each(function(){
    cycleTime += parseInt($(this).attr("time"));
  });
  totalTime = cycleTime * cycles;
  $(".cycle-time").text("Cycle: " + timeConverter(cycleTime));
  $(".total-time").text("Total: " + timeConverter(totalTime));
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
  newExercise.find(".name-label").text(name);
  $(".display-routine").append(newExercise);
  $(".time-display").show();
  calculateTotal();
});

$("#add-rest").on("click", function () {
  rows++;
  console.log("Rest");
  var newBreak = $("<div>");
  newBreak.html($("#template").html());
  newBreak.addClass("new-exercise row mt-1");
  newBreak.attr("time", "30");
  newBreak.attr("row", rows);
  newBreak.find(".name-label").text("Rest");
  $(".display-routine").append(newBreak);
  $(".time-display").show();
  calculateTotal();
});

$(document).on("change keyup", ".seconds", function() {
  var inputTime = $(this).val();
  $(this).closest(".new-exercise").attr("time", inputTime);
  calculateTotal();
  console.log("change");
});

$(document).on("click", "#remove-exercise", function () {
  var parentExercise = $(this).closest(".new-exercise");
  parentExercise.remove();
  calculateTotal();
  console.log("removed!");
});

$(document).on("click", "#add-time", function () {
  var thisRow = $(this).closest(".new-exercise");
  var timeAttr = parseInt(thisRow.attr("time"));
  var newTime = timeAttr + 10;
  thisRow.attr("time", newTime)
  var displayTime = thisRow.find(".seconds");
  displayTime.val(newTime);
  calculateTotal();
});

$(document).on("click", "#subtract-time", function () {
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
      name: $(this).find(".name-label").text(),
      number: $(this).attr("row"),
      length: $(this).find(".seconds").val(),
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
    type: $("#type-input").val(),
    target: $("#target-input").val(),
    days: schedule,
    duration: totalTime,
    cycles: cycles,
    exercises: routineArray,
  });
  database.ref().update({routineCount: updatedCount});

  database.ref("/Users/"+firebase.auth().currentUser.uid).once('value').then(function(snapshot){
    console.log(snapshot.child("userRoutines").val());
    console.log(snapshot.val());

    if (snapshot.child("userRoutines").exists()) {
      uRoutinesArr = JSON.parse(snapshot.child("userRoutines").val());
    }
    else {
      database.ref("/Users/"+firebase.auth().currentUser.uid).child("userRoutines");
    }
    console.log(uRoutinesArr)
    uRoutinesArr.push(routineId)
    database.ref("/Users/"+firebase.auth().currentUser.uid).update({userRoutines : JSON.stringify(uRoutinesArr)});
  });
  resetRoutine();
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
  $(".time-display").hide();
  $("#name-input").val("");
  cycles = 1;
  rows = 0;
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





