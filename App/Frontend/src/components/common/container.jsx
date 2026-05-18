const Container = ({ title, button, className, children, hide = false }) => {
    return (
        <div className={`${hide ? 'xl:bg-[#F5F7F9] xl:border xl:border-[#E0E6EB] xl:rounded-[30px] xl:p-[1vw] xl:gap-[1vw]' : 'bg-[#F5F7F9] border border-[#E0E6EB] rounded-[30px] p-[1vw] gap-[1vw]'} flex flex-col w-full ` + (className ? className : '')}>
            {(title || button) && (
                <div className="flex justify-between items-start shrink-0">
                    {title && <span className={`text-black text-[1rem] font-bold ${!hide ? '' : 'hidden xl:inline-block'}`}>{title}</span>}
                    {button && button}
                </div>
            )}
            {children}
        </div>
    );
};

export default Container;