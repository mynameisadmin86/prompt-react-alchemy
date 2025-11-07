import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  maxStars = 5,
  size = 'md',
  readonly = false,
  className,
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const handleClick = (index: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(index);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (!readonly) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxStars }, (_, index) => {
        const starIndex = index + 1;
        const isActive = starIndex <= (hoverRating || rating);

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={cn(
              'transition-all duration-200',
              !readonly && 'cursor-pointer hover:scale-110',
              readonly && 'cursor-default'
            )}
            aria-label={`Rate ${starIndex} out of ${maxStars}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-colors duration-200',
                isActive
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-none text-gray-300'
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
