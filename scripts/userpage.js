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

$(".fa-spinner").show();
setTimeout(dataLoad, 1000)

function dataLoad(){
  var user = firebase.auth().currentUser.uid;
  database.ref("Users/" + user + "/userInfo/dbname").on("value", function(snapshot){
		$(".user").text(JSON.parse(snapshot.val()));
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
  console.log(routineData);
}
  
function createCards(param){
  var routineArray = param ? param : myRoutines;
  console.log(routineArray)
  $(".fa-spinner").hide();
  $(".my-routines-title").html("My Routines");
  for(var i = 0; i < routineArray.length; i++){

    var newRoutine = $("<div>");
    newRoutine.attr("data", routineArray[i]);
    newRoutine.html($(".template").html());
    newRoutine.addClass("card routinecard text-white");
    switch(routineData[routineArray[i]].type){
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

    newRoutine.find(".routinecard-title").text(routineData[routineArray[i]].name);
    newRoutine.find("#type").text("Type: " + routineData[routineArray[i]].type.charAt(0).toUpperCase() + routineData[routineArray[i]].type.substring(1));
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
      450:{
        items:2
      },
      768:{
        items:3
      },
      992:{
        items:4
      },
      1200:{
        items:5
      }
    }
  });
}

function deleteRoutine(){
  var routineToDelete = $(this).closest(".routinecard").attr("data")
  var archivedRoutinesArray = []
  console.log(routineToDelete);
  console.log(myRoutines);
  newRoutineArray = myRoutines.filter(item => item !== routineToDelete);
  console.log(newRoutineArray)
  database.ref("/Users/"+firebase.auth().currentUser.uid).update({userRoutines : JSON.stringify(newRoutineArray)});
  database.ref("/Users/"+firebase.auth().currentUser.uid).once('value').then(function(snapshot){

    if (snapshot.child("archivedRoutines").exists()) {
      archivedRoutinesArray = JSON.parse(snapshot.child("archivedRoutines").val());
    }
    else {
      database.ref("/Users/"+firebase.auth().currentUser.uid).child("archivedRoutines");
    }
    console.log(archivedRoutinesArray)
    archivedRoutinesArray.push(routineToDelete)
    database.ref("/Users/"+ firebase.auth().currentUser.uid).update({archivedRoutines : JSON.stringify(archivedRoutinesArray)});
  });
  $('.owl-carousel').trigger('destroy.owl.carousel');
  $(".my-routines").empty();
  createCards(newRoutineArray)
}

$(document.body).on("click", ".delete-routine", deleteRoutine)

$(document.body).on("click", ".edit-routine", function() {
  $(".display-routine").empty();
  var routineToEdit = $(this).closest(".routinecard").attr("data");
  var routineToEditData = routineData[routineToEdit]
  var routineToEditExercises = routineToEditData.exercises
  $("#routine-input").val(routineToEditData.name);
  $("#type-input").val(routineToEditData.type);
  $("#target-input").val(routineToEditData.target);
  $(".cycles").val(routineToEditData.cycles);
  $("#routine-editor").attr("data-routine", routineToEdit);

  for(var i = 0; i < routineToEditData.days.length; i++){
    switch (routineToEditData.days[i]){
      case "Monday":
       $("input[value='Monday']").prop('checked', true);
       break;
      case "Tuesday":
       $("input[value='Tuesday']").prop('checked', true);
       break;
      case "Wednesday":
       $("input[value='Wednesday']").prop('checked', true);
       break;
      case "Thursday":
       $("input[value='Thursday']").prop('checked', true);
       break;
      case "Friday":
       $("input[value='Friday']").prop('checked', true);
       break;
      case "Saturday":
       $("input[value='Saturday']").prop('checked', true);
       break;
      case "Sunday":
       $("input[value='Sunday']").prop('checked', true);
    }
  }

  for(var i = 0; i < routineToEditExercises.length; i++){
    var rows = routineToEditExercises.length
    var exerciseName = routineToEditExercises[i].name
    var exerciseTime = routineToEditExercises[i].length
    var newExercise = $("<div>");
    newExercise.html($("#exercise-template").html());
    newExercise.addClass("new-exercise row mt-1");
    newExercise.attr("time", exerciseTime);
    newExercise.attr("row", i);
    newExercise.find(".name-label").text(exerciseName);
    newExercise.find(".seconds").val(exerciseTime);
    $(".display-routine").append(newExercise);
    $(".time-display").show();
  }
  
  console.log(routineToEdit);
  $("#routine-editor").modal("show");
  calculateTotal();
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
var random = Math.floor(Math.random()*quotes.length);
$(".quote").html("''"+quotes[random].content+"''");
$(".quote-author").html("-"+ quotes[random].author);