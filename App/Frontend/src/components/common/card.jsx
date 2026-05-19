import SvgIcon from "../../assets/icons/svgIcon";
import { useAuth } from "../../hooks/useAuth";

const Card = ({ title, value, subtitle, bgColor, iconPath, iconPath2, size = 'large', className }) => {
    const { user } = useAuth();

    const sizes = {
        small: {
            title: 'text-[0.6vw]',   
            value: 'text-[1.3vw]',   
            subtitle: 'text-[1.3vh]',
            iconContainer: 'w-[2.5vw] h-[5vh]', 
            iconWidth: '1.3vw',
            padding: 'p-[1vw]'              
        },
        large: {
            title: 'text-[1rem] xl:text-[1vw]',           
            value: 'text-[1.5rem] xl:text-[1.5vw]',           
            subtitle: 'text-[0.7vw]',      
            iconContainer: 'w-[4rem] xl:w-[4vw] h-[4.2rem] xl:h-[4.5vw]',
            iconWidth: '50%',
            padding: 'p-[1vw]'
        }
    };

    const currentSize = sizes[size] || sizes.large;

    return (
        <div className={`w-full flex ${user.livello !== 0 ? 'flex-col' : 'items-center'} bg-${bgColor} bg-opacity-40 rounded-[30px] ${currentSize.padding} h-auto ${className || ''}`}>
            {user.livello !== 0 && (
                <p className={`text-[#777777] font-bold -mb-[0.5vh] ${currentSize.title}`}>
                    {title}
                </p>
            )}
            <div className={`flex justify-center h-full ${user.livello !== 0 ? 'flex justify-between h-full items-center space-x-[1rem]' : ''}`}>
            <div className="flex flex-col justify-center h-full">
                {user.livello === 0 && (
                    <p className={`text-[#777777] font-bold -mb-[0.5vh] ${currentSize.title}`}>
                        {title}
                    </p>
                )}
                <p className={`font-black ${currentSize.value}`}>
                    {value}
                </p>
                {subtitle && (
                    <p className={`text-[#777777] font-normal -mt-[0.5vh] ${currentSize.subtitle} hidden xl:block`}>
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
                    translate={false}
                />
            </div>
            </div>
        </div>
    );
};

export default Card;