import ChatBox from './chatBox';
import UserCard from './userCard';

const Header = ({
    user,
    title,
    subtitle
}) => {
    return (
        <div className="relative flex items-center w-full justify-between mb-[2vh]">
          <div>
            <h1 className="text-[4.5vh] font-bold text-black">{title}</h1>
            <p className="text-[#777777] font-bold text-[2.5vh] -mt-[1rem]">{subtitle}</p>
          </div>
          <ChatBox />
          <div className="w-[14%]">
            {user && <UserCard user={user} />}
          </div>
        </div>
    );
};

export default Header;