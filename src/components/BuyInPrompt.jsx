import React from 'react';

function BuyInPrompt({ onBuyIn }) {
  return (
    <div className="buy-in-prompt">
      <p>You are out of chips!</p>
      <button className="buy-in-button" onClick={onBuyIn}>
        Buy-In for $1000
      </button>
    </div>
  );
}

export default BuyInPrompt;