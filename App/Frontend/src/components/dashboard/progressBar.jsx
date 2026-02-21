const ProgressBar = ({ title, hoursTot, hoursMade, index }) => {
    const percentage = hoursTot > 0 ? Math.floor(Math.min((hoursMade / hoursTot) * 100, 100)) : 0;
    const colors = ['#EFA134', '#76A1CF', '#9BC4E8', '#F07F13'];
    return (
        <div className="flex flex-col w-full">
            {title && <span className="mb-1 text-sm font-semibold">{title}</span>}
            <div className="grid grid-cols-9 items-center gap-x-[1vh]">
                <div className="relative flex items-center bg-white rounded-[30px] border border-[#E0E6EB] col-span-8 overflow-hidden ">
                    <span className="absolute w-[100%] z-[50] text-center font-bold text-xs">{percentage}%</span>
                    <div style={{ width: `${percentage}%`, backgroundColor: colors[index % colors.length] }} className={`h-6 rounded-l-[30px] transition-all duration-500`}>
                        &nbsp;
                    </div>
                </div>

                <div className="col-span-1 flex justify-center">
                    <p className="text-[1.5vh] text-black font-bold text-center whitespace-nowrap">{Math.floor(hoursMade)}/{hoursTot ? hoursTot : 0}h</p>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;