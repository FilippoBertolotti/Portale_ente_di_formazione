import Sidebar from "./sidebar";
import ChatBot from "./chatBot";
import { useAuth } from '../../hooks/useAuth';
const Layout = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <>{children}</>;
    }
    return (
        <>
            {user.livello == 0 || user.livello == 4 ? (
                <>
                    <div className="h-[100vh] w-[100vw] bg-[#FFF] md:bg-[#2A7BB3] md:pt-[1rem] md:px-[1rem] xl:hidden relative flex flex-col justify-centerrelative">

                        <div className="bg-white w-[100%] h-[100%] flex justify-center items-center p-[1vw] md:rounded-[30px] xl:overflow-hidden overflow-auto">
                            {children}
                        </div>

                        <div className="w-[100%] h-[10%] md:h-[7%] flex justify-center items-center">
                            <Sidebar />
                        </div>

                    </div>

                    <div className="h-[100vh] w-[100vw] overflow-hidden bg-[#2A7BB3] flex py-[1rem] pr-[1rem] hidden xl:flex">
                        <aside className="w-[5vw]">
                            <Sidebar />
                        </aside>
                        <div className="bg-white w-[95vw] flex justify-center p-[1vw] rounded-[30px] overflow-hidden">
                            {children}
                        </div>
                    </div>
                </>
            ) :
                user.livello >= 1 ? (
                    <div className="h-[100vh] w-[100vw] overflow-hidden bg-[#2A7BB3] flex py-[1rem] pr-[1rem] hidden xl:flex">
                        <aside className="w-[5vw]">
                            <Sidebar buttons={['calendario', 'progetti', 'aule']}/>
                        </aside>
                        <div className="flex space-x-[1rem] w-[95vw]">
                        <div className="bg-white w-[80%] flex justify-center p-[1vw] rounded-[30px] overflow-hidden">
                            {children}
                        </div>
                        <div className="w-[20%]">
                            <ChatBot />
                        </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-[100vh] w-[100vw] overflow-hidden bg-[#2A7BB3] flex py-[1rem] pr-[1rem] hidden xl:flex">
                        <aside className="w-[5vw]">
                            <Sidebar />
                        </aside>
                        <div className="bg-white w-[95vw] flex justify-center p-[1vw] rounded-[30px] overflow-hidden">
                            {children}
                        </div>
                    </div>
                )}
        </>
    );
};
export default Layout;