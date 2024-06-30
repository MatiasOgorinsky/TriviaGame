import React, { useState, useEffect } from "react";
import { fetchPlayers, fetchRandomNames, postResult } from "../utils/apiUtils";
import GameOverScreen from "./GameOverScreen";
import Timer from "./Timer";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [usedPlayerIndices, setUsedPlayerIndices] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
    handleScreenSize();
    window.addEventListener("resize", handleScreenSize);
    return () => {
      window.removeEventListener("resize", handleScreenSize);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedPlayers = await fetchPlayers();
      const fetchedRandomNames = await fetchRandomNames();
      setPlayers(fetchedPlayers);
      setRandomNames(fetchedRandomNames);
      startGame(fetchedPlayers, fetchedRandomNames, []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const startGame = (fetchedPlayers: Player[], fetchedRandomNames: RandomName[], usedIndices: number[]) => {
    let availablePlayers = fetchedPlayers.filter((_, index) => !usedIndices.includes(index));
    if (availablePlayers.length === 0) {
      usedIndices = [];
      availablePlayers = fetchedPlayers;
    }
    const randomIndex = Math.floor(Math.random() * availablePlayers.length);
    const player = availablePlayers[randomIndex];
    setCurrentPlayer(player);
    setImageLoaded(false);
    generateOptions(player, fetchedRandomNames);
    setSelectedOption(null);
    setGameOver(false);
    setUsedPlayerIndices([...usedIndices, fetchedPlayers.findIndex((p) => p.name === player.name)]);
  };

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

  const shuffle = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleOptionClick = async (selectedName: string) => {
    setSelectedOption(selectedName);
    const correct = selectedName === currentPlayer?.name;

    if (correct) {
      setScore(score + 1);
    }

    const updatedQuestionNumber = questionNumber + 1;

    if (updatedQuestionNumber === 10) {
      setUsedPlayerIndices([]);
      setGameOver(true);

      try {
        await postResult(username, correct ? score + 1 : score);
      } catch (error) {
        console.error("Error posting result:", error);
      }
    } else {
      setQuestionNumber(updatedQuestionNumber);
      setTimeout(() => {
        startGame(players, randomNames, usedPlayerIndices);
      }, 1000);
    }
  };

  const handlePlayAgain = () => {
    setTimeLeft(15);
    setQuestionNumber(0);
    setScore(0);
    setGameOver(false);
    fetchData();
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true);
      setUsedPlayerIndices([]);
      try {
        postResult(username, score);
      } catch (error) {
        console.error("Error posting result:", error);
      }
    }
  }, [timeLeft, username, score]);

  const handleScreenSize = () => {
    setIsSmallScreen(window.innerWidth <= 640);
  };

  useEffect(() => {
    handleScreenSize();
  }, []);

  if (gameOver) {
    return <GameOverScreen score={score} handlePlayAgain={handlePlayAgain} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-sm mx-auto">
      {loading || !imageLoaded ? (
        <h1 className="text-2xl font-bold mb-4 text-center">Loading game...</h1>
      ) : (
        <>
          <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} setGameOver={setGameOver} />
          <h1 className={`text-${isSmallScreen ? "lg" : "2xl"} font-bold mb-4 text-center`}>Guess the Football Player</h1>
          <div className="mb-4">{currentPlayer?.image && <img src={currentPlayer.image} alt={currentPlayer.name} className="rounded-lg shadow-lg mb-4" style={{ width: "200px", height: "auto" }} onLoad={() => setImageLoaded(true)} />}</div>
          <div className="grid grid-cols-1 gap-2 w-full">
            {options.map((name, index) => (
              <button
                key={index}
                className={`w-full text-black font-bold border-2 py-2 px-4 rounded ${selectedOption ? (name === currentPlayer?.name ? "bg-green-500" : name === selectedOption ? "bg-red-500" : "bg-white") : "bg-white"} ${!isSmallScreen && !selectedOption ? "hover:bg-orange-400" : ""}`}
                onClick={() => handleOptionClick(name)}
                disabled={selectedOption !== null}
              >
                {name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
