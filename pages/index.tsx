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
  const [boardData, setBoardData] = useState<{ [key: number]: string }>({
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

  // Player name states
  const [playerX, setPlayerX] = useState("");
  const [playerO, setPlayerO] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      checkWinner();
      checkDraw();
    }
  }, [boardData]);

  const updateBoardData = (idx: number) => {
    if (!boardData[idx] && !won) {
      const value = xTurn ? "X" : "O";
      setBoardData({ ...boardData, [idx]: value });
      setXTurn(!xTurn);
    }
  };

  const checkDraw = () => {
    const check = Object.values(boardData).every((v) => v);
    setIsDraw(check);
    if (check) setModalTitle("Match Draw!!!");
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
        setModalTitle(`Player ${!xTurn ? playerX : playerO} Won!!!`);
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
  };

  const startGame = () => {
    if (playerX && playerO) {
      setGameStarted(true);
    } else {
      alert("Please enter both player names.");
    }
  };

  return (
    <div className="main-div">
      <Head>
        <title>Tic Tac Toe</title>
      </Head>
      <h1>Tic Tac Toe</h1>

      {!gameStarted ? (
       <div className="game__setup">
       <div className="input-group">
         <label>Player X Name:</label>
         <input
           type="text"
           value={playerX}
           onChange={(e) => setPlayerX(e.target.value)}
         />
       </div>
       <div className="input-group">
         <label>Player O Name:</label>
         <input
           type="text"
           value={playerO}
           onChange={(e) => setPlayerO(e.target.value)}
         />
       </div>
       <button className="start-button" onClick={startGame}>
         Start Game
       </button>
     </div>
      ) : (
        <div className="game">
          <div className="game__menu">
            <p>{xTurn ? `${playerX}'s Turn (X)` : `${playerO}'s Turn (O)`}</p>
            <p>{`Game Won: ${won} Draw: ${isDraw}`}</p>
          </div>
          <div className="game__board">
            {[...Array(9)].map((_, idx) => (
              <div
                onClick={() => updateBoardData(idx)}
                key={idx}
                className={`square ${
                  wonCombo.includes(idx) ? "highlight" : ""
                }`}
              >
                {boardData[idx]}
              </div>
            ))}
          </div>

          <div className={`modal ${modalTitle ? "show" : ""}`}>
            <div className="modal__title">{modalTitle}</div>
            <button onClick={reset}>New Game</button>
          </div>
        </div>
      )}
    </div>
  );
}
