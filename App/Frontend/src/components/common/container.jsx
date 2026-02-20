const Container = ({ title, button, children}) => {
    return (
        <div className='flex flex-col h-full w-full bg-[#F5F7F9] border border[#E0E6EB] rounded-[30px] p-[2vh] space-y-[2vh]'>
            <div className="flex justify-between items-start">
                <span className='text-black text-[2vh] font-bold'>{title}</span>
                {button && button}
            </div>
            <div>
              {children}
            </div>
        </div>
    );
};

export default Container;