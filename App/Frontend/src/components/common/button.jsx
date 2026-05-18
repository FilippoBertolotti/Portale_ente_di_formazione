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
  className = '',
  title = ''
}, ref) => {
  
  // Mappa delle varianti
  const variants = {
    primary: 'bg-[#EFA134] text-white rounded-[30px] hover:bg-opacity-90',
    secondary: 'bg-[#76A1CF] text-white rounded-[30px] hover:bg-opacity-90',
    tertiary: 'bg-[#F07F13] text-white rounded-[30px] hover:bg-opacity-90',
    quaternary: 'bg-[#9BC4E8] text-white rounded-[30px] hover:bg-opacity-90',
    modify: 'bg-[#2B7BB4] text-white rounded-[30px] hover:bg-opacity-90',
    danger: 'bg-[#D64541] text-white rounded-[30px] hover:bg-opacity-90',
    border: 'border border-[#777777] text-[#777777] hover:bg-[#777777] hover:bg-opacity-10 rounded-[30px]',
    noBg: 'text-[#777777] hover:bg-[#777777] hover:bg-opacity-10 rounded-[30px]'
  };

  // Mappa delle dimensioni
  const sizes = {
    small: 'text-sm px-2 py-2',
    medium: 'px-[1.5vh] py-2 text-[1rem] xl:text-[0.8rem]',
    large: 'px-[2vh] py-4 text-lg'
  };

  return (
    <button
      ref={ref}
      type={type}
      title={title}
      className={`
        cursor-pointer font-semibold 
        inline-flex items-center justify-start gap-[0.8vh] 
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