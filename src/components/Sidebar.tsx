import boardIcon from '../assets/icon-board.svg';
import plusIcon from '../assets/icon-add-task-mobile purple.svg';
import purpleBoardIcon from '../assets/icon-board purple.svg';
import whiteBoardIcon from '../assets/icon-board white.svg';
import hideIcon from '../assets/icon-hide-sidebar.svg';
import lightIcon from '../assets/icon-light-theme.svg';
import darkIcon from '../assets/icon-dark-theme.svg';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className='pr-6 pb-8 max-w-[298px] bg-white dark:bg-gray-dark text-gray-light flex flex-col min-h-[87vh] justify-between '>
            <div className=' flex flex-col   gap-[14px] py-6   font-semibold '>
                <h3 className='pl-8 font-bold text-xs'>ALL BOARDS(3)</h3>

                <div className='flex gap-4 items-center pl-8 bg-primary text-white py-[14px] rounded-r-full '>
                    <img src={whiteBoardIcon} alt='' />
                    <h3 className=''>Platform Launch</h3>
                </div>
                <div className='flex gap-4 items-center pl-8 py-[14px]'>
                    <img src={boardIcon} alt='' />
                    <h3 className=''>Marketing Plan</h3>
                </div>
                <div className='flex gap-4 items-center pl-8'>
                    <img src={boardIcon} alt='' />
                    <h3 className=''>Roadmap</h3>
                </div>
                <div className='flex gap-4 items-center pl-8 py-[14px]'>
                    <img src={purpleBoardIcon} alt='' />
                    <h3 className=' flex items-center gap-2 text-primary  '>
                        <img src={plusIcon} alt='' /> Create New Board
                    </h3>
                </div>
            </div>

            <div className='pl-6  flex flex-col  gap-6  '>
                <div className='flex items-center justify-center gap-6 bg-soft-light dark:bg-dark-secondary p-4 rounded-sm'>
                    <img src={lightIcon} alt='' />

                    <div
                        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer 
                  bg-primary`}
                        onClick={() => toggleTheme()}>
                        <div
                            className={`w-6 h-6 bg-white rounded-full shadow-md transform duration-300
                    ${
                        theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                    }`}></div>
                    </div>

                    <img src={darkIcon} alt='' />
                </div>
                <div className='font-medium flex gap-4 items-center'>
                    <img src={hideIcon} alt='' />
                    Hide Sidebar
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
