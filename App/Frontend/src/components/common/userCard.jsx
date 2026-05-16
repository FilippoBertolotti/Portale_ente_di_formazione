import SvgIcon from "../../assets/icons/svgIcon";

const UserCard = ({ user }) => {
    const livelloText = {
        0: 'Amministratore',
        1: 'Coordinatore',
        2: 'Docente',
        3: 'Studente'
    }
    return (
        <div className="flex items-center justify-center space-x-[1rem] px-[1rem] py-[0.5rem] lg:bg-[#F5F7F9] lg:border lg:border-[#E0E6EB] rounded-[30px]">
            <div className="rounded-full bg-[#2A7BB3] w-[3.2vw] h-[3.2vw] flex items-center justify-center">
                <SvgIcon
                    width="50%"
                    path1="M15 18.3333C18.9933 18.3333 22.625 19.49 25.2966 21.12C26.63 21.9333 27.77 22.8933 28.5933 23.9367C29.4033 24.9617 30 26.1883 30 27.5C30 28.9083 29.315 30.0183 28.3283 30.81C27.395 31.56 26.1633 32.0567 24.855 32.4033C22.225 33.0983 18.715 33.3333 15 33.3333C11.285 33.3333 7.775 33.1 5.145 32.4033C3.83667 32.0567 2.605 31.56 1.67167 30.81C0.683334 30.0167 0 28.9083 0 27.5C0 26.1883 0.596667 24.9617 1.40667 23.935C2.23 22.8933 3.36833 21.935 4.70333 21.1183C7.375 19.4917 11.0083 18.3333 15 18.3333ZM15 0C17.2101 0 19.3298 0.877974 20.8925 2.44078C22.4554 4.00358 23.3333 6.1232 23.3333 8.33333C23.3333 10.5435 22.4554 12.6631 20.8925 14.2259C19.3298 15.7887 17.2101 16.6667 15 16.6667C12.7899 16.6667 10.6702 15.7887 9.10744 14.2259C7.54464 12.6631 6.66667 10.5435 6.66667 8.33333C6.66667 6.1232 7.54464 4.00358 9.10744 2.44078C10.6702 0.877974 12.7899 0 15 0Z"
                    color="#FFFFFF"
                />
            </div>
            <div className="hidden lg:block">
                <p className="text-[1rem] text-black font-bold">{user.nome}</p>
                <p className="text-[#777777] text-[1rem] font-bold">{livelloText[user.livello]}</p>
            </div>
        </div>
    );
};

export default UserCard;