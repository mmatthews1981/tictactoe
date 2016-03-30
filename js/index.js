$(document).ready(function() {
  game();
});

function resetGame() {
  $(".winner").fadeOut();

  setTimeout(function() {
    $(".pop-up").fadeIn();
    $(".grid").each(function() {
      $(this).removeClass("markx");
      $(this).removeClass("marko");
      board = [0, 0, 0,
        0, 0, 0,
        0, 0, 0
      ];
    });
  }, 500);
}

function game() {
  player = "";
  computer = "";

  board = [0, 0, 0,
    0, 0, 0,
    0, 0, 0
  ];

  //pick x or o
  $(".marker").click(function() {
    player = ($(this).hasClass("x")) ? "X" : "O";
    computer = (player === "X") ? "O" : "X";
    $(".pop-up").fadeOut("slow");
    updateBoard();

    if (computer === "X") {
      setTimeout(comp, 1000);
    }
  })

  $(".grid").click(function() {
    //grab the board array location
    var num = $(this).data("id");
    //check to see if this is a free space, and mark it if it is
    if (board[num] == 0) {
      //update the board array
      board[num] = player;
      //update the view
      updateBoard();
      //check to see if this was a winning move
      var win = checkWinner(board, player);
      if (win === "tie") {
        winner("tie");
      } else if (win == player) {
        winner(player);
      } else {
        comp();
      }
    }
  });

  function winner(val) {
    $(".winner").fadeIn();
    if (val == "tie") {
      $("#winmessage").text("Tie.");
    } else {
      $("#winmessage").text(val + " wins!");
    }
    setTimeout(function() {
      resetGame();
    }, 3000);
  }

  function comp() {
    miniMax(board, computer);
    board[computerMove] = computer;
    updateBoard();
    var win = checkWinner(board, computer);
    if (win === "tie") {
      winner("tie");
    } else if (win == computer) {
      winner(computer);
    }
  }
  //based on on http://codepen.io/oneate7/pen/NGzOWm
  function miniMax(state, current) {

    if (checkWinner(state, current) === player) {
      return -10;
    } else if (checkWinner(state, current) === computer) {
      return 10;
    } else if (checkWinner(state, current) === "tie") {
      return 0;
    }

    var move = [];
    var score = [];

    findEmptyMoves(state).forEach(function(value) {
      state[value] = current;
      score.push(miniMax(state, (current === computer) ? player : computer));
      move.push(value);

      state[value] = 0;
    });

    if (current === computer) {
      computerMove = move[score.indexOf(Math.max.apply(Math, score))];
      return Math.max.apply(Math, score);
    } else {
      computerMove = move[score.indexOf(Math.min.apply(Math, score))];
      return Math.min.apply(Math, score);
    }
  }

  function updateBoard() {
    for (var i = 0; i <= board.length; i++)
      if (board[i] == "X") {
        $("#b" + i).addClass("markx");
      } else
    if (board[i] == "O") {
      $("#b" + i).addClass("marko");
    }

  };

  function checkWinner(arr, porc) {
    // check for a tie
    if (board.indexOf(0) === -1) {
      return "tie";
      //check for winners in all directions
    } else if (
      arr[0] == porc && arr[1] == porc && arr[2] == porc ||
      arr[3] == porc && arr[4] == porc && arr[5] == porc ||
      arr[6] == porc && arr[7] == porc && arr[8] == porc ||
      arr[0] == porc && arr[3] == porc && arr[6] == porc ||
      arr[1] == porc && arr[4] == porc && arr[7] == porc ||
      arr[2] == porc && arr[5] == porc && arr[8] == porc ||
      arr[0] == porc && arr[4] == porc && arr[8] == porc ||
      arr[2] == porc && arr[4] == porc && arr[6] == porc
    ) {
      //return a winner if there is one
      return porc;
    }
  };

  function findEmptyMoves(board) {
    var emptymoves = [];
    board.forEach(function(value, index) {
      if (value === 0) {
        emptymoves.push(index);
      }
    });
    return emptymoves;
  }
}