import React, { useState } from 'react';
import { motion } from 'framer-motion';

function LandingScreen({ username, setUsername, room, setRoom, handleCreateRoom, handleJoinGame, isConnected }) {
  const [mode, setMode] = useState('host'); // 'host' or 'join'

  const canSubmit = isConnected && username;
  const canJoin = canSubmit && room;

  const containerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1 
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      className="landing-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={itemVariants}>Poker Night</motion.h1>
      <motion.p variants={itemVariants}>Connection: {isConnected ? 'Connected' : 'Disconnected'}</motion.p>
      
      <motion.div className="landing-choices" variants={itemVariants}>
        <button className={`choice-button ${mode === 'host' ? 'active' : ''}`} onClick={() => setMode('host')}>
          Host New Game
        </button>
        <button className={`choice-button ${mode === 'join' ? 'active' : ''}`} onClick={() => setMode('join')}>
          Join Existing Game
        </button>
      </motion.div>

      <motion.input
        variants={itemVariants}
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="login-input"
      />
      
      {mode === 'join' && (
        <motion.input
          variants={itemVariants}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          type="text"
          placeholder="Enter Room Code"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="login-input"
        />
      )}

      {mode === 'host' ? (
        <motion.button 
          variants={itemVariants} 
          onClick={handleCreateRoom} 
          disabled={!canSubmit} 
          className="login-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Room
        </motion.button>
      ) : (
        <motion.button 
          variants={itemVariants} 
          onClick={handleJoinGame} 
          disabled={!canJoin} 
          className="login-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Join Room
        </motion.button>
      )}
    </motion.div>
  );
}

export default LandingScreen;