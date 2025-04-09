import logoDark from '../assets/logo-dark.svg';
import logo from '../assets/logo-light.svg';
import addIcon from '../assets/icon-add-task-mobile.svg';
import hamburgerIcon from '../assets/icon-vertical-ellipsis.svg';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import AddTaskModal from './AddTaskModal';

const Header = () => {
    const { theme } = useTheme();
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);

    return (
        <>
            <header className='w-full bg-white dark:bg-gray-dark flex items-center h-[96px] fixed left-0 '>
                {theme === 'light' ? (
                    <img
                        src={logoDark}
                        alt=''
                        className='pr-[113px] pl-[32px] '
                    />
                ) : (
                    <img src={logo} alt='' className='pr-[113px] pl-[32px] ' />
                )}
                {/* <span className='align-stretch bg-gray-light dark:bg-soft-light w-[1px] h-[96px]'></span> */}

                <div className='pl-[24px] pr-[32px] py-[37px] flex justify-between w-full items-center'>
                    <h1 className='text-2xl dark:text-[#fff] text-[#000]'>
                        Platform Launch
                    </h1>
                    <div className='flex items-center gap-10'>
                        <button
                            onClick={() => setShowAddTaskModal(true)}
                            className='text-white bg-primary flex items-center rounded-full px-6 py-4 gap-2 font-bold hover:bg-primary-light transition-colors'>
                            <img src={addIcon} alt='' />
                            Add New Task
                        </button>
                        <img
                            src={hamburgerIcon}
                            alt=''
                            className='cursor-pointer'
                        />
                    </div>
                </div>
            </header>

            {showAddTaskModal && (
                <AddTaskModal onClose={() => setShowAddTaskModal(false)} />
            )}
        </>
    );
};

export default Header;
