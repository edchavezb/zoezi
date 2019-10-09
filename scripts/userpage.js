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
  console.log(routineData);
}
  
function createCards(param){
  var routineArray = param ? param : myRoutines;
  console.log(routineArray)
  $(".fa-spinner").hide();
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
    newRoutine.find("#type").text("Type: " + routineData[routineArray[i]].type);
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