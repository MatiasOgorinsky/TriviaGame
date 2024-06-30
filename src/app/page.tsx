"use client";
import React, { useState, useEffect } from "react";
import Game from "./components/Game";
import { v4 as uuidv4 } from "uuid";

const GameComponent = () => {
  const [userId, setUserId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      return storedUserId || "";
    }
    return "";
  });
  const [startGame, setStartGame] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userId", userId);
    }
  }, [userId]);

  const handleStartGame = () => {
    if (!userId) {
      const newUserId = uuidv4();
      setUserId(newUserId);
    }
    setStartGame(true);
  };

  return (
    <div>
      {!startGame ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <button className="bg-orange-400 mt-10 px-6 py-3 text-lg rounded text-white" onClick={handleStartGame}>
            Start Game
          </button>
        </div>
      ) : (
        <Game username={userId} />
      )}
    </div>
  );
};

export default GameComponent;
