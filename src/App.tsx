import Board from "./components/Board";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-[#252645]">
      <div className="py-8">
        <h2 className="text-5xl font-bold tracking-widest text-[#fad06c]">
          15 Puzzle
        </h2>
        <div className="h-[4px] w-full bg-red-50"></div>
      </div>

      <div className="font-sans text-white text-center">
        <h2 className="font-bold tracking-wider text-4xl">Instructions</h2>
        <p className="text-2xl">
          Move tiles in grid to order them from 1 to 15. <br />
          To move a tile you can click on it
        </p>
      </div>

      <Board />
    </div>
  );
}

export default App;
