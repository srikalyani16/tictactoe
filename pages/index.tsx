import Head from "next/head";
import { useEffect, useState } from "react";

const WINNING_COMBO: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function Home() {
  const [xTurn, setXTurn] = useState(true);
  const [won, setWon] = useState(false);
  const [wonCombo, setWonCombo] = useState<number[]>([]);
  const [showNames, setShowNames] = useState(false);
  const [boardData, setBoardData] = useState<Record<number, string>>({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
  });
  const [isDraw, setIsDraw] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [isComputer, setIsComputer] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [buttonText,setButtonText]=useState('New Game');

  // Player names
  const [playerX, setPlayerX] = useState("");
  const [playerO, setPlayerO] = useState("");

  useEffect(() => {
    if (gameStarted) {
      checkWinner();
      checkDraw();
    }
  }, [boardData, gameStarted]);

  useEffect(() => {
    if (gameStarted && isComputer && !xTurn && !won && !isDraw) {
      setIsPlayerTurn(false); // Disable player clicks
      const timer = setTimeout(() => {
        if (!won && !isDraw) {
          const computerMove = getBestMove();
          updateBoardData(computerMove);
        }
        setIsPlayerTurn(true); // Enable player clicks after computer turn
      }, 1000); // 1 second delay for computer's move

      return () => clearTimeout(timer); // Clean up the timeout if the component unmounts
    }
  }, [xTurn, won, isDraw, isComputer, gameStarted]);

  const updateBoardData = (idx: number) => {
    if (!boardData[idx] && !won && !isDraw && isPlayerTurn) {
      const value = xTurn ? "X" : "O";
      setBoardData((prev) => ({ ...prev, [idx]: value }));
      setXTurn(!xTurn);
    }
  };

  const getBestMove = (): number => {
    // Returns the best move for the computer
    const availableMoves = Object.keys(boardData).filter((key) => boardData[+key] === "");
    
    if (availableMoves.length === 0) return -1;
  
    let bestScore = -Infinity;
    let move = -1;
  
    availableMoves.forEach((idx) => {
      const position = parseInt(idx, 10);
      boardData[position] = "O";
      const score = minimax(boardData, false);
      boardData[position] = "";
      
      if (score > bestScore) {
        bestScore = score;
        move = position;
      }
    });
  
    return move;
  };
  
  const minimax = (board: Record<number, string>, isMaximizing: boolean): number => {
    const winner = checkWinnerInBoard(board);
    if (winner === "O") return 10; // Computer win
    if (winner === "X") return -10; // Player win
    if (Object.values(board).every((cell) => cell !== "")) return 0; // Draw
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      Object.keys(board).forEach((key) => {
        const idx = +key;
        if (board[idx] === "") {
          board[idx] = "O";
          const score = minimax(board, false);
          board[idx] = "";
          bestScore = Math.max(score, bestScore);
        }
      });
      return bestScore;
    } else {
      let bestScore = Infinity;
      Object.keys(board).forEach((key) => {
        const idx = +key;
        if (board[idx] === "") {
          board[idx] = "X";
          const score = minimax(board, true);
          board[idx] = "";
          bestScore = Math.min(score, bestScore);
        }
      });
      return bestScore;
    }
  };
  
  const checkWinnerInBoard = (board: Record<number, string>): string | null => {
    for (const combo of WINNING_COMBO) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };
  

  const checkDraw = () => {
    const check = Object.values(boardData).every((v) => v);
    setIsDraw(check);
    if (check && !won) {setModalTitle("Match Draw!!!");setButtonText("New Game");};
  };

  const checkWinner = () => {
    WINNING_COMBO.forEach((combo) => {
      const [a, b, c] = combo;
      if (
        boardData[a] &&
        boardData[a] === boardData[b] &&
        boardData[a] === boardData[c]
      ) {
        setWon(true);
        setWonCombo([a, b, c]);
        if (!modalTitle && !isComputer) { // Avoid setting the modal title again if it's already set
          setModalTitle(`🎉Congratulations! Player ${!xTurn ? playerX : playerO} Won!!!`);
          setButtonText("New Game");
        }
        else if (!modalTitle && isComputer){
          setModalTitle("🤖The computer outsmarted you this time!");
          setButtonText("Challenge it")
        }
        setIsPlayerTurn(false); // Stop player clicks after win
      }
    });
  };

  const reset = () => {
    setBoardData({
      0: "",
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
      7: "",
      8: "",
    });
    setXTurn(true);
    setWon(false);
    setWonCombo([]);
    setIsDraw(false);
    setModalTitle("");
    setGameStarted(false);
    setIsPlayerTurn(true);
    setShowNames(false);
  };

  const startGame = () => {
    if (isComputer) {
      if (playerX) {
        setGameStarted(true);
      } else {
        alert("Please enter your name.");
      }
    } else {
      if (playerX && playerO) {
        setGameStarted(true);
      } else {
        alert("Please enter both player names.");
      }
    }
  };

  return (
    <div className="main-div">
      <Head>
        <title>Tic Tac Toe</title>
        <link rel="icon" href="/180.png" />
      </Head>
      <h1>Tic Tac Toe</h1>

      {!gameStarted ? (
        <div className="game__setup">
          <div>
            <button onClick={() => { setIsComputer(false); setShowNames(true); }} style={{ marginRight: "10px" }}>
              Play with Friend
            </button>
            <button onClick={() => { setIsComputer(true); setShowNames(true); }}>
              Play with Computer
            </button>
          </div>
          {showNames && (
            <div>
              <div className="input-group">
                <label>Player X Name:</label>
                <input
                  type="text"
                  value={playerX}
                  onChange={(e) => setPlayerX(e.target.value)}
                />
              </div>

              {!isComputer && (
                <div className="input-group">
                  <label>Player O Name:</label>
                  <input
                    type="text"
                    value={playerO}
                    onChange={(e) => setPlayerO(e.target.value)}
                  />
                </div>
              )}
              <button className="start-button" onClick={startGame}>
                Start Game
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="game">
          <div className="game__menu">
            <p>{xTurn ? `${playerX}'s Turn (X)` : isComputer ? "Computer's Turn (O)" : `${playerO}'s Turn (O)`}</p>
          </div>

          <div className="game__board">
            {[...Array(9)].map((_, idx) => (
              <div
                onClick={() => updateBoardData(idx)}
                key={idx}
                className={`square ${wonCombo.includes(idx) ? "highlight" : ""}`}
                style={{ pointerEvents: isPlayerTurn ? "auto" : "none" }} // Disable clicks when not player's turn
              >
                {boardData[idx]}
              </div>
            ))}
          </div>

          {modalTitle && (
            <div className={`modal show`}>
              <div className="modal__title">{modalTitle}</div>
              <button onClick={reset}>{buttonText}</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
