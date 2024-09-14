import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VideoCall = () => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handleFormSubmit = (ev) => {
    ev.preventDefault();
    navigate(`/room/${roomCode}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleFormSubmit}
        className="bg-white p-6 rounded-lg shadow-lg space-y-6"
      >
        <div className="space-y-2">
          <label
            htmlFor="roomCode"
            className="block text-lg font-medium text-gray-700"
          >
            Enter Room Code
          </label>
          <input
            id="roomCode"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Room Code"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Join Room
        </button>
      </form>
    </div>
  );
};

export default VideoCall;
