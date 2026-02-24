import Button from "./button";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, buttonType }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            
            <div className="relative bg-white rounded-[30px] shadow-2xl max-w-md w-full mx-4 animate-scale-in">
                <div className="p-6">
                    {/* Titolo */}
                    <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                        {title}
                    </h3>
                    
                    {/* Messaggio */}
                    <p className="text-gray-600 text-center mb-6">
                        {message}
                    </p>
                    
                    {/* Bottoni */}
                    <div className="flex justify-between">
                        <Button
                            onClick={onClose}
                            variant="border"
                            className="w-[40%] justify-center"
                        >
                        Annulla
                        </Button>
                        <Button
                            onClick={onConfirm}
                            variant={buttonType || 'danger'}
                            className="w-[40%] justify-center"
                        >
                            {confirmText || "Conferma"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;