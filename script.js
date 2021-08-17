function createFields() {
  $("#grid #timer").remove();
  $("#grid")
    .removeClass("currentgrid")
    .addClass("currentgrid")
    .append('<div id="timer"></div>');
  $("#timer").html(
    '<div id="top"></div><div id="right"></div><div id="bottom"></div><div id="left"></div>'
  );
  $("#grid .result").removeClass("two one white").css("display", "none");
  $(".container")
    .addClass("playable current")
    .html(
      '<div class="field"><div class="result"><div class="info"></div></div><div class="square"></div><div class="square"></div><div class="square"></div><div class="square"></div><div class="square"></div><div class="square"></div><div class="square"></div><div class="square"></div><div class="square"></div></div>'
    )
    .css({
      outline: "none"
    });
  $(".square").html("<div></div>");
  fieldSetup($(".container"));
}
//createFields();

var num = 0;
var turnTime = 15;
var paused = false;
var playerArray;
var randomNumber;
var currentPlayer;
var currentPlayerColor;
var otherPlayer;
var otherPlayerColor;
var timerStart;
var colorOne = "DodgerBlue";
var colorTwo = "Tomato";
var winArr = [
  "1,2,3",
  "4,5,6",
  "7,8,9",
  "1,4,7",
  "2,5,8",
  "3,6,9",
  "1,5,9",
  "3,5,7"
];
var winFieldIndex = null;
var winSquareIndex = null;

function fieldSetup(thisContainer) {
  num++;
  //console.log(num);
  playerArray = ["two", "one"];
  randomNumber = Math.floor(Math.random() * playerArray.length);
  currentPlayer = playerArray[randomNumber];
  //nextPlayer();

  setSize();
  thisContainer.find(".result").css({
    display: "none"
  });
  thisContainer.find(".square").css({
    backgroundColor: "#f2f2f2"
  });
  thisContainer.find(".square").addClass("clickable rippled");
  thisContainer.find(".square").removeClass("two");
  thisContainer.find(".square").removeClass("one");
  nextPlayer();
}
//fieldSetup($('.container'));

function nextPlayer() {
  if (currentPlayer == "two") {
    currentPlayer = "one";
    currentPlayerColor = colorOne;
    otherPlayer = "two";
    otherPlayerColor = colorTwo;
  } else {
    currentPlayer = "two";
    currentPlayerColor = colorTwo;
    otherPlayer = "one";
    otherPlayerColor = colorOne;

    TweenMax.killDelayedCallsTo(botActionRandom);
    TweenMax.delayedCall(1, botActionRandom);
  }
  if ($("#grid").hasClass("currentgrid")) {
    $("#grid.currentgrid").css("outline", "1px solid " + currentPlayerColor);
  } else {
    $(".container.current").css("outline", "1px solid " + currentPlayerColor);
  }
  timer();
}

function botActionRandom() {
  console.log("botActionRandom");
  if ($("#grid > .result").hasClass(playerArray[0]) || $("#grid > .result").hasClass(playerArray[1])) {
    return;
  }

  simWin();
  console.log('>>', winFieldIndex, winSquareIndex);
  if (winFieldIndex !== null && winSquareIndex !== null) {
    $("#grid .container")
      .eq(winFieldIndex - 1)
      .find(".square")
      .eq(winSquareIndex)
      .click();
    winFieldIndex = null;
    winSquareIndex = null;
    return;
  }

  console.log('Random move');
  var currentFieldsArr = [];
  $("#grid .container.playable.current").each(function () {
    currentFieldsArr.push($(this).index());
  });
  //console.log("currentFieldsArr", currentFieldsArr);
  var randomFieldIndex =
    currentFieldsArr[Math.floor(Math.random() * currentFieldsArr.length)] - 1;
  //console.log("randomFieldIndex", randomFieldIndex);

  var currentSquaresArr = [];
  $("#grid .container")
    .eq(randomFieldIndex)
    .find(".square.clickable")
    .each(function () {
      currentSquaresArr.push($(this).index());
    });
  //console.log("currentSquaresArr", currentSquaresArr);
  var randomSquareIndex =
    currentSquaresArr[Math.floor(Math.random() * currentSquaresArr.length)] - 1;
  //console.log("randomSquareIndex", randomSquareIndex);

  $("#grid .container")
    .eq(randomFieldIndex)
    .find(".square")
    .eq(randomSquareIndex)
    .click();
  //var field = $("#grid .container.current").eq();
  //var randomDotIndex = Math.floor(Math.random() * trgt.length);
  //console.log('randomDotIndex', randomDotIndex);
  /* $(".dot")
    .eq($(trgt[randomDotIndex]).index())
    .click(); */
}

function timer() {
  /*var counter = { var: 0 };
    TweenMax.to(counter, 5, {
        var: 100, 
        onUpdate: function () {
            console.log(Math.ceil(counter.var));
        },
        ease:Linear.easeNone
    });*/
  timerStart = Math.floor(Date.now() / 1000);
  totalTime = turnTime;
  if (turnTime == 4) {
    $("#timer").hide();
  } else {
    $("#timer").show();
    if (!$("#grid").hasClass("currentgrid")) {
      $(".container.current").append($("#timer"));
    } else {
      $("#grid").append($("#timer"));
    }
    if (currentPlayer == "two") {
      lineColor = "one";
    } else {
      lineColor = "two";
    }
    //$('#timer div').css({background:lineColor});
    TweenMax.killTweensOf(
      "#timer #top, #timer #right, #timer #bottom, #timer #left"
    );
    TweenMax.to($("#timer #top"), totalTime / 4, {
      width: "100%",
      startAt: {
        width: "0px"
      },
      immediateRender: true,
      ease: Linear.easeNone
    });
    TweenMax.to($("#timer #right"), totalTime / 4, {
      height: "100%",
      startAt: {
        height: "0px"
      },
      immediateRender: true,
      ease: Linear.easeNone,
      delay: totalTime / 4
    });
    TweenMax.to($("#timer #bottom"), totalTime / 4, {
      width: "100%",
      startAt: {
        width: "0px"
      },
      immediateRender: true,
      ease: Linear.easeNone,
      delay: (totalTime / 4) * 2
    });
    TweenMax.to($("#timer #left"), totalTime / 4, {
      height: "100%",
      startAt: {
        height: "0px"
      },
      immediateRender: true,
      ease: Linear.easeNone,
      delay: (totalTime / 4) * 3,
      onComplete: timeup
    });
  }
}

function timeup() {
  var currtime = Math.floor(Date.now() / 1000);
  if (currtime - timerStart >= turnTime) {
    $("#main").prepend(
      '<div id="timeup"><div class="content"><h1>Too late</h1><h3>Next up is player <font color="' +
      otherPlayerColor +
      '">' +
      otherPlayer +
      '</font></h3><div id="nextplayer">Continue</div></div></div>'
    );
    /*$('#timeup').css({
        background: currentPlayer
    });*/
    //nextPlayer();
  }
}
$("#main").on("click", "#nextplayer", function () {
  nextPlayer();
  $("#timeup").remove();
});

function simWin() {
  console.log("simWin");
  $(".container.playable.current").each(function () {
    var $field = $(this);
    var fieldIndex = $field.index();
    if (winFieldIndex !== null && winSquareIndex !== null) {
      return;
    }
    console.log('fieldIndex', fieldIndex);
    var fieldCurrPlayerSeq = [];
    var fieldOtherPlayerSeq = [];

    if ($field.find(".square." + currentPlayer).length < 2) {
      console.log('less than 2');
      winFieldIndex = null;
      winSquareIndex = null;
      return;
    }
    console.log('2 or more');

    $field.find(".square." + currentPlayer).each(function () {
      fieldCurrPlayerSeq.push($(this).index());
    });
    console.log('fieldCurrPlayerSeq', fieldCurrPlayerSeq);

    $field.find(".square." + otherPlayer).each(function () {
      fieldOtherPlayerSeq.push($(this).index());
    });
    console.log('fieldOtherPlayerSeq', fieldOtherPlayerSeq);

    //console.log('fieldIndex', fieldIndex);

    let winableArr = winArr.slice();
    console.log('first winableArr', winableArr);
    fieldOtherPlayerSeq.forEach((element) => {
      winableArr = winableArr.filter((item) => !item.includes(element));
    });
    console.log("winableArr filtered by opponent", winableArr);

    for (var i = 0; i < winableArr.length; i++) {
      winableSeq = winableArr[i].split(",").join("");
      //console.log('winableSeq', winableSeq);

      var currPlayerAmount = 0;
      var lastPlayable;
      for (var j = 0; j < winableSeq.length; j++) {
        console.log('>>>', winableSeq[j] - 1);
        //console.log(winableSeq[j], $field.find('.square').eq(winableSeq[j]-1).hasClass(currentPlayer));
        if (
          $field
            .find(".square")
            .eq(winableSeq[j] - 1)
            .hasClass(currentPlayer)
        ) {
          currPlayerAmount++;
        } else {
          lastPlayable = winableSeq[j] - 1;
        }
      }
      //console.log('currPlayerAmount', currPlayerAmount);
      if (currPlayerAmount < 2) {
        winableArr.splice(i, 1);
        i--;
      }
      //winableArr = winableArr.filter(item => currPlayerAmount >= 2);
      console.log("winableArr", winableArr);
      console.log("lastPlayable", lastPlayable);

      console.log(currPlayerAmount, currPlayerAmount >= 2, fieldIndex !== null, lastPlayable !== null);
      if (currPlayerAmount >= 2 && fieldIndex !== null && lastPlayable !== null) {
        winFieldIndex = fieldIndex;
        winSquareIndex = lastPlayable;
        console.log('found win move');
        return;
      } else {
        winFieldIndex = null;
        winSquareIndex = null;
        console.log('no win move');
      }
    }
  });
}

function checkGrid() {
  for (var i = 0; i < winArr.length; i++) {
    //console.log('>> '+winArr[i]);
    winSeq = winArr[i].split(",");
    //console.log(winSeq[0]);
    var arr = new Array();
    for (var j = 0; j < winSeq.length; j++) {
      trgt = $(".container").eq(winSeq[j] - 1);
      arr.push(trgt.find(".result").attr("class").split(" ")[1]);
    }
    //console.log(arr[0]+','+arr[1]+','+arr[2]);
    if (arr[0] != undefined && arr[0] == arr[1] && arr[0] == arr[2]) {
      console.log("result: " + arr[0]);
      if (arr[0] == "two") {
        currentColor = colorTwo;
      } else if (arr[0] == "one") {
        currentColor = colorOne;
      }
      $("#grid > .result").addClass(arr[0]).css({
        display: "inherit",
        backgroundColor: currentColor
      });
    } else if (
      arr[0] != undefined &&
      arr[1] != undefined &&
      arr[2] != undefined
    ) {
      trgt.removeClass("playable");
    }
  }
  if ($(".container").hasClass("playable")) {
  } else {
    if ($("#grid > .result").hasClass(playerArray[0]) || $("#grid > .result").hasClass(playerArray[1])) {
      $("#grid > .result").addClass(currentPlayer).css({
        display: "inherit",
        backgroundColor: currentPlayerColor
      });
    } else {
      $("#grid > .result").addClass("white").css({
        display: "inherit",
        backgroundColor: "white"
      });
    }
  }
}
//checkGrid();

function checkField(thisField) {
  //console.log('thisField: ' + thisField.attr('id'));
  //console.log('class: ' + thisField.find('.square').eq(0).hasClass('one'));
  if (
    (thisField.find(".square").eq(0).hasClass("one") &&
      thisField.find(".square").eq(1).hasClass("one") &&
      thisField.find(".square").eq(2).hasClass("one")) ||
    (thisField.find(".square").eq(3).hasClass("one") &&
      thisField.find(".square").eq(4).hasClass("one") &&
      thisField.find(".square").eq(5).hasClass("one")) ||
    (thisField.find(".square").eq(6).hasClass("one") &&
      thisField.find(".square").eq(7).hasClass("one") &&
      thisField.find(".square").eq(8).hasClass("one")) ||
    (thisField.find(".square").eq(0).hasClass("one") &&
      thisField.find(".square").eq(3).hasClass("one") &&
      thisField.find(".square").eq(6).hasClass("one")) ||
    (thisField.find(".square").eq(1).hasClass("one") &&
      thisField.find(".square").eq(4).hasClass("one") &&
      thisField.find(".square").eq(7).hasClass("one")) ||
    (thisField.find(".square").eq(2).hasClass("one") &&
      thisField.find(".square").eq(5).hasClass("one") &&
      thisField.find(".square").eq(8).hasClass("one")) ||
    (thisField.find(".square").eq(0).hasClass("one") &&
      thisField.find(".square").eq(4).hasClass("one") &&
      thisField.find(".square").eq(8).hasClass("one")) ||
    (thisField.find(".square").eq(2).hasClass("one") &&
      thisField.find(".square").eq(4).hasClass("one") &&
      thisField.find(".square").eq(6).hasClass("one"))
  ) {
    //console.log('one won');
    thisField
      .find(".result .info")
      .html('<h1>One won!</h1><h3><a href="#" id="retryLink">Retry</a></h3>');
    thisField
      .find(".result")
      .css({
        display: "inherit",
        backgroundColor: colorOne //"#0000ff"
      })
      .addClass("one");
    thisField.removeClass("playable");
    checkGrid();
  } else if (
    (thisField.find(".square").eq(0).hasClass("two") &&
      thisField.find(".square").eq(1).hasClass("two") &&
      thisField.find(".square").eq(2).hasClass("two")) ||
    (thisField.find(".square").eq(3).hasClass("two") &&
      thisField.find(".square").eq(4).hasClass("two") &&
      thisField.find(".square").eq(5).hasClass("two")) ||
    (thisField.find(".square").eq(6).hasClass("two") &&
      thisField.find(".square").eq(7).hasClass("two") &&
      thisField.find(".square").eq(8).hasClass("two")) ||
    (thisField.find(".square").eq(0).hasClass("two") &&
      thisField.find(".square").eq(3).hasClass("two") &&
      thisField.find(".square").eq(6).hasClass("two")) ||
    (thisField.find(".square").eq(1).hasClass("two") &&
      thisField.find(".square").eq(4).hasClass("two") &&
      thisField.find(".square").eq(7).hasClass("two")) ||
    (thisField.find(".square").eq(2).hasClass("two") &&
      thisField.find(".square").eq(5).hasClass("two") &&
      thisField.find(".square").eq(8).hasClass("two")) ||
    (thisField.find(".square").eq(0).hasClass("two") &&
      thisField.find(".square").eq(4).hasClass("two") &&
      thisField.find(".square").eq(8).hasClass("two")) ||
    (thisField.find(".square").eq(2).hasClass("two") &&
      thisField.find(".square").eq(4).hasClass("two") &&
      thisField.find(".square").eq(6).hasClass("two"))
  ) {
    //console.log('two won');
    thisField
      .find(".result .info")
      .html('<h1>Two won!</h1><h3><a href="#" id="retryLink">Retry</a></h3>');
    thisField
      .find(".result")
      .css({
        display: "inherit",
        backgroundColor: colorTwo //"#ff0000"
      })
      .addClass("two");
    thisField.removeClass("playable");
    checkGrid();
  } else if (!thisField.find(".square").hasClass("clickable")) {
    thisField
      .find(".result .info")
      .html(
        '<h1>It\'s a tie!</h1><h3><a href="#" id="retryLink">Retry</a></h3>'
      );
    thisField
      .find(".result")
      .css({
        display: "inherit"
      })
      .addClass("white");
    thisField.removeClass("playable");
    checkGrid();
  }
  nextPlayer();
}

$("#grid").on("click", ".square", function () {
  if (
    $(this).hasClass("clickable") &&
    $(this).parent().parent().hasClass("current")
  ) {
    if (!$(this).hasClass("two") && !$(this).hasClass("one")) {
      $(this).removeClass("clickable");
      TweenLite.set($(this), {
        css: {
          className: "+=" + currentPlayer
        }
      });
      TweenMax.to($(this), 0.2, {
        //backgroundColor: currentPlayer
      });
      //TweenMax.
      checkField($(this).parent().parent());
    }
    /*if() {
                
            }*/
    clickNum = $(this).index();
    if (
      $(".container")
        .eq(clickNum - 1)
        .hasClass("playable")
    ) {
      $("#grid").removeClass("currentgrid").css({
        outline: "none"
      });
      $(".container").removeClass("current").css({
        outline: "none",
        "z-index": 1
      });
      $(".container")
        .eq(clickNum - 1)
        .addClass("current")
        .css({
          outline: "1px solid " + currentPlayerColor,
          "z-index": 9
        });
    } else {
      $("#grid")
        .addClass("currentgrid")
        .css({
          outline: "1px solid " + currentPlayerColor
        });
      $(".container").removeClass("current").addClass("current").css({
        outline: "none",
        "z-index": 1
      });
    }
    /*checkField($(this).parent().parent());
        }*/
    timer();
  }
});
var count = 0;
/*$('#result, #retryLink').on('click', function () {
    count++;
    console.log('count: ' + count);
    num = 0;
    fieldSetup($(this).parent().parent());
    return false;
});*/
$("#grid > .result").on("click", function () {
  num = 0;
  createFields();
  return false;
});

function setSize() {
  var gridMargin = "30px";
  var fieldMargin = "0px";
  if ($(window).width() < $(window).height()) {
    //alert('high');
    var target = $("#grid");
    target.css({
      left: gridMargin,
      right: gridMargin
    });
    var newMargin = (target.parent().height() - target.width()) / 2 + "px";
    target.css({
      top: newMargin,
      bottom: newMargin
    });
    var targetField = $(".field");
    targetField.css({
      left: fieldMargin,
      right: fieldMargin
    });
    var newFieldMargin =
      ($(".container").height() - targetField.width()) / 2 + "px";
    targetField.css({
      top: newFieldMargin,
      bottom: newFieldMargin
    });
  } else {
    //alert('wide');
    var target2 = $("#grid");
    target2.css({
      top: gridMargin,
      bottom: gridMargin
    });
    var newMargin2 = (target2.parent().width() - target2.height()) / 2 + "px";
    target2.css({
      left: newMargin2,
      right: newMargin2
    });
    var targetField2 = $(".field");
    targetField2.css({
      top: fieldMargin,
      bottom: fieldMargin
    });
    var newFieldMargin2 =
      ($(".container").width() - targetField2.height()) / 2 + "px";
    targetField2.css({
      left: newFieldMargin2,
      right: newFieldMargin2
    });
  }
}

$(".knob").knob({
  change: function (v) {
    //console.log(v);
    turnTime = v;
    if (turnTime === 4) {
      var showVal = "&infin;";
    } else {
      var showVal = v;
    }
    $("#timevalue").html(showVal);
    //$('#timer').html(turnTime);
  }
});
$("#timevalue").html(turnTime);

function toggleMenu(status) {
  if (status == "show") {
    TweenMax.to($("#setup"), 0.4, {
      css: {
        left: 0
      }
    });
    TweenMax.to($("#playfield"), 0.4, {
      css: {
        left: "100%"
      }
    });
  } else {
    TweenMax.to($("#setup"), 0.4, {
      css: {
        left: "-100%"
      }
    });
    TweenMax.to($("#playfield"), 0.4, {
      css: {
        left: 0
      }
    });
  }
}

$("#startgame").on("click", function () {
  createFields();
  toggleMenu("hide");
});
$("#tomenu").on("click", function () {
  paused = true;
  TweenMax.pauseAll();
  $("#togame").show();
  toggleMenu("show");
});
$("#togame").on("click", function () {
  paused = false;
  TweenMax.resumeAll();
  toggleMenu("hide");
});

// Rippled
$("body").on("click", ".rippled", function (e) {
  if (!$(this).hasClass("disabled")) {
    if ("vibrate" in navigator) {
      window.navigator.vibrate(10);
    }
    $(".square.last").removeClass("last");
    $(this)
      .addClass("last")
      .append('<div class="ripple ripple-animate"></div>');
    var src = $(this);
    var ripple = $(this).find(".ripple").last();
    ripple.removeClass("ripple-animate");
    ripple.addClass("ripple-animate");
    setTimeout(function () {
      src.removeClass("rippled");
      ripple.remove();
    }, 400);
  }
});
// END Rippled

$(window).resize(function () {
  //alert('ok');
  setSize();
});