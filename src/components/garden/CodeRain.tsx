
import { useEffect, useRef } from 'react';

interface CodeRainProps {
  isActive: boolean;
}

const CodeRain = ({ isActive }: CodeRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Characters to use
    const chars = '01010101';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    // Array to store drop position for each column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100); // Initial offset
    }
    
    // Drawing function
    const draw = () => {
      if (!ctx) return;
      
      // Black BG with opacity for trail effect
      ctx.fillStyle = 'rgba(34, 34, 34, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // For each column
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Randomly select a color from our terminal theme
        const colors = ['#F2FCE2', '#E5DEFF', '#FFDEE2', '#D3E4FD'];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Move it down
        drops[i]++;
        
        // Reset when off-screen
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }
    };
    
    // Animation loop
    const interval = setInterval(draw, 33); // ~30 FPS
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isActive]);
  
  if (!isActive) return null;
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
    />
  );
};

export default CodeRain;
