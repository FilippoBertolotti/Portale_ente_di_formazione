import SvgIcon from "../../assets/icons/svgIcon";

const Card = ({ title, value, subtitle, iconPath, width, bgColor}) => {
    return (
        <div className={`flex justify-between items-center bg-${bgColor} bg-opacity-40 rounded-[30px] p-[2vh] ${width ? width : 'w-[20%]'} h-auto`}>
            <div className="flex flex-col h-full">
                <p className='text-[#777777] text-[2vh] font-bold -mb-[0.5vh]'>{title}</p>
                <p className='text-[3vh] font-black '>{value}</p>
                {subtitle && <p className='text-[#777777] text-[1.7vh] font-normal -mt-[0.5vh]'>{subtitle}</p>}
            </div>
            <div className={`rounded-[30px] bg-${bgColor} w-[4vw] h-[4.5vw] flex items-center justify-center`}>
              <SvgIcon
                width="50%"
                path1={iconPath}
                color='white'
              />
            </div>
        </div>
    );
};

export default Card;
