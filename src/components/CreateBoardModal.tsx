import { useState } from 'react';
import { boardService } from '../services/boardService';
import { useBoard } from '../context/BoardContext';
import toast from 'react-hot-toast';
import plusIcon from '../assets/icon-add-task-mobile purple.svg';
import crossIcon from '../assets/icon-cross.svg';

interface Column {
    name: string;
}

interface CreateBoardModalProps {
    onClose: () => void;
}

const CreateBoardModal = ({ onClose }: CreateBoardModalProps) => {
    const { refreshBoards } = useBoard();
    const [name, setName] = useState('');
    const [columns, setColumns] = useState<Column[]>([
        { name: 'Todo' },
        { name: 'Doing' },
        { name: 'Done' },
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Board name is required');
            return;
        }

        if (!columns.length) {
            toast.error('Add at least one column');
            return;
        }

        if (columns.some((col) => !col.name.trim())) {
            toast.error('Column names cannot be empty');
            return;
        }

        setIsLoading(true);
        try {
            await boardService.createBoard(name, columns);
            await refreshBoards();
            toast.success('Board created successfully');
            onClose();
        } catch (error) {
            console.error('Failed to create board:', error);
            toast.error('Failed to create board');
        } finally {
            setIsLoading(false);
        }
    };

    const addColumn = () => {
        if (columns.length >= 5) {
            toast.error('Maximum 5 columns allowed');
            return;
        }
        setColumns([...columns, { name: '' }]);
    };

    const removeColumn = (index: number) => {
        setColumns(columns.filter((_, i) => i !== index));
    };

    const updateColumnName = (index: number, name: string) => {
        const newColumns = [...columns];
        newColumns[index].name = name;
        setColumns(newColumns);
    };

    return (
        <div className='fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-[100] overflow-y-auto'>
            <div className='bg-white dark:bg-dark-secondary rounded-lg p-6 w-full max-w-md mt-24'>
                <h3 className='text-lg font-bold mb-6 dark:text-white'>
                    Create New Board
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className='mb-6'>
                        <label className='block text-gray-dark dark:text-white text-sm font-bold mb-2'>
                            Board Name
                        </label>
                        <input
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='e.g. Web Design'
                            className='w-full px-4 py-2 rounded border border-gray-200 
                                dark:bg-dark-primary dark:border-gray-600 dark:text-white
                                focus:outline-none focus:ring-2 focus:ring-primary'
                            disabled={isLoading}
                        />
                    </div>

                    <div className='mb-6'>
                        <label className='block text-gray-dark dark:text-white text-sm font-bold mb-2'>
                            Board Columns
                        </label>
                        <div className='space-y-3'>
                            {columns.map((column, index) => (
                                <div
                                    key={index}
                                    className='flex gap-2 items-center'>
                                    <input
                                        type='text'
                                        value={column.name}
                                        onChange={(e) =>
                                            updateColumnName(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder='e.g. Todo'
                                        className='flex-1 px-4 py-2 rounded border border-gray-200 
                                            dark:bg-dark-primary dark:border-gray-600 dark:text-white
                                            focus:outline-none focus:ring-2 focus:ring-primary'
                                        disabled={isLoading}
                                    />
                                    <button
                                        type='button'
                                        onClick={() => removeColumn(index)}
                                        className='p-2 hover:bg-gray-100 dark:hover:bg-dark-primary rounded-full transition-colors'>
                                        <img
                                            src={crossIcon}
                                            alt='remove column'
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type='button'
                            onClick={addColumn}
                            className={`w-full mt-3 px-4 py-2 bg-gray-100 dark:bg-dark-primary 
                                text-primary font-bold rounded-full 
                                hover:bg-primary/10 transition-colors flex items-center justify-center gap-2
                                ${
                                    columns.length >= 5
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}
                            disabled={isLoading || columns.length >= 5}>
                            <img src={plusIcon} alt='' /> Add New Column
                        </button>
                    </div>

                    <div className='flex gap-4'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='flex-1 p-2 bg-soft-light dark:bg-white text-primary font-bold rounded-full hover:bg-[#d8d7f1] transition-colors'
                            disabled={isLoading}>
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='flex-1 px-4 py-2 bg-primary text-white rounded-full 
                                hover:bg-primary-light transition-colors disabled:opacity-50'
                            disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Board'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBoardModal;
