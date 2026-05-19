import { forwardRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import ConfirmationModal from '../common/confirmationModal';

const SidebarButton = forwardRef(({
    icon,
    title,
    percorso,
    type,
    className
}, ref) => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const isThisPage = window.location.pathname === percorso;

    const handleLogout = async () => {
        try {
            await logout();
            setShowLogoutModal(false);
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Errore logout:', error);
        }
    };

    const handleClick = () => {
        switch (type) {
            case 'button':
                navigate(percorso, { replace: true });
                break;
            case 'logout':
                setShowLogoutModal(true);
                break;
        }
    };

    return (
        <>
            <div
                className={`h-[100%] xl:h-fit flex justify-center items-center xl:py-[0.5rem] py-[0.2rem] w-[100%] hover:bg-[#efa134] hover:bg-opacity-10 hover:cursor-pointer xl:pr-2 ${isThisPage ? 'border-b-4 xl:border-b-0 xl:border-l-4 border-[#efa134]' : 'pb-1 xl:pl-1'} ${className}`}
                title={title}
                onClick={handleClick}
                ref={ref}
            >
                <span className="text-white text-sm flex flex-col items-center">
                    {icon}
                </span>
            </div>

            <ConfirmationModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                title="Conferma Logout"
                confirmText="Esci"
                cancelText="Rimani"
                confirmColor="red"
            >
                <p className="text-gray-600 text-center mb-6">
                    Ciao {user?.nome}, sei sicuro di voler uscire?
                </p>
            </ConfirmationModal>
        </>
    );
});

export default SidebarButton;