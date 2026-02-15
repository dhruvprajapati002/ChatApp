import { MessageCircle } from 'lucide-react';

interface LogoProps {
  className?: string; // For wrapper size/margin
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-12 h-12 rounded-2xl'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <div className={`
      bg-gradient-to-tr from-sky-500 to-violet-600 
      flex items-center justify-center 
      shadow-lg shadow-sky-500/20 
      ring-1 ring-white/20
      ${sizeClasses[size]}
      ${className}
    `}>
      <MessageCircle 
        size={iconSizes[size]} 
        className="text-white" 
        strokeWidth={2.5}
      />
    </div>
  );
}
