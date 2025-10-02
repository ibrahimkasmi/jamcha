import { motion, useAnimation } from 'framer-motion';
import { Button } from './button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface AnimatedDeleteButtonProps {
  onAnimatedClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'lg' | 'default' | 'icon';
  className?: string;
}

export function AnimatedDeleteButton({
  onAnimatedClick,
  disabled = false,
  size = 'sm',
  className = ''
}: AnimatedDeleteButtonProps) {
  const controls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    if (disabled || isAnimating) return;
    setIsAnimating(true);
    await controls.start({
      scale: [1, 1.2, 0.9, 1.1, 1],
      rotate: [0, -10, 10, -5, 0],
      transition: { duration: 0.5, ease: 'easeInOut' }
    });
    setIsAnimating(false);
    onAnimatedClick();
  };

  return (
    <motion.div animate={controls}>
      <Button
        size={size}
        variant="outline"
        className={`relative overflow-hidden ${className}`}
        onClick={handleClick}
        disabled={disabled || isAnimating}
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
