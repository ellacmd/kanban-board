import { useState, useRef, useEffect } from 'react';
import logoDark from '../assets/logo-dark.svg';
import logo from '../assets/logo-light.svg';
import addIcon from '../assets/icon-add-task-mobile.svg';
import menuIcon from '../assets/icon-vertical-ellipsis.svg';
import chevronDown from '../assets/icon-chevron-down.svg';
import boardIcon from '../assets/icon-board.svg';
import { useTheme } from '../context/ThemeContext';
import { useBoard } from '../context/BoardContext';
import AddTaskModal from './AddTaskModal';
import DeleteBoardModal from './DeleteBoardModal';
import EditBoardModal from './EditBoardModal';
import CreateBoardModal from './CreateBoardModal';
import lightIcon from '../assets/icon-light-theme.svg';
import darkIcon from '../assets/icon-dark-theme.svg';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { currentBoard, boards, setCurrentBoard } = useBoard();
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showBoardMenu, setShowBoardMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const boardMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setShowMenu(false);
            }
            if (
                boardMenuRef.current &&
                !boardMenuRef.current.contains(event.target as Node)
            ) {
                setShowBoardMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <header className='w-full bg-white dark:bg-gray-dark flex items-center h-[96px] fixed left-0 z-40'>
                <div className='hidden sm:block'>
                    {theme === 'light' ? (
                        <img
                            src={logoDark}
                            alt=''
                            className='pr-4 sm:pr-[113px] pl-4 sm:pl-8 w-24 sm:w-auto'
                        />
                    ) : (
                        <img
                            src={logo}
                            alt=''
                            className='pr-4 sm:pr-[113px] pl-4 sm:pl-8 w-24 sm:w-auto'
                        />
                    )}
                </div>

                <div className='flex-1 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6'>
                    <div className='relative' ref={boardMenuRef}>
                        <button
                            onClick={() => setShowBoardMenu(!showBoardMenu)}
                            className='flex items-center gap-2 group'>
                            <h1 className='text-lg sm:text-2xl dark:text-white text-gray-dark font-bold truncate max-w-[200px] sm:max-w-none'>
                                {currentBoard?.name || 'No Board Selected'}
                            </h1>
                            <img
                                src={chevronDown}
                                alt=''
                                className={` transition-transform ${
                                    showBoardMenu ? 'rotate-180' : ''
                                } sm:hidden`}
                            />
                        </button>

                        {showBoardMenu && (
                            <div className='absolute top-full left-0 mt-2 w-64 bg-white dark:bg-dark-secondary rounded-lg shadow-lg z-50 sm:hidden'>
                                <div className='p-4'>
                                    <h3 className='text-sm font-bold text-gray-500 dark:text-gray-400 mb-2'>
                                        ALL BOARDS ({boards?.length || 0})
                                    </h3>
                                    <div className='space-y-2'>
                                        {boards?.map((board) => (
                                            <button
                                                key={board.id}
                                                onClick={() => {
                                                    setCurrentBoard(board);
                                                    setShowBoardMenu(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 rounded-r-full flex items-center gap-3
                                                    ${
                                                        currentBoard?.id ===
                                                        board.id
                                                            ? 'bg-primary text-white'
                                                            : 'text-gray-dark dark:text-white hover:bg-gray-100 dark:hover:bg-dark-primary'
                                                    }`}>
                                                <img src={boardIcon} alt='' />
                                                {board.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowBoardMenu(false);
                                        setShowCreateModal(true);
                                    }}
                                    className='w-full text-left px-4 py-2 rounded-r-full flex items-center gap-3 text-primary hover:bg-gray-100 
                                        dark:hover:bg-dark-primary transition-colors'>
                                    <img src={boardIcon} alt='' />+ Create New
                                    Board
                                </button>
                                <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
                                    <div className='flex items-center justify-center gap-4 bg-soft-light dark:bg-dark-secondary p-4 rounded-sm'>
                                        <img
                                            src={lightIcon}
                                            alt=''
                                            className='w-4 h-4'
                                        />
                                        <div
                                            className='w-12 h-6 flex items-center rounded-full p-1 cursor-pointer bg-primary'
                                            onClick={toggleTheme}>
                                            <div
                                                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300
                                                    ${
                                                        theme === 'dark'
                                                            ? 'translate-x-6'
                                                            : 'translate-x-0'
                                                    }`}></div>
                                        </div>
                                        <img
                                            src={darkIcon}
                                            alt=''
                                            className='w-4 h-4'
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='flex items-center gap-4 sm:gap-6'>
                        <button
                            onClick={() => setShowAddTaskModal(true)}
                            className='text-white bg-primary flex items-center rounded-full px-3 sm:px-6 py-2 sm:py-4 gap-2 font-bold 
                                hover:bg-primary-light transition-colors disabled:opacity-50 text-sm sm:text-base'
                            disabled={!currentBoard}>
                            <img
                                src={addIcon}
                                alt=''
                                className=' sm:w-auto sm:h-auto'
                            />
                            <span className='hidden sm:inline'>
                                Add New Task
                            </span>
                        </button>

                        <div className='relative' ref={menuRef}>
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className='p-2 hover:bg-gray-100 dark:hover:bg-dark-primary rounded-full transition-colors'
                                disabled={!currentBoard}>
                                <img
                                    src={menuIcon}
                                    alt='menu'
                                    className='sm:w-auto sm:h-auto'
                                />
                            </button>

                            {showMenu && currentBoard && (
                                <div className='absolute top-full right-0 mt-2 w-48 bg-white dark:bg-dark-secondary rounded-lg shadow-lg z-50'>
                                    <button
                                        onClick={() => {
                                            setShowMenu(false);
                                            setShowEditModal(true);
                                        }}
                                        className='w-full text-left px-4 py-2 text-gray-dark dark:text-white hover:bg-gray-100 
                                            dark:hover:bg-dark-primary transition-colors rounded-t-lg text-sm sm:text-base'>
                                        Edit Board
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowMenu(false);
                                            setShowDeleteModal(true);
                                        }}
                                        className='w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 
                                            dark:hover:bg-dark-primary transition-colors rounded-b-lg text-sm sm:text-base'>
                                        Delete Board
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {showAddTaskModal && (
                <AddTaskModal onClose={() => setShowAddTaskModal(false)} />
            )}

            {showDeleteModal && (
                <DeleteBoardModal
                    onClose={() => {
                        setShowDeleteModal(false);
                        if (boards && boards.length > 0) {
                            setCurrentBoard(boards[0]);
                        }
                    }}
                />
            )}

            {showEditModal && (
                <EditBoardModal onClose={() => setShowEditModal(false)} />
            )}

            {showCreateModal && (
                <CreateBoardModal onClose={() => setShowCreateModal(false)} />
            )}
        </>
    );
};

export default Header;
