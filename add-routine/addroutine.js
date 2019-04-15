
$("#add-exercise").on("click", function () {
  var name = $("#name-input").val();
  console.log($("#name-input").val().trim());
  var newExercise = $("<div>");
  newExercise.html($("#template").html());
  newExercise.addClass("new-exercise row");
  newExercise.attr("time", "30");
  newExercise.find(".label").text(name);
  $(".display-routine").append(newExercise);
});

$("#add-break").on("click", function () {
  var newBreak = $("<div>");
  newBreak.html($("#template").html());
  newBreak.addClass("row");
  newBreak.find(".label").text("Break");
  $(".display-routine").append(newBreak);
});

$("#more-time").on("click", function () {
  console.log("Clicked!")
  var timeAttr = parseInt($(".new-exercise").attr("time"));
  var newTime = timeAttr + 10;
  console.log(newTime);
  $(".new-exercise").attr("time", newTime)
  var displayTime = $(".new-exercise").find(".form-control");
  displayTime.val(newTime + " sec");
});



