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
