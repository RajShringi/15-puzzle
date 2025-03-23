import { useState } from "react";
import Confetti from "react-confetti";
import useWindowSize from "./hooks/useWindowSize";

const BOARD_SIZE = 4;

export default function Board() {
  const correctBoard = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, null],
  ];

  // create a random board everyTime when you start
  const [board, setBoard] = useState<(number | null)[][]>(
    generateRandomBoard()
  );

  const { width, height } = useWindowSize();

  const [boxToAnim, setboxToAnim] = useState<{
    x: null | number;
    y: null | number;
  }>({ x: null, y: null });

  const [hasWon, setHasWon] = useState(false);

  function generateRandomBoard() {
    const size = BOARD_SIZE;
    const numbers: (number | null)[] = Array.from(
      { length: size * size - 1 },
      (_, i) => i + 1
    ); // [1, 2, ..., 15]
    numbers.push(null); // Adding the null value

    // Shuffle the numbers array using Fisher-Yates shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // Convert the shuffled array into a 2D array
    const result = [];
    while (numbers.length) {
      result.push(numbers.splice(0, size));
    }

    return result;
  }

  function checkWinner(arr: (number | null)[][]) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (arr[i][j] !== correctBoard[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  // find all the ajacency box
  function handleClick(rowIndex: number, colIndex: number) {
    if (hasWon) return;
    const adjacencyBoxes = [];
    const boardCopy: (number | null)[][] = JSON.parse(JSON.stringify(board));

    if (rowIndex - 1 >= 0) {
      adjacencyBoxes.push({ rowIndex: rowIndex - 1, colIndex });
    }
    if (rowIndex + 1 <= BOARD_SIZE - 1) {
      adjacencyBoxes.push({ rowIndex: rowIndex + 1, colIndex });
    }
    if (colIndex - 1 >= 0) {
      adjacencyBoxes.push({ rowIndex, colIndex: colIndex - 1 });
    }
    if (colIndex + 1 <= BOARD_SIZE - 1) {
      adjacencyBoxes.push({ rowIndex, colIndex: colIndex + 1 });
    }

    const emptyBox = adjacencyBoxes.find((box) => {
      let x = box["rowIndex"];
      let y = box["colIndex"];

      if (boardCopy[x][y] === null) {
        return true;
      }
      return false;
    });

    if (emptyBox) {
      const { rowIndex: x, colIndex: y } = emptyBox;
      boardCopy[x][y] = boardCopy[rowIndex][colIndex];
      boardCopy[rowIndex][colIndex] = null;

      // Update the board first
      setBoard(boardCopy);

      // Then update clickedBox
      setboxToAnim({ x, y });

      // Check if the player won
      if (checkWinner(boardCopy)) {
        setHasWon(true);
      }

      // Reset animation after a short delay
      setTimeout(() => {
        setboxToAnim({ x: null, y: null });
      }, 500);
    }
  }

  function resetGame() {
    setBoard(generateRandomBoard());
    setHasWon(false);
    setboxToAnim({ x: null, y: null });
  }

  return (
    <>
      <div className="bg-[#f0819b] p-2 rounded-md grid grid-cols-4 gap-2">
        {board.flatMap((row, rowIndex) =>
          row.map((num, colIndex) => (
            <div
              onClick={() => handleClick(rowIndex, colIndex)}
              key={num}
              className={`${
                num !== null &&
                rowIndex === boxToAnim.x &&
                colIndex === boxToAnim.y &&
                "animate-bounce"
              } relative overflow-hidden w-[70px] h-[70px] md:w-[100px] text-5xl md:h-[100px] md:text-7xl font-bold cursor-pointer ${
                num === null ? "bg-[#252645]" : "bg-[#fad06c]"
              } text-[#9f7c2d] rounded-md p-2 flex items-center justify-center`}
            >
              <span>{num === null ? "" : num}</span>
              <span className="absolute text-white mr-4 z-10">
                {num === null ? "" : num}
              </span>
              <div
                className={`absolute ${
                  num === null ? "" : "bg-black"
                } w-[30px] h-[30px] rounded-full top-2 opacity-5 left-2`}
              ></div>
              <div
                className={`absolute ${
                  num === null ? "" : "bg-black"
                } w-[70px] h-[70px] rounded-full top-6 opacity-5 left-9`}
              ></div>
            </div>
          ))
        )}
      </div>

      {hasWon && (
        <div className="font-sans absolute inset-0 flex items-center justify-center z-10">
          <div className=" animate-bounce text-center z-10 w-full h-[450px] bg-[#f0819b] rounded-md p-2">
            <Confetti width={width} height={height} />
            <div className="bg-[#252645] w-full h-full flex items-center justify-center flex-col gap-4">
              <h2 className="text-2xl font-bold text-white">You Win! 🎉</h2>
              <button
                onClick={resetGame}
                className="cursor-pointer mt-2 px-4 py-2 bg-[#fad06c] text-white font-bold text-xl tracking-widest rounded-md hover:bg-[#e6c578]"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
