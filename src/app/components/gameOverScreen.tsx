import React from "react";

interface GameOverScreenProps {
  score: number;
  handlePlayAgain: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, handlePlayAgain }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center">
        <p className="text-xl font-semibold">Game Over!</p>
        <p className="text-xl">Your final score is {score}</p>
        <button className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handlePlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
