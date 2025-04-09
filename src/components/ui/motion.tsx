
import React from "react";

type MotionProps = {
  children: React.ReactNode;
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  transition?: Record<string, any>;
  className?: string;
};

export const Motion: React.FC<MotionProps> = ({
  children,
  initial,
  animate,
  transition,
  className,
}) => {
  // Apply some CSS classes based on the animation props
  // This is a simple implementation without a full motion library
  const getAnimationClass = () => {
    let classes = className || "";
    
    if (animate && animate.opacity === 1 && initial?.opacity === 0) {
      classes += " animate-fade-in";
    }
    
    if (animate && animate.y === 0 && initial?.y !== 0) {
      classes += " animate-slide-up";
    }
    
    return classes;
  };

  return (
    <div className={getAnimationClass()} style={{ 
      animationDuration: `${transition?.duration || 0.3}s`,
      animationDelay: `${transition?.delay || 0}s`
    }}>
      {children}
    </div>
  );
};
