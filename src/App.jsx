import React, { useState, useEffect } from 'react';
import { connectSocket, getSocket } from './socket';
import LandingScreen from './components/LandingScreen';
import GameBoard from './components/GameBoard';
import './App.css';

function BackendUrlModal({ onSubmit }) {
  const [url, setUrl] = useState('');

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#222', padding: 32, borderRadius: 12, minWidth: 320 }}>
        <h2>Enter Backend URL</h2>
        <input
          style={{ width: '100%', padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #555', marginBottom: 16 }}
          type="text"
          placeholder="e.g. http://localhost:5000"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button
          style={{ width: '100%', padding: 12, fontSize: 18, borderRadius: 8, background: '#1a73e8', color: '#fff', border: 'none' }}
          onClick={() => url && onSubmit(url)}
        >
          Connect
        </button>
      </div>
    </div>
  );
}

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [sid, setSid] = useState(null);
  const [backendUrl, setBackendUrl] = useState(() => localStorage.getItem('backendUrl') || '');
  const [showUrlModal, setShowUrlModal] = useState(!backendUrl);

  useEffect(() => {
    if (!backendUrl) return;
    const socket = connectSocket(backendUrl);

    function onConnect() { setIsConnected(true); setSid(socket.id); }
    function onDisconnect() { setIsConnected(false); }
    function onGameUpdate(data) { 
      if (!isInRoom) setIsInRoom(true);
      setGameState(data); 
    }
    function onRoomCreated(data) { setRoom(data.room_code); }
    function onError(data) { alert(data.message); }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('game_update', onGameUpdate);
    socket.on('room_created', onRoomCreated);
    socket.on('error', onError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('game_update', onGameUpdate);
      socket.off('room_created', onRoomCreated);
      socket.off('error', onError);
    };
  // eslint-disable-next-line
  }, [backendUrl, isInRoom]);

  const handleCreateRoom = () => getSocket().emit('create_room', { username });
  const handleJoinGame = () => getSocket().emit('join_game', { username, room });
  const handleStartNewHand = () => getSocket().emit('start_hand_request', { room });
  const handlePlayerAction = (action, payload = {}) => getSocket().emit('player_action', { room: gameState.room, action, ...payload });
  const handleBuyIn = () => getSocket().emit('player_buy_in', { room: gameState.room });

  const isHost = gameState?.host_sid === sid;

  // Handle backend URL modal logic
  const handleBackendUrlSubmit = (url) => {
    localStorage.setItem('backendUrl', url);
    setBackendUrl(url);
    setShowUrlModal(false);
  };

  // If socket disconnects and can't reconnect, show the modal again
  useEffect(() => {
    if (!isConnected && backendUrl) {
      const timeout = setTimeout(() => {
        setShowUrlModal(true);
        localStorage.removeItem('backendUrl');
        setBackendUrl('');
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [isConnected, backendUrl]);

  return (
    <div className="app-container">
      {showUrlModal && <BackendUrlModal onSubmit={handleBackendUrlSubmit} />}
      {!isInRoom ? (
        <LandingScreen
          username={username}
          setUsername={setUsername}
          room={room}
          setRoom={setRoom}
          handleCreateRoom={handleCreateRoom}
          handleJoinGame={handleJoinGame}
          isConnected={isConnected}
        />
      ) : (
        <GameBoard
          gameState={gameState}
          sid={sid}
          isHost={isHost}
          onPlayerAction={handlePlayerAction}
          onStartNewHand={handleStartNewHand}
          onBuyIn={handleBuyIn}
        />
      )}
    </div>
  );
}

export default App;