import React, { useState, useRef, useEffect } from 'react';

const ScratchCard = ({ finishPercent, brushSize, onComplete, children }) => {
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedAreas, setScratchedAreas] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    if (isScratching) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.globalCompositeOperation = 'destination-out';

      scratchedAreas.forEach(({ x, y }) => {
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, 2 * Math.PI);
        ctx.fill();
      });

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const alpha = Array.from(imageData.data).filter((_, i) => i % 4 === 3);
      const percentScratched = alpha.filter(a => a === 0).length / alpha.length;

      if (percentScratched > finishPercent) {
        onComplete();
      }
    }
  }, [isScratching, scratchedAreas]);

  const handleMouseDown = () => {
    console.log('down');
    setIsScratching(true);
  };

  const handleMouseUp = () => {
    console.log('up');
    setIsScratching(false);
  };

  const handleMouseMove = (e) => {
  if (isScratching) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setScratchedAreas([...scratchedAreas, { x, y }]);
  }
};

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2,
          cursor: 'pointer',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
      {children}
    </div>
  );
};

export default ScratchCard;