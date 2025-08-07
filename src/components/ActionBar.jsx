import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function ActionBar({ player, amountToCall, onPlayerAction, disabled }) {
  const [raiseAmount, setRaiseAmount] = useState(amountToCall * 2);

  useEffect(() => {
    setRaiseAmount(amountToCall > 0 ? amountToCall * 2 : 20);
  }, [amountToCall]);

  const handleAction = (action, payload = {}) => {
    if (!disabled) onPlayerAction(action, payload);
  };

  const callAmount = amountToCall - player.current_bet;
  const canRaise = player.chips > callAmount;

  return (
    <motion.div 
      className="action-bar"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
    >
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="fold-btn" onClick={() => handleAction('fold')} disabled={disabled}>
        Fold
      </motion.button>

      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="check-btn" onClick={() => handleAction('check')} disabled={disabled || callAmount > 0}>
        Check
      </motion.button>
      
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="call-btn" onClick={() => handleAction('call')} disabled={disabled || callAmount <= 0 || player.chips < callAmount}>
        Call ${callAmount}
      </motion.button>

      {canRaise && (
        <div className="raise-container">
          <input
            type="number"
            step="20"
            value={raiseAmount}
            onChange={(e) => setRaiseAmount(parseInt(e.target.value, 10) || 0)}
            className="raise-input"
            disabled={disabled}
          />
          <motion.button 
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            className="raise-btn" 
            onClick={() => handleAction('raise', { amount: raiseAmount })}
            disabled={disabled || raiseAmount <= amountToCall || raiseAmount > player.chips + player.current_bet}
          >
            Raise
          </motion.button>
        </div>
      )}

      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="all-in-btn" onClick={() => handleAction('all-in')} disabled={disabled}>
        All-In (${player.chips})
      </motion.button>
    </motion.div>
  );
}

export default ActionBar;