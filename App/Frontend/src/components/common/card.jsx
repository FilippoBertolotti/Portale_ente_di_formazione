import SvgIcon from "../../assets/icons/svgIcon";

const Card = ({ title, value, subtitle, bgColor, iconPath, iconPath2, size = 'large' }) => {
    
    const sizes = {
        small: {
            title: 'text-[1.5vh]',   
            value: 'text-[2.3vh]',   
            subtitle: 'text-[1.3vh]',
            iconContainer: 'w-[4.5vh] h-[5vh]', 
            iconWidth: '50%',
            padding: 'p-[1.5vh]'              
        },
        large: {
            title: 'text-[2vh]',           
            value: 'text-[3vh]',           
            subtitle: 'text-[1.7vh]',      
            iconContainer: 'w-[4vw] h-[4.5vw]',
            iconWidth: '50%',
            padding: 'p-[2vh]'
        }
    };

    const currentSize = sizes[size] || sizes.large;

    return (
        <div className={`w-full flex justify-between items-center bg-${bgColor} bg-opacity-40 rounded-[30px] ${currentSize.padding} h-auto`}>
            <div className="flex flex-col h-full">
                <p className={`text-[#777777] font-bold -mb-[0.5vh] ${currentSize.title}`}>
                    {title}
                </p>
                <p className={`font-black ${currentSize.value}`}>
                    {value}
                </p>
                {subtitle && (
                    <p className={`text-[#777777] font-normal -mt-[0.5vh] ${currentSize.subtitle}`}>
                        {subtitle}
                    </p>
                )}
            </div>
            <div className={`rounded-[30px] bg-${bgColor} ${currentSize.iconContainer} flex items-center justify-center`}>
                <SvgIcon
                    width={currentSize.iconWidth}
                    path1={iconPath}
                    path2={iconPath2}
                    color='white'
                />
            </div>
        </div>
    );
};

export default Card;