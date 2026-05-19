import { useState, useRef, useEffect } from "react";
import SvgIcon from "../../assets/icons/svgIcon";
import { useAuth } from "../../hooks/useAuth";
import Button from "./button";

const UserCard = ({ user }) => {
    const livelloText = {
        0: 'Amministratore',
        1: 'Coordinatore',
        2: 'Docente',
        3: 'Studente'
    }
    const [openWindow, setOpenWindow] = useState(false);
    const { logout } = useAuth();
    const modalRef = useRef(null);

    // Chiudi il modal se clicchi fuori
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setOpenWindow(false);
            }
        };

        if (openWindow) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [openWindow]);

    // Chiudi il modal con il tasto ESC
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && openWindow) {
                setOpenWindow(false);
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [openWindow]);

    return (
        <div className="relative z-30" onClick={() => setOpenWindow(true)}>
            {/* Trigger button */}
            <div
                className="flex items-center justify-center space-x-[1rem] px-[1rem] py-[0.5rem] lg:bg-[#F5F7F9] lg:border lg:border-[#E0E6EB] rounded-[30px] cursor-pointer hover:bg-gray-50 transition-colors"
            >
                <div
                    className="rounded-full bg-[#2A7BB3] w-[4.2vw] xl:w-[3.2vw] h-[4.2vw] xl:h-[3.2vw] flex items-center justify-center"
                    onClick={() => setOpenWindow(true)}
                >
                    <SvgIcon
                        width="50%"
                        path1="M15 18.3333C18.9933 18.3333 22.625 19.49 25.2966 21.12C26.63 21.9333 27.77 22.8933 28.5933 23.9367C29.4033 24.9617 30 26.1883 30 27.5C30 28.9083 29.315 30.0183 28.3283 30.81C27.395 31.56 26.1633 32.0567 24.855 32.4033C22.225 33.0983 18.715 33.3333 15 33.3333C11.285 33.3333 7.775 33.1 5.145 32.4033C3.83667 32.0567 2.605 31.56 1.67167 30.81C0.683334 30.0167 0 28.9083 0 27.5C0 26.1883 0.596667 24.9617 1.40667 23.935C2.23 22.8933 3.36833 21.935 4.70333 21.1183C7.375 19.4917 11.0083 18.3333 15 18.3333ZM15 0C17.2101 0 19.3298 0.877974 20.8925 2.44078C22.4554 4.00358 23.3333 6.1232 23.3333 8.33333C23.3333 10.5435 22.4554 12.6631 20.8925 14.2259C19.3298 15.7887 17.2101 16.6667 15 16.6667C12.7899 16.6667 10.6702 15.7887 9.10744 14.2259C7.54464 12.6631 6.66667 10.5435 6.66667 8.33333C6.66667 6.1232 7.54464 4.00358 9.10744 2.44078C10.6702 0.877974 12.7899 0 15 0Z"
                        color="#FFFFFF"
                    />
                </div>
                <div className="hidden lg:block" onClick={() => setOpenWindow(true)}>
                    <p className="text-[1rem] text-black font-bold">{user.nome}</p>
                    <p className="text-[#777777] text-[1rem] font-bold">{livelloText[user.livello]}</p>
                </div>
            </div>

            {/* Modal */}
            {openWindow && (
                <>
                    {/* Overlay trasparente per chiudere cliccando fuori */}
                    <div
                        className="fixed inset-0 z-10 lg:hidden"
                        onClick={() => setOpenWindow(false)}
                    />

                    {/* Modal content */}
                    <div
                        ref={modalRef}
                        className="absolute top-[110%] right-0 z-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white border border-[#E0E6EB] rounded-[30px] p-6 w-[40vw] xl:w-[70vw] max-w-md shadow-xl">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-gray-800">{user.nome} {user.cognome}</h2>
                                <button
                                    onClick={() => setOpenWindow(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-2 mb-6">
                                <p className="text-gray-600">
                                    <span className="font-medium">Email:</span> {user.email}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Ruolo:</span> {livelloText[user.livello]}
                                </p>
                                {user.livello === 3 && user.corso && (
                                    <p className="text-gray-600">
                                        <span className="font-medium">Corso:</span> {user.corso}
                                    </p>
                                )}
                                {user.livello === 3 && user.annoAccademico && (
                                    <p className="text-gray-600">
                                        <span className="font-medium">Anno Accademico:</span> {user.annoAccademico}
                                    </p>
                                )}
                            </div>

                            <Button
                                onClick={() => {
                                    setOpenWindow(false);
                                    logout();
                                }}
                                variant="danger"
                                className="w-full xl:hidden"
                                icon={
                                    <SvgIcon
                                        color="#ffffff"
                                        width="20"
                                        height="20"
                                        path1="M23.1229 2.91082C22.9755 2.76488 22.7703 2.67838 22.551 2.67838H7.69384C7.47457 2.67838 7.26931 2.76488 7.12193 2.91082C6.97541 3.05588 6.89792 3.24707 6.89792 3.44086V5.50149C6.89792 6.24109 6.30406 6.84068 5.57139 6.84068C4.83872 6.84068 4.24485 6.24109 4.24485 5.50149V3.44086C4.24485 2.51984 4.61459 1.64189 5.26406 0.998691C5.91289 0.356351 6.7873 0 7.69384 0H22.551C23.4576 0 24.332 0.356351 24.9807 0.998691C25.6303 1.64189 26 2.51984 26 3.44086V26.5593C26 27.4802 25.6303 28.358 24.9807 29.0013C24.332 29.6437 23.4576 30 22.551 30H7.69384C6.7873 30 5.91289 29.6437 5.26406 29.0013C4.61459 28.358 4.24485 27.4802 4.24485 26.5593V24.4986C4.24485 23.759 4.83872 23.1594 5.57139 23.1594C6.30406 23.1594 6.89792 23.759 6.89792 24.4986V26.5593C6.89792 26.753 6.97541 26.9441 7.12193 27.0891C7.26931 27.2351 7.47457 27.3216 7.69384 27.3216H22.551C22.7703 27.3216 22.9755 27.2351 23.1229 27.0891C23.2694 26.9441 23.3469 26.753 23.3469 26.5593V3.44086C23.3469 3.24707 23.2694 3.05588 23.1229 2.91082ZM6.07908 9.47785C6.57467 9.68513 6.89792 10.1735 6.89792 10.7151V13.6613H16.1837C16.9163 13.6613 17.5102 14.2609 17.5102 15.0005C17.5102 15.7401 16.9163 16.3397 16.1837 16.3397H6.89792V19.2859C6.89792 19.8276 6.57467 20.3159 6.07908 20.5231C5.58327 20.7304 5.01276 20.6159 4.63347 20.2328L0.388569 15.9474C-0.129522 15.4245 -0.129522 14.5765 0.388569 14.0536L4.63347 9.76816C5.01276 9.38516 5.58327 9.27059 6.07908 9.47785Z"
                                    />
                                }
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserCard;