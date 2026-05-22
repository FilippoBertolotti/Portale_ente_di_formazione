import ChatBox from './chatBox';
import UserCard from './userCard';

const Header = ({
    user,
    title,
    subtitle
}) => {
    return (
        <div className="relative flex items-center w-full justify-between xl:mb-[2vh]">
          <div>
            <h1 className="text-[2.3rem] lg:text-[2.8rem] font-bold text-black">{title}</h1>
            <p className="text-[#777777] font-bold text-[1.2rem] lg:text-[1.6rem] -mt-[0.5rem] md:-mt-[1rem]">{subtitle}</p>
          </div>
              <ChatBox />
          <div className="fit-content">
            {user && <UserCard user={user} />}
          </div>
        </div>
    );
};

export default Header;