import React, { useState, useEffect } from "react";
import { fetchPlayers, fetchRandomNames, postResult } from "../utils/apiUtils";

interface GameProps {
  username: string;
}

interface Player {
  name: string;
  image: string;
}

interface RandomName {
  name: string;
}

const Game: React.FC<GameProps> = ({ username }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [randomNames, setRandomNames] = useState<RandomName[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [usedPlayerIndices, setUsedPlayerIndices] = useState<number[]>([]); // Track used player indices

  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch players and random names
  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedPlayers = await fetchPlayers();
      const fetchedRandomNames = await fetchRandomNames();
      setPlayers(fetchedPlayers);
      setRandomNames(fetchedRandomNames);
      startGame(fetchedPlayers, fetchedRandomNames);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to start the game
  const startGame = (fetchedPlayers: Player[], fetchedRandomNames: RandomName[]) => {
    const availablePlayers = fetchedPlayers.filter((_, index) => !usedPlayerIndices.includes(index)); // Filter out used players
    if (availablePlayers.length === 0) {
      setUsedPlayerIndices([]);
    }
    const randomIndex = Math.floor(Math.random() * availablePlayers.length);
    const player = availablePlayers[randomIndex];
    setCurrentPlayer(player);
    generateOptions(player, fetchedRandomNames);
    setSelectedOption(null);
    setIsCorrect(null);
    setGameOver(false);
    setUsedPlayerIndices([...usedPlayerIndices, fetchedPlayers.findIndex((p) => p.name === player.name)]);
  };

  // Function to generate options for the game
  const generateOptions = (player: Player, fetchedRandomNames: RandomName[]) => {
    const correctName = player.name;
    const randomNamesSubset = fetchedRandomNames
      .filter((nameObj) => nameObj.name !== correctName)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map((nameObj) => nameObj.name);
    const options = shuffle([correctName, ...randomNamesSubset]);
    setOptions(options);
  };

  // Helper function to shuffle array
  const shuffle = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Function to handle option click
  const handleOptionClick = async (selectedName: string) => {
    setSelectedOption(selectedName);
    const correct = selectedName === currentPlayer?.name;
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }

    setTimeout(async () => {
      setQuestionNumber(questionNumber + 1);
      if (questionNumber === 9) {
        alert(`Game Over! Your final score is ${score}`);
        setUsedPlayerIndices([]);

        try {
          await postResult(username, score);
          console.log("Result posted successfully");
        } catch (error) {
          console.error("Error posting result:", error);
        }

        setGameOver(true);
      } else {
        startGame(players, randomNames);
      }
    }, 1000);
  };

  // Function to handle play again button click
  const handlePlayAgain = () => {
    setQuestionNumber(0);
    setScore(0);
    setGameOver(false);
    fetchData();
    startGame(players, randomNames);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      {loading ? (
        <h1 className="text-3xl font-bold mb-4 text-center">Loading game...</h1>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4 text-center">Guess the Football Player</h1>
          {!gameOver && questionNumber < 10 ? (
            <>
              <div className="mb-4">{currentPlayer?.image && <img src={currentPlayer.image} alt={currentPlayer.name} style={{ width: "280px", height: "auto" }} className="rounded-lg shadow-lg mb-4" />}</div>
              <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                {options.map((name, index) => (
                  <button
                    key={index}
                    className={`w-90 text-black font-bold border-2 py-2 px-4 rounded ${selectedOption ? (name === currentPlayer?.name ? "bg-green-500" : name === selectedOption ? "bg-red-500" : "bg-white") : "bg-white hover:bg-orange-400"}`}
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
