import { useState, useRef, useEffect } from 'react';
import SvgIcon from '../../assets/icons/svgIcon';
import { useAuth } from '../../hooks/useAuth';

const Select = ({ title, placeholder, options = [], value, error, onChange, className, classNameLa, disable = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    const { user } = useAuth();

    const selected = options.find(o => o.value === value);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} className={`flex flex-col gap-2 ${className || ''}`}>
            {title && (
                <div className="ml-[30px] -mt-[0.2vh]">
                    <span className={`text-sm font-bold ${classNameLa || ''}`}>{title}</span>
                </div>
            )}
            <div className="relative" >
                <button
                    onClick={(e) => {
                        if (user.livello === 0 || !disable) {
                            e.preventDefault();
                            setIsOpen(prev => !prev);
                        }
                    }}
                    className={`w-full flex justify-between items-center border border-[#E0E6EB] rounded-[30px] px-4 py-3 text-left
                        ${error
                            ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                            : user.livello === 0 || !disable
                                ? 'border-[#E0E6EB] focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
                                : 'border-[#E0E6EB] focus:none cursor-not-allowed'
                        }
                        ${user.livello === 0 || !disable ? 'bg-white' : 'bg-gray-100'}`}
                >
                    <span className={`text-base ${selected ? 'text-black font-bold' : 'text-[#777777]'}`}>
                        {selected ? selected.label : placeholder}
                    </span>
                    <SvgIcon
                        color="#777777"
                        width="2vh"
                        height="2vh"
                        strokeWidth="2.5"
                        path1="M6 9l6 6 6-6"
                        viewBox="0 0 24 24"
                        translate={false}
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />

                    {/* <svg
                        className={`w-[1.5vh] h-[1.5vh] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        viewBox="0 0 24 24" fill="none" stroke="#777777" strokeWidth="2.5"
                    >
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg> */}
                </button >

                {isOpen && (
                    <div className="absolute z-50 w-full mt-[1vh] bg-white border border-[#E0E6EB] rounded-[20px] shadow-lg max-h-[30vh] overflow-auto">
                        {options.map((option, index) => (
                            <div
                                key={index}
                                onClick={() => { onChange?.(option.value); setIsOpen(false); }}
                                className={`py-[1vh] px-[2vh] text-[1rem] cursor-pointer hover:bg-[#F5F7F9]
                                    ${value === option.value ? 'font-bold text-[#2B7BB4]' : 'text-black'}`}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div >
        </div >
    );
};

export default Select;