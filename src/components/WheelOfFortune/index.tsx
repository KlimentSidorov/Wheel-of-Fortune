import React, { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import './WheelOfFortune.scss';

interface Prize { id: number; name: string; color: string; }

const prizes: Prize[] = [
 { id: 1, name: '100 Coins', color: '#FF0000' },
 { id: 2, name: '50 Coins', color: '#0000FF' },
 { id: 3, name: 'Free Spin', color: '#00FF00' },
 { id: 4, name: '25 Coins', color: '#FFFF00' },
 { id: 5, name: 'Bonus Round', color: '#FF00FF' },
 { id: 6, name: '10 Coins', color: '#00FFFF' },
];

const WheelOfFortune: React.FC = () => {
 const [isSpinning, setIsSpinning] = useState(false);
 const [rotation, setRotation] = useState(0);
 const [showResult, setShowResult] = useState(false);
 const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
 const wheelRef = useRef<HTMLDivElement>(null);

 const spinWheel = () => {
  if (isSpinning) return;
  setIsSpinning(true);

  const minSpins = 3 * 360;
  const randomSpin = Math.random() * 360;
  const totalRotation = rotation + minSpins + randomSpin;
  setRotation(totalRotation);

  const normalizedRotation = (360 - (totalRotation % 360)) % 360;
  const sectionAngle = 360 / prizes.length;
  const selectedIndex = Math.floor(normalizedRotation / sectionAngle);
  const selectedPrize = prizes[selectedIndex];

  setTimeout(() => {
   setIsSpinning(false);
   setCurrentPrize(selectedPrize);
   setShowResult(true);
  }, 3000);
 };

 const closeResult = () => {
  setShowResult(false);
  setCurrentPrize(null);
 };

 const createConicGradientWheel = (): CSSProperties => {
  const angle = 360 / prizes.length;
  const eps = 0.6;
  const stops = prizes.map((p, i) =>
   `${p.color} ${i * angle}deg ${(i + 1) * angle + eps}deg`
  );

  return {
   background: `conic-gradient(${stops.join(', ')})`,
   position: 'relative',
   width: '100%',
   height: '100%',
   borderRadius: '50%',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   backfaceVisibility: 'hidden',
   transform: 'translateZ(0)',
  };
 };

 return (
  <div className="wheel-of-fortune__container">
   <h1 className="wheel-of-fortune__title">Casino Wheel of Fortune</h1>

   <div className="wheel-of-fortune__wheel-container">
    <div
     ref={wheelRef}
     className="wheel-of-fortune__wheel"
     style={{
      transform: `rotate(${rotation}deg)`,
      transition: isSpinning ? 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
     }}
    >
     <div style={createConicGradientWheel()}>
      {prizes.map((prize, index) => {
       const slice = 360 / prizes.length;
       const textAngle = index * slice + slice / 2;

       const labelStyle: CSSProperties = {
        transform: `translate(-50%, -50%) rotate(${textAngle}deg) translateY(-120px)`,
       };

       return (
        <div
         key={`text-${prize.id}`}
         className="wheel-of-fortune__label"
         style={labelStyle}
        >
         {prize.name}
        </div>
       );
      })}
     </div>
    </div>

    <div className="wheel-of-fortune__pointer" />

    <button
     onClick={spinWheel}
     disabled={isSpinning}
     className="wheel-of-fortune__spin-button"
    >
     SPIN
    </button>
   </div>

   {showResult && (
    <div className="wheel-of-fortune__modal" onClick={closeResult}>
     <div className="wheel-of-fortune__modal-content" onClick={(e) => e.stopPropagation()}>
      <div
       className="wheel-of-fortune__modal-header"
       style={{ backgroundColor: currentPrize?.color || '#fff' }}
      >
       Congratulations!
      </div>

      <h2 style={{ color: '#fff', marginBottom: 20 }}>You Won:</h2>
      <div
       className="wheel-of-fortune__prize-text"
       style={{ color: currentPrize?.color || '#fff' }}
      >
       {currentPrize?.name}
      </div>

      <button className="wheel-of-fortune__collect-button" onClick={closeResult}>
       Collect Prize
      </button>
     </div>
    </div>
   )}

   {isSpinning && (
    <div className="wheel-of-fortune__loading">Spinning... Good Luck!</div>
   )}
  </div>
 );
};

export default WheelOfFortune;
