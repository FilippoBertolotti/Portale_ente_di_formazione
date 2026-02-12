import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick, 
  type = 'button',
  disabled = false,
  fullWidth = false,
  icon,
  className = ''
}, ref) => {
  
  // Mappa delle varianti
  const variants = {
    primary: 'bg-[#EFA134] text-white hover:translate-y-[-2px] rounded-[30px]',
    secondary: 'bg-[#76A1CF] text-white hover:translate-y-[-2px] rounded-[30px]',
    tertiary: 'bg-[#F07F13] text-white hover:translate-y-[-2px] rounded-[30px]',
    quaternary: 'bg-[#9BC4E8] text-white hover:translate-y-[-2px] rounded-[30px]',
    modify: 'bg-[#2B7BB4] text-white hover:translate-y-[-2px] rounded-[30px]',
    danger: 'bg-[#D64541] text-white hover:translate-y-[-2px] rounded-[30px]',
  };

  // Mappa delle dimensioni
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  return (
    <button
      ref={ref}
      type={type}
      className={`
        border-none rounded-lg cursor-pointer font-semibold 
        inline-flex items-center justify-center gap-2 
        transition-all duration-300 ease-in-out font-sans
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;