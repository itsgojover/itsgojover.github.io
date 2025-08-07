import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

const Card = ({ card }) => {
  if (card === '?') {
    return <motion.div className="card card-back" variants={cardVariants}></motion.div>;
  }
  const suit = card.slice(-1);
  const rank = card.slice(0, -1);
  const color = ['♥', '♦'].includes(suit) ? 'red' : 'black';
  return (
    <motion.div className={`card ${color}`} variants={cardVariants}>
      <span>{rank}</span>
      <span>{suit}</span>
    </motion.div>
  );
};

function Player({ player, isCurrentPlayer, isDealer, isHost, isMe }) {
  const isSpectator = player.chips === 0 && !player.is_active;
  const playerClasses = `player ${isCurrentPlayer ? 'active' : ''} ${!player.is_active ? 'folded' : ''} ${isSpectator ? 'spectator' : ''}`;

  // Show strongest hand text if available
  const strongestHand = player.strongest_hand_name || null;

  return (
    <motion.div 
      className={playerClasses}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isDealer && <motion.div className="dealer-button" initial={{ scale:0 }} animate={{ scale:1 }}>D</motion.div>}
      <div className="player-info">
        {isHost && '👑 '}
        {player.username}
      </div>
      <div className="player-chips">${player.chips}</div>
      <motion.div className="hand" layout>
        {player.hand.length > 0 
            ? player.hand.map((card, index) => <Card key={index} card={card} />)
            : <div style={{height: '70px'}}></div>
        }
      </motion.div>
      {/* Only show strongest hand for yourself */}
      {isMe && strongestHand && (
        <div className="strongest-hand-text">
          <em>{strongestHand}</em>
        </div>
      )}
      {player.current_bet > 0 && <motion.div className="player-bet" layoutId={`bet-${player.sid}`}>Bet: ${player.current_bet}</motion.div>}
      {player.is_all_in && <div className="player-status">(ALL-IN)</div>}
      {isSpectator && <div className="player-status spectating">SPECTATING</div>}
      {!player.is_active && player.chips > 0 && <strong style={{opacity: 0.7}}>FOLDED</strong>}
    </motion.div>
  );
}

export default Player;