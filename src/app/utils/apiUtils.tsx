export const fetchPlayers = async () => {
  try {
    const response = await fetch("/api/players");
    return response.json();
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
};

export const fetchRandomNames = async () => {
  try {
    const response = await fetch("/api/names");
    return response.json();
  } catch (error) {
    console.error("Error fetching names:", error);
    throw error;
  }
};

export const postResult = async (username: string, score: number) => {
  try {
    const response = await fetch("/api/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, score }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error posting result:", error);
    throw error;
  }
};
