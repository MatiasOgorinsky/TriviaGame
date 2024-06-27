"use client";
import React, { useState } from "react";
import Game from "./components/game";

const GameComponent = () => {
  const [userName, setUserName] = useState("");
  const [startGame, setStartGame] = useState(false);

  const handleStartGame = (name: string) => {
    if (!userName) {
      return;
    }
    setStartGame(true);
  };

  return (
    <div>
      {!startGame ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <input type="text" placeholder="Enter your name" onChange={(e) => setUserName(e.target.value)} className="border-2 border-gray-500 p-2 rounded" />
          <button className="bg-orange-400 mt-10 px-6 py-3 text-lg rounded text-white" onClick={() => handleStartGame(userName)}>
            Start Game >
          </button>
        </div>
      ) : (
        <Game username={userName} />
      )}
    </div>
  );
};

export default GameComponent;
