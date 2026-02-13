import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
const SidebarButton = forwardRef(({
    icon,
    title,
    percorso
}, ref) => {
    const navigate = useNavigate();

    const isThisPage = window.location.pathname === percorso;

    return (
        <div 
            className={`flex justify-center items-center py-[1vh] w-[100%] hover:bg-[#efa134] hover:bg-opacity-10 hover:cursor-pointer ${isThisPage ? 'border-l-4 border-[#efa134]' : ''}`} 

            title={title}
            onClick={() => navigate(percorso, { replace: true })} 
            ref={ref}
        >
            <span className={`text-white text-sm ${isThisPage ? '' : 'ml-1'}`}>
                {icon}
            </span>
        </div>
    );
});

export default SidebarButton;