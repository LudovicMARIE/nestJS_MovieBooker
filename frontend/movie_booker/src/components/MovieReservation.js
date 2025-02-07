import { useState } from "react";

const MovieReservation = () => {
  const [movieId, setMovieId] = useState("");
  const [screeningTime, setScreeningTime] = useState("");

  const handleReservation = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const reservationData = {
      userId: userId, 
      movieId: parseInt(movieId, 10),
      screeningTime: screeningTime,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reservations/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      alert("Reservation successful!");
      console.log("Reservation response:", data);
    } catch (error) {
      console.error("Reservation failed:", error);
      alert("Reservation failed. Please try again.");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">Reserve a Movie</h2>

      {/* Movie ID Input */}
      <input
        type="text"
        placeholder="Enter Movie ID"
        value={movieId}
        onChange={(e) => setMovieId(e.target.value)}
        className="w-full p-2 mb-3 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
      />

      {/* Date-Time Picker */}
      <input
        type="datetime-local"
        value={screeningTime}
        onChange={(e) => setScreeningTime(e.target.value)}
        className="w-full p-2 mb-3 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
      />

      {/* Submit Button */}
      <button
        onClick={handleReservation}
        className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition"
      >
        Reserve
      </button>
    </div>
  );
};

export default MovieReservation;
