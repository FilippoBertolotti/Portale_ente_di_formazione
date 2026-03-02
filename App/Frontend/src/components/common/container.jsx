const Container = ({ title, button, className, children}) => {
    return (
        <div className={`flex flex-col w-full bg-[#F5F7F9] border border[#E0E6EB] rounded-[30px] p-[2vh] space-y-[2vh] ` + (className ? ` ` + className : ` `)}>
            <div className="flex justify-between items-start shrink-0">
                {title && <span className='text-black text-[2vh] font-bold'>{title}</span>}
                {button && button}
            </div>
            <div className="flex-1 min-h-0">
              {children}
            </div>
        </div>
    );
};

export default Container;