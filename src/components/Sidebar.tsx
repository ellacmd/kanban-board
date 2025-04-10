import boardIcon from '../assets/icon-board.svg';
import plusIcon from '../assets/icon-add-task-mobile purple.svg';
import purpleBoardIcon from '../assets/icon-board purple.svg';
import whiteBoardIcon from '../assets/icon-board white.svg';
import hideIcon from '../assets/icon-hide-sidebar.svg';
import lightIcon from '../assets/icon-light-theme.svg';
import darkIcon from '../assets/icon-dark-theme.svg';
import { useTheme } from '../context/ThemeContext';
import { useBoard } from '../context/BoardContext';

interface SidebarProps {
    onHide: () => void;
    show: boolean;
    onCreateBoard: () => void;
}

const Sidebar = ({ onHide, show, onCreateBoard }: SidebarProps) => {
    const { theme, toggleTheme } = useTheme();
    const { boards, currentBoard, setCurrentBoard, isLoading } = useBoard();

    return (
        <aside
            className={`pr-4 sm:pr-6 pb-8 w-[260px] sm:w-[300px] bg-white dark:bg-gray-dark text-gray-light 
            fixed top-[96px] left-0 transition-transform duration-300 ease-in-out z-20
            ${
                show ? 'translate-x-0' : '-translate-x-full'
            } sm:flex sm:flex-col sm:min-h-[87vh] sm:justify-between`}>
            <div className='flex flex-col gap-[14px] py-6 font-semibold '>
                <h3 className='pl-4 sm:pl-8 font-bold text-xs'>
                    ALL BOARDS ({isLoading ? '...' : boards.length})
                </h3>

                {isLoading ? (
                    <div className='space-y-2 px-4 sm:px-8'>
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className='h-10 bg-gray-200 dark:bg-gray-700 rounded-r-full animate-pulse'
                            />
                        ))}
                    </div>
                ) : (
                    <>
                        {boards.map((board, index) => (
                            <div
                                key={index}
                                onClick={() => setCurrentBoard(board)}
                                className={`cursor-pointer flex gap-4 items-center pl-4 sm:pl-8 py-[14px] rounded-r-full
                                    ${
                                        currentBoard?.name === board.name
                                            ? 'bg-primary text-white'
                                            : ''
                                    }`}>
                                <img
                                    src={
                                        currentBoard?.name === board.name
                                            ? whiteBoardIcon
                                            : boardIcon
                                    }
                                    alt='board icon'
                                    className='w-4 h-4 sm:w-auto sm:h-auto'
                                />
                                <h3 className='text-sm sm:text-base truncate'>
                                    {board.name}
                                </h3>
                            </div>
                        ))}

                        <button
                            onClick={onCreateBoard}
                            className='flex gap-4 items-center pl-4 sm:pl-8 py-[14px] hover:bg-gray-100 
                                dark:hover:bg-dark-primary transition-colors rounded-r-full'>
                            <img
                                src={purpleBoardIcon}
                                alt=''
                                className='w-4 h-4 sm:w-auto sm:h-auto'
                            />
                            <h3 className='flex items-center gap-2 text-primary text-sm sm:text-base'>
                                <img
                                    src={plusIcon}
                                    alt=''
                                    className='w-4 h-4 sm:w-auto sm:h-auto'
                                />{' '}
                                Create New Board
                            </h3>
                        </button>
                    </>
                )}
            </div>

            <div className='pl-4 sm:pl-6 flex flex-col gap-6'>
                <div className='flex items-center justify-center gap-4 sm:gap-6 bg-soft-light dark:bg-dark-secondary p-4 rounded-sm'>
                    <img
                        src={lightIcon}
                        alt=''
                        className='w-4 h-4 sm:w-auto sm:h-auto'
                    />
                    <div
                        className='w-12 sm:w-14 h-6 sm:h-8 flex items-center rounded-full p-1 cursor-pointer bg-primary'
                        onClick={toggleTheme}>
                        <div
                            className={`w-4 sm:w-6 h-4 sm:h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
                                ${
                                    theme === 'dark'
                                        ? 'translate-x-6'
                                        : 'translate-x-0'
                                }`}></div>
                    </div>
                    <img
                        src={darkIcon}
                        alt=''
                        className='w-4 h-4 sm:w-auto sm:h-auto'
                    />
                </div>
                <button
                    className='font-medium flex gap-4 items-center hover:text-primary transition-colors text-sm sm:text-base'
                    onClick={onHide}>
                    <img
                        src={hideIcon}
                        alt=''
                        className='w-4 h-4 sm:w-auto sm:h-auto'
                    />
                    Hide Sidebar
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
