import Sidebar from "./sidebar";
import { useAuth } from '../../hooks/useAuth';
const Layout = ({ children }) => {
    const { user } = useAuth();

      if (!user) {
          return <>{children}</>;
      }
    return (
        <>
            <div className="h-[100vh] w-[100vw] bg-[#FFF] md:bg-[#2A7BB3] md:pt-[1rem] md:px-[1rem] lg:hidden lg:block relative flex flex-col justify-center relative">
                    
                <div className="bg-white w-[98vw] h-[100%] flex justify-center p-[1vw] md:rounded-[30px] overflow-hidden">
                    {children}
                </div>

                <div className="w-[100%] h-[10%] flex justify-center items-center">
                    <Sidebar />
                </div>
                
            </div>

            <div className="h-[100vh] w-[100vw] overflow-hidden bg-[#2A7BB3] flex py-[1rem] pr-[1rem] hidden lg:flex">
                <aside className="w-[5vw]">
                    <Sidebar />
                </aside>
                <div className="bg-white w-[95vw] flex justify-center p-[1vw] rounded-[30px] overflow-hidden">
                    {children}
                </div>
            </div>
        </>
    );
};
export default Layout;