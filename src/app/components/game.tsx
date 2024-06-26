"use client";

import { useState, useEffect } from "react";
import { fetchPlayers, fetchRandomNames } from "../players/page";

const Game = () => {
  const [players, setPlayers] = useState([]);
  const [randomNames, setRandomNames] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const fetchedPlayers = await fetchPlayers();
    const fetchedRandomNames = await fetchRandomNames();

    setPlayers(fetchedPlayers);
    setRandomNames(fetchedRandomNames);

    startGame(fetchedPlayers, fetchedRandomNames);
    setLoading(false);
  };

  const startGame = (fetchedPlayers, fetchedRandomNames) => {
    const randomIndex = Math.floor(Math.random() * fetchedPlayers.length);
    const player = fetchedPlayers[randomIndex];
    setCurrentPlayer(player);
    generateOptions(player, fetchedRandomNames);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const generateOptions = (player, fetchedRandomNames) => {
    const correctName = player.name;
    const randomNamesSubset = fetchedRandomNames
      .filter((nameObj) => nameObj.name !== correctName)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map((nameObj) => nameObj.name);
    const options = shuffle([correctName, ...randomNamesSubset]);
    setOptions(options);
    console.log(options, "here options");
  };

  const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleOptionClick = (selectedName) => {
    setSelectedOption(selectedName);
    const correct = selectedName === currentPlayer.name;
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setQuestionNumber(questionNumber + 1);
      if (questionNumber === 9) {
        alert(`Game Over! Your final score is ${score}`);
        setQuestionNumber(0);
        setScore(0);
      } else {
        startGame(players, randomNames);
      }
    }, 1000);
  };

  const handlePlayAgain = () => {
    setQuestionNumber(0);
    setScore(0);
    startGame(players, randomNames);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      {loading ? (
        <h1 className="text-3xl font-bold mb-4 text-center">Loading game...</h1>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4 text-center">Guess the Football Player</h1>
          {questionNumber < 10 ? (
            <>
              <div className="mb-4">{currentPlayer?.image && <img src={currentPlayer.image} alt={currentPlayer.name} style={{ width: "280px", height: "auto" }} className="rounded-lg shadow-lg mb-4" />}</div>
              <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                {options.map((name, index) => (
                  <button
                    key={index}
                    className={`w-90 text-black font-bold py-2 px-4 rounded ${selectedOption ? (name === currentPlayer.name ? "bg-green-500" : name === selectedOption ? "bg-red-500" : "bg-white") : "bg-white hover:bg-orange-400"}`}
                    onClick={() => handleOptionClick(name)}
                    disabled={selectedOption !== null}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-xl font-semibold">Game Over!</p>
              <p className="text-xl">Your final score is {score}</p>
              <button className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handlePlayAgain}>
                Play Again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Game;
