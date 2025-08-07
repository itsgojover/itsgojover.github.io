import React from 'react';

function LoginScreen({ username, setUsername, room, setRoom, handleJoinGame, isConnected }) {
  return (
    <div className="login-container">
      <h1>Poker Night</h1>
      <p>Connection: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="login-input"
      />
      <input
        type="text"
        placeholder="Enter room name"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        className="login-input"
      />
      <button onClick={handleJoinGame} disabled={!isConnected || !username || !room} className="login-button">
        Join Game
      </button>
    </div>
  );
}

export default LoginScreen;