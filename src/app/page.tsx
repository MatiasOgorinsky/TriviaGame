"use client";

import { useState, useEffect } from "react";
import { fetchPlayers, fetchRandomNames } from "./players/page";

const Game = () => {
  const [players, setPlayers] = useState([]);
  const [randomNames, setRandomNames] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0); // Track number of questions shown

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const fetchedPlayers = await fetchPlayers();
    const fetchedRandomNames = await fetchRandomNames();

    setPlayers(fetchedPlayers);
    setRandomNames(fetchedRandomNames);

    startGame(fetchedPlayers, fetchedRandomNames);
  };

  const startGame = (fetchedPlayers, fetchedRandomNames) => {
    const randomIndex = Math.floor(Math.random() * fetchedPlayers.length);
    const player = fetchedPlayers[randomIndex];
    setCurrentPlayer(player);
    generateOptions(player, fetchedRandomNames);
  };

  // const generateOptions = (player, fetchedRandomNames) => {
  //   const correctName = player.name;
  //   const shuffledNames = shuffle([...fetchedRandomNames.map((nameObj) => nameObj.name), correctName]);
  //   const options = shuffledNames.slice(0, 2); // Choose 3 random names
  //   setOptions(shuffle(options));
  //   console.log(options, "here options");
  // };

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
    if (selectedName === currentPlayer.name) {
      alert("Correct answer!");
      setScore(score + 1);
    } else {
      alert(`Wrong answer! The correct answer is ${currentPlayer.name}.`);
    }
    setQuestionNumber(questionNumber + 1);
    if (questionNumber === 9) {
      // Last question shown
      alert(`Game Over! Your final score is ${score}`);
      setQuestionNumber(0);
      setScore(0);
    } else {
      startGame(players, randomNames);
      const nextIndex = (players.indexOf(currentPlayer) + 1) % players.length;
      const nextPlayer = players[nextIndex];
      setCurrentPlayer(nextPlayer);
      generateOptions(nextPlayer, randomNames);
    }
  };

  const handlePlayAgain = () => {
    setQuestionNumber(0);
    setScore(0);
    startGame(players, randomNames);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Guess the Football Player</h1>
      {questionNumber < 10 ? (
        <>
          <div className="mb-4">{currentPlayer?.image && <img src={currentPlayer.image} alt={currentPlayer.name} className="rounded-lg shadow-lg mb-4" />}</div>
          <div className="grid grid-cols-1 gap-4 w-full max-w-md">
            {options.map((name, index) => (
              <button key={index} className="w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleOptionClick(name)}>
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
    </div>
  );
};

export default Game;
