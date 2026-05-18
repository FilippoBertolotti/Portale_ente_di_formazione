import { useState, useRef, useEffect } from 'react';
import SvgIcon from '../../assets/icons/svgIcon';
import { chatService } from '../../services/chatService';

const ChatBox = () => {
    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Ciao! Chiedimi qualcosa su studenti, corsi, docenti o lezioni.' }
    ]);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const handleChat = async (e) => {
        e?.preventDefault();
        if (!message.trim() || loading) return;

        const userMsg = message.trim();
        setMessage('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setMessages(prev => [...prev, { role: 'assistant', content: '', loading: true }]);
        setLoading(true);

        try {
            const response = await chatService.query(userMsg);
            setMessages(prev => [
                ...prev.slice(0, -1),
                { role: 'assistant', content: response.data.answer }
            ]);
        } catch {
            setMessages(prev => [
                ...prev.slice(0, -1),
                { role: 'assistant', content: 'Errore nella risposta. Riprova.' }
            ]);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {/* Input nell'header */}
            {isOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-[2px]"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Chat panel */}
                    <div className="relative w-[80%] xl:w-[40%] bg-white rounded-[30px] shadow-2xl flex flex-col overflow-hidden"
                        style={{ height: '70vh' }}
                    >
                        {/* Header panel */}
                        <div className="flex items-center justify-between px-[2vh] py-[1.5vh] border-b border-[#E0E6EB] shrink-0">
                            <span className="font-bold text-sm">Assistente AI</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-[#777777] hover:text-black transition-colors text-xl leading-none px-[1vh]"
                            >
                                ×
                            </button>
                        </div>

                        {/* Messaggi */}
                        <div className="flex-1 overflow-y-auto px-[2vh] py-[1.5vh] flex flex-col gap-[1vh]">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`
                                        max-w-[80%] px-[1.5vh] py-[1vh] rounded-[20px] text-sm font-normal leading-relaxed
                                        ${msg.role === 'user'
                                            ? 'bg-[#2B7BB4] text-white rounded-br-none'
                                            : 'bg-[#F5F7F9] border border-[#E0E6EB] text-black rounded-bl-none'
                                        }
                                    `}>
                                        {msg.loading ? (
                                            <div className="flex items-center gap-[4px] py-[2px]">
                                                <span className="w-[6px] h-[6px] bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                                                <span className="w-[6px] h-[6px] bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                                                <span className="w-[6px] h-[6px] bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                                            </div>
                                        ) : <div dangerouslySetInnerHTML={{ __html: msg.content }} />}
                                    </div>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div className="shrink-0 px-[2vh] py-[1.5vh] border-t border-[#E0E6EB]">
                            <form onSubmit={handleChat} className="flex items-center gap-[1vh]">
                                <input
                                    ref={inputRef}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="Scrivi un messaggio..."
                                    disabled={loading}
                                    className="flex-1 bg-[#F5F7F9] border border-[#E0E6EB] rounded-[30px] px-[1.5vh] py-[1vh] text-sm font-normal focus:outline-none focus:border-[#2B7BB4] transition-all disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={!message.trim() || loading}
                                    className="bg-[#2B7BB4] rounded-full w-[4vh] h-[4vh] flex items-center justify-center disabled:opacity-40 hover:bg-opacity-90 transition-all shrink-0"
                                >
                                    <SvgIcon color='#fff' width="1.5vh" height="1.5vh"
                                        viewBox="0 0 24 24"
                                        path1="M3 12L21 3L12 21L10 13L3 12Z"
                                    />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="absolute z-10 w-[100%]">
                    <div
                        className="flex justify-center gap-[1vh] bg-gradient-to-r from-[#82A9D3]/50 to-[#F07F13]/50 border border-[#E0E6EB] rounded-[30px] px-[1.5vh] py-[1vh] cursor-pointer w-[15%] hover:border-[#2B7BB4] transition-all m-auto"
                        onClick={() => setIsOpen(true)}
                    >
                        <span className="text-[#000000] text-sm font-normal">Chiedi all'IA</span>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBox;