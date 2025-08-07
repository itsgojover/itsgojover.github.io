import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const cardVariants = {
  hidden: { y: -20, opacity: 0, scale: 0.8 },
  visible: { y: 0, opacity: 1, scale: 1 },
};

const Card = ({ card }) => {
  const suit = card.slice(-1);
  const rank = card.slice(0, -1);
  const color = ['♥', '♦'].includes(suit) ? 'red' : 'black';
  return (
    <motion.div 
      className={`card ${color}`} 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      layout
    >
      <span>{rank}</span>
      <span>{suit}</span>
    </motion.div>
  );
};

function CommunityCards({ cards, pot }) {
  // Animate flop reveal: show one card at a time for the first 3 cards
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    let timeoutIds = [];
    setVisibleCards([]);
    if (cards.length <= 3) {
      cards.forEach((card, i) => {
        timeoutIds.push(setTimeout(() => {
          setVisibleCards(prev => [...prev, card]);
        }, i * 700));
      });
    } else {
      setVisibleCards(cards);
    }
    return () => timeoutIds.forEach(clearTimeout);
  }, [cards.join(',')]);

  return (
    <div className="community-area">
      <div className="community-cards-display">
        <AnimatePresence>
          {(cards.length <= 3 ? visibleCards : cards).map((card, index) => <Card key={index} card={card} />)}
        </AnimatePresence>
      </div>
      <motion.div layout className="pot-display">
        Pot: ${pot}
      </motion.div>
    </div>
  );
}

export default CommunityCards;