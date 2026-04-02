import Sidebar from "./sidebar";
const Layout = ({ children }) => {
    return (
        <div className="h-[100vh] w-[100vw] overflow-hidden bg-[#2A7BB3] flex py-[1rem] pr-[1rem]">
            <aside className="w-[5vw]">
                <Sidebar />
            </aside>
            <div className="bg-white w-[95vw] flex justify-center p-[1vw] rounded-[30px] overflow-hidden">
                {children}
            </div>
        </div>
    );
};
export default Layout;