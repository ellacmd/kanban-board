import addIcon from '../assets/icon-add-task-mobile.svg';
import addIconGray from '../assets/icon-add-task-mobile gray.svg';
import showIcon from '../assets/icon-show-sidebar.svg';
import Column from './Column';

interface ContentProps {
    onShow: () => void;
    show: boolean;
}

const Content = ({ onShow, show }: ContentProps) => {
    return (
        <main
            className={`dark:bg-dark-secondary bg-soft-light min-h-[87vh] flex-1
            transition-[margin] duration-300 ease-in-out mt-[96px] overflow-scroll
            ${show ? 'ml-[300px]' : 'ml-0'}`}>
            {!show && (
                <button
                    onClick={onShow}
                    className='bg-primary rounded-r-full w-fit p-4 fixed bottom-6 
                        hover:bg-primary-light transition-colors'>
                    <img src={showIcon} alt='show sidebar' />
                </button>
            )}
            <div className='min-h-full '>
                {/* <div className='flex items-center justify-center'> */}
                {/* <div>
                    <p className='text-gray-light'>
                        This board is empty. Create a new column to get started.
                    </p>
                    <button
                        className='text-white bg-primary hover:bg-primary-light 
                        transition-colors flex items-center rounded-full px-6 py-4 
                        gap-2 font-bold mx-auto mt-8'>
                        <img src={addIcon} alt='add icon' />
                        Add New Column
                    </button>
                </div> */}
                {/* </div> */}

                <div className='flex justify-start gap-4 p-6'>
                    <Column />
                    <Column />
                    <div
                        className='h-[550px] mt-12 rounded-lg   w-[280px]  text-gray-light font-bold flex justify-center text-3xl
                    
                    bg-gradient-to-b from-[#AFB6B9]/20 via-[#AFB6B9]/10 to-[#AFB6B9]/0
                  
                  '>
                        {' '}
                        <button className='flex items-center gap-4'>
                            <img src={addIconGray} alt='' /> New Column
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Content;
