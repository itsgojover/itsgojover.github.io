import React from 'react';
import Player from './Player';
import CommunityCards from './CommunityCards';
import ActionBar from './ActionBar';
import WinnerDisplay from './WinnerDisplay';
import BuyInPrompt from './BuyInPrompt';
import { AnimatePresence } from 'framer-motion';

function GameBoard({ gameState, sid, isHost, onPlayerAction, onStartNewHand, onBuyIn }) {
  if (!gameState) return <div>Loading Table...</div>;

  const me = gameState.players.find(p => p.sid === sid);
  const isMyTurn = gameState.current_turn_sid === sid;
  const canStartHand = isHost && (gameState.game_phase === 'waiting' || gameState.game_phase === 'showdown');
  const showBuyInButton = me && me.chips === 0;

  return (
    <>
      {canStartHand && !gameState.winner_info && (
        <div className="start-hand-bar">
          <button className="start-new-hand-btn" onClick={onStartNewHand}>
            Start Hand ({gameState.players.filter(p => p.chips > 0).length} Players)
          </button>
        </div>
      )}
      <div className="game-board">
        <div className="persistent-room-code">
            <h3>Room Code</h3>
            <p>{gameState.room}</p>
        </div>
        
        <AnimatePresence>
          {gameState.game_phase === 'showdown' && gameState.winner_info && (
            <WinnerDisplay 
              winnerInfo={gameState.winner_info}
              onStartNewHand={onStartNewHand}
              isHost={isHost}
            />
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showBuyInButton && <BuyInPrompt onBuyIn={onBuyIn} />}
        </AnimatePresence>

        <div className="players-container">
          {gameState.players
            .filter(player => player.sid !== sid)
            .map(player => (
              <Player
                key={player.sid}
                player={player}
                isCurrentPlayer={player.sid === gameState.current_turn_sid}
                isDealer={player.is_dealer}
                isHost={player.sid === gameState.host_sid}
                isMe={false}
              />
          ))}
        </div>

        <CommunityCards cards={gameState.community_cards} pot={gameState.pot} />

        {/* Center bottom: my player card */}
        {me && (
          <div className="my-player-center">
            <Player
              player={me}
              isCurrentPlayer={isMyTurn}
              isDealer={me.is_dealer}
              isHost={me.sid === gameState.host_sid}
              isMe={true}
            />
          </div>
        )}

        <AnimatePresence>
          {me && (
            <ActionBar
              player={me}
              amountToCall={gameState.amount_to_call}
              onPlayerAction={onPlayerAction}
              disabled={!isMyTurn || !me.is_active}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default GameBoard;