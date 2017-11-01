var gamePattern = [];
var userPattern = [];
var gameMode = "normal";
var acceptInput = "false";

var green = new Audio("../simon-game/audio/sound_01.mp3");
var red = new Audio("../simon-game/audio/sound_02.mp3");
var yellow = new Audio("../simon-game/audio/sound_03.mp3");
var blue = new Audio("../simon-game/audio/sound_04.mp3");
var wrong = new Audio("../simon-game/audio/sound_wrong.mp3");

var createPattern = function() {
  var randomNum = Math.floor(Math.random() * 4 + 1);
  gamePattern.push("circle-btn" + randomNum);
  startPattern();
};

var startPattern = function() {
  $("#txt-pattern-length").text(gamePattern.length);
  setTimeout(function() {
    showPattern(0);
  }, 700);
};

var showPattern = function(i) {
  var button = "#" + gamePattern[i];
  playAudio(button);
  $(button).addClass("show").delay(700).queue(function() {
    $(this).removeClass("show");
    $(this).dequeue();
  });
  if (i < gamePattern.length) {
    i++;
    setTimeout(function() {
      showPattern(i);
    }, 780);
  } else if ($("#btn-stop").is(":visible")) {
    acceptInput = "true";
    $(".circle-btn").css("cursor", "pointer");
  }
};

var playAudio = function(button) {
  if ($(button).attr("id") === "circle-btn1") {
    green.currentTime = 0;
    green.play();
  } else if ($(button).attr("id") === "circle-btn2") {
    red.currentTime = 0;
    red.play();
  } else if ($(button).attr("id") === "circle-btn3") {
    yellow.currentTime = 0;
    yellow.play();
  } else if ($(button).attr("id") === "circle-btn4") {
    blue.currentTime = 0;
    blue.play();
  }
};

var userInput = function(button) {
  userPattern.push(button);
  comparePatterns(userPattern.length - 1);
};

var comparePatterns = function(i) {
  if (userPattern[i] !== gamePattern[i] && gameMode === "strict") {
    wrong.play();
    $("#txt-pattern-length").text("X");
    resetGame();
    setTimeout(function() {
      createPattern(0);
    }, 1000);
  } else if (userPattern[i] !== gamePattern[i]) {
    wrong.play();
    $("#txt-pattern-length").text("X");
    acceptInput = "false";
    $(".circle-btn").css("cursor", "default");
    userPattern = [];
    setTimeout(function() {
      startPattern(0);
    }, 1000);
  } else if (userPattern.length === gamePattern.length) {
    if (userPattern.length === 20) {
      $("#btn-stop").css("display", "none");
      $("#btn-start").css("display", "inline-block");
      resetGame();
      $("#circle-inner-txt").css("display", "none");
      $("#txt-you-win").css("display", "inline-block");
    } else {
      acceptInput = "false";
      $(".circle-btn").css("cursor", "default");
      userPattern = [];
      createPattern();
    }
  }
};

var resetGame = function() {
  acceptInput = "false";
  $(".circle-btn").css("cursor", "default");
  gamePattern = [];
  userPattern = [];
};

$("#btn-normal").on("touch click", function() {
  $("#btn-normal").css("background-color", "#125568");
  $("#btn-normal").css("color", "#e8eaeb");
  $("#btn-strict").css("background-color", "#3c3c3c");
  $("#btn-strict").css("color", "#afaeae");
  gameMode = "normal";
});

$("#btn-strict").on("touch click", function() {
  $("#btn-strict").css("background-color", "#125568");
  $("#btn-strict").css("color", "#e8eaeb");
  $("#btn-normal").css("background-color", "#3c3c3c");
  $("#btn-normal").css("color", "#afaeae");  
  gameMode = "strict";
});

$("#btn-start").on("touch click", function() {
  $("#btn-start").css("display", "none");
  $("#btn-stop").css("display", "inline-block");
  if ($("#txt-you-win").is(":visible")) {
    $("#txt-you-win").css("display", "none");
    $("#circle-inner-txt").css("display", "inline-block");
  }
  createPattern();
});

$("#btn-stop").on("touch click", function() {
  $("#btn-stop").css("display", "none");
  $("#btn-start").css("display", "inline-block");
  resetGame();
  $("#txt-pattern-length").text(gamePattern.length);
});

$("#circle-btn1, #circle-btn2, #circle-btn3, #circle-btn4")
  .on("touchstart mousedown", function() {
  if (acceptInput === "true") {
    $(this).removeClass("fade-out");
    $(this).addClass("fade-in");
    playAudio(this);
    return false; //prevents ghost click caused by touchstart + mousedown
  }
}).on("touchend mouseup", function() {
  if (acceptInput === "true") {
    $(this).removeClass("fade-in");
    $(this).addClass("fade-out");
    userInput($(this).attr("id"));
    return false; //prevents ghost click caused by touchstart + mouseup
  }
}).on("mouseout", function() {
  if (acceptInput === "true") {
    $(this).removeClass("fade-in");
    $(this).addClass("fade-out");
  }
});