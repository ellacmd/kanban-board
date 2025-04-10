import { useState } from 'react';
import { useBoard } from '../context/BoardContext';
import { boardService } from '../services/boardService';
import toast from 'react-hot-toast';

interface AddColumnModalProps {
    onClose: () => void;
}

const AddColumnModal = ({ onClose }: AddColumnModalProps) => {
    const { currentBoard, refreshBoards, setCurrentBoard } = useBoard();
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [nameError, setNameError] = useState('');

    const validateName = (value: string) => {
        if (!value.trim()) {
            setNameError("Can't be empty");
            return false;
        }
        setNameError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateName(name)) {
            return;
        }

        setIsLoading(true);
        try {
            if (!currentBoard) throw new Error('No board selected');

            const newColumn = await boardService.createColumn(currentBoard.id, {
                name: name.trim(),
                order: currentBoard.columns.length,
            });

            if (currentBoard) {
                const updatedBoard = {
                    ...currentBoard,
                    columns: [
                        ...currentBoard.columns,
                        { ...newColumn, tasks: [] },
                    ],
                };
                setCurrentBoard(updatedBoard);
            }

            await refreshBoards();
            toast.success('Column created successfully');
            onClose();
        } catch (error) {
            console.error('Failed to create column:', error);
            toast.error('Failed to create column');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white dark:bg-dark-secondary rounded-md p-6 w-full max-w-md'>
                <h2 className='text-lg font-bold dark:text-white mb-6'>
                    Add New Column
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className='space-y-1'>
                        <label className='text-sm font-bold text-gray-light dark:text-white'>
                            Name
                        </label>
                        <input
                            type='text'
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (nameError) validateName(e.target.value);
                            }}
                            onBlur={(e) => validateName(e.target.value)}
                            className={`w-full px-4 py-2 rounded-md border ${
                                nameError
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-light dark:border-gray-dark focus:border-primary'
                            } bg-transparent dark:text-white outline-none transition-colors`}
                            placeholder='e.g. In Progress'
                            disabled={isLoading}
                        />
                        {nameError && (
                            <p className='text-red-500 text-sm'>{nameError}</p>
                        )}
                    </div>

                    <div className='flex gap-4 mt-6'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='flex-1 px-4 py-2 bg-gray-100 dark:bg-dark-primary text-gray-light dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-dark transition-colors'
                            disabled={isLoading}>
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='flex-1 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-light transition-colors disabled:opacity-50'
                            disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Column'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddColumnModal;
