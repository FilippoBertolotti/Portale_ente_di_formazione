const Container = ({ title, button, className, children }) => {
    return (
        <div className={`flex flex-col w-full bg-[#F5F7F9] border border-[#E0E6EB] rounded-[30px] p-[2vh] gap-[2vh] ` + (className ? className : '')}>
            {(title || button) && (
                <div className="flex justify-between items-start shrink-0">
                    {title && <span className='text-black text-[2vh] font-bold'>{title}</span>}
                    {button && button}
                </div>
            )}
            {children}
        </div>
    );
};

export default Container;