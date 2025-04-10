import { useState } from 'react';
import { useBoard } from '../context/BoardContext';
import { boardService } from '../services/boardService';
import toast from 'react-hot-toast';

interface DeleteBoardModalProps {
    onClose: () => void;
}

const DeleteBoardModal: React.FC<DeleteBoardModalProps> = ({ onClose }) => {
    const { currentBoard, refreshBoards } = useBoard();
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        if (!currentBoard) return;

        setIsLoading(true);
        try {
            await boardService.deleteBoard(currentBoard.id);
            await refreshBoards();
            toast.success('Board deleted successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to delete board');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white dark:bg-dark-secondary rounded-lg p-6 w-full max-w-md'>
                <h2 className='text-xl font-bold text-red-500 mb-4'>
                    Delete Board
                </h2>
                <p className='text-gray-dark dark:text-white mb-6'>
                    Are you sure you want to delete the board "
                    {currentBoard?.name}"? This action cannot be undone.
                </p>
                <div className='flex justify-between gap-4'>
                    <button
                        type='button'
                        onClick={onClose}
                        className='flex-1 px-4 py-2 bg-[#635fc740] text-primary rounded-full 
                                hover:bg-[#635fc7]/25 transition-colors flex-1 '
                        disabled={isLoading}>
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className='px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 
                            transition-colors disabled:opacity-50  flex-1   '
                        disabled={isLoading}>
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteBoardModal;
