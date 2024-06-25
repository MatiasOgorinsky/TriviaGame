"use client";
import { fetchPlayers, fetchRandomNames } from "./players/page";
import { useEffect, useState } from "react";

export default function Home() {
  const [players, setPlayers] = useState("");
  const [names, setNames] = useState("");
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const fetchedPlayers = await fetchPlayers();
    const fetchedNames = await fetchRandomNames();
    setPlayers(fetchedPlayers);
    setNames(fetchedNames);
  };

  return <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>;
}
