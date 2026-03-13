import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  noerror = false,
  error,
  required = false,
  disabled = false,
  icon,
  classNameIn = '',
  classNameLa = '',
  classNameEr = ''
}, ref) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      
      {/* Label */}
      {label && (
        <label htmlFor={name} className={`text-sm ${classNameLa}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Wrapper con icona */}
      <div className="relative w-full">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center">
            {icon}
          </span>
        )}
        
        {/* Input field */}
        <input
          ref={ref}
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-3 border rounded-[30px] text-base
            transition-all duration-300 ease-in-out
            focus:outline-none
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${icon ? 'pl-11' : ''}
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' 
              : 'border-[#E0E6EB] focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
            }
            ${classNameIn}
          `}
        />
      </div>
      
      {/* Messaggio errore */}
        {!noerror && <span className={`text-red-500 text-sm ${classNameEr}`}>{error ? error : '\u00A0'}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;