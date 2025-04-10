import { useState } from 'react';
import { useBoard } from '../context/BoardContext';
import Column from './Column';
import addIconGray from '../assets/icon-add-task-mobile gray.svg';
import addIconPurple from '../assets/icon-add-task-mobile purple.svg';
import showIcon from '../assets/icon-show-sidebar.svg';
import AddColumnModal from './AddColumnModal';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface ContentProps {
    onShow: () => void;
    show: boolean;
}

const Content = ({ onShow, show }: ContentProps) => {
    const { currentBoard, isLoading, error } = useBoard();
    const [showAddColumn, setShowAddColumn] = useState(false);

    return (
        <main
            className={`dark:bg-dark-secondary bg-soft-light min-h-[87vh] flex-1
            transition-[margin] duration-300 ease-in-out pt-[96px] overflow-scroll 
            ${show ? 'sm:ml-[300px]' : 'ml-0 w-full'}`}>
            {!show && (
                <button
                    onClick={onShow}
                    className='bg-primary rounded-r-full w-fit p-4 fixed bottom-6 
                        hover:bg-primary-light transition-colors '>
                    <img src={showIcon} alt='show sidebar' />
                </button>
            )}

            <div className='min-h-full p-6'>
                {isLoading ? (
                    <div className='flex gap-4'>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className='w-[280px]'>
                                <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse' />
                                <div className='space-y-4'>
                                    {[1, 2, 3].map((j) => (
                                        <div
                                            key={j}
                                            className='h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse'
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !currentBoard?.columns?.length ? (
                    <div className='flex items-center justify-center h-full translate-y-50  '>
                        <div className='text-center'>
                            <p className='text-gray-light'>
                                This board is empty. Create a new column to get
                                started.
                            </p>
                            <button
                                onClick={() => setShowAddColumn(true)}
                                className='text-white bg-primary hover:bg-primary-light 
                                    transition-colors flex items-center rounded-full px-6 py-4 
                                    gap-2 font-bold mx-auto mt-8 '>
                                Add New Column
                            </button>
                        </div>
                    </div>
                ) : (
                    <DndProvider backend={HTML5Backend}>
                        <div className='flex justify-start gap-4'>
                            {currentBoard?.columns.map((column) => (
                                <Column key={column.id} column={column} />
                            ))}
                            {currentBoard?.columns.length < 5 && (
                                <div
                                    className='h-[550px] mt-12 rounded-lg min-w-[280px] text-gray-light font-bold flex justify-center text-3xl
                                    bg-gradient-to-b from-[#BBC2C6]/30 via-[#BBC2C6]/20 to-[#BBC2C6]/0 
                                    dark:from-[#AFB6B9]/20 dark:via-[#AFB6B9]/10 dark:to-[#AFB6B9]/0'>
                                    <button
                                        onClick={() => setShowAddColumn(true)}
                                        className='flex items-center gap-4 group hover:text-primary transition-colors self-center justify-self-center'>
                                        <img
                                            src={addIconGray}
                                            alt=''
                                            className='group-hover:hidden'
                                        />
                                        <img
                                            src={addIconPurple}
                                            alt=''
                                            className='hidden group-hover:block'
                                        />
                                        New Column
                                    </button>
                                </div>
                            )}
                        </div>
                    </DndProvider>
                )}
            </div>

            {showAddColumn && (
                <AddColumnModal onClose={() => setShowAddColumn(false)} />
            )}
        </main>
    );
};

export default Content;
