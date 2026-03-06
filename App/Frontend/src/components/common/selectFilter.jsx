import { useState, useRef, useEffect } from 'react';
import SvgIcon from '../../assets/icons/svgIcon';

const SelectFilter = ({ title, placeholder, options = [], value, onChange, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    const selected = options.find(o => o.value === value);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} className={`flex flex-col ${className || ''}`}>
            {title && (
                <div className="pl-[2vh]">
                    <span className='text-black text-[1.5vh] font-bold'>{title}</span>
                </div>
            )}
            <div className="relative">
                <button
                    onClick={() => setIsOpen(prev => !prev)}
                    className="w-full flex justify-between items-center border border-[#E0E6EB] bg-white rounded-[30px] py-[1vh] px-[2vh] text-left"
                >
                    <span className={`text-[1.5vh] ${selected ? 'text-black font-bold' : 'text-[#777777]'}`}>
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
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-[1vh] bg-white border border-[#E0E6EB] rounded-[20px] shadow-lg max-h-[30vh] overflow-auto">
                        {options.map((option, index) => (
                            <div
                                key={index}
                                onClick={() => { onChange?.(option.value); setIsOpen(false); }}
                                className={`py-[1vh] px-[2vh] text-[1.5vh] cursor-pointer hover:bg-[#F5F7F9]
                                    ${value === option.value ? 'font-bold text-[#2B7BB4]' : 'text-black'}`}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectFilter;