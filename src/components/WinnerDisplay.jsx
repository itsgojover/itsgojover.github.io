import React from 'react';

function WinnerDisplay({ winnerInfo, onStartNewHand, isHost }) {
  if (!winnerInfo) return null;

  return (
    <div className="winner-overlay">
      <div className="winner-modal">
        <h2>Hand Over!</h2>
        <p>
          <strong>{winnerInfo.username}</strong> wins with a <strong>{winnerInfo.hand_name}</strong>!
        </p>
        {isHost && (
            <button className="start-new-hand-btn" onClick={onStartNewHand}>
                Start New Hand
            </button>
        )}
      </div>
    </div>
  );
}

export default WinnerDisplay;