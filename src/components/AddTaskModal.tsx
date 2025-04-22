import { useBoard } from '../context/BoardContext';
import { boardService } from '../services/boardService';
import { useState } from 'react';
import StatusDropdown from '../services/StatusDropdown';
import toast from 'react-hot-toast';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface AddTaskModalProps {
    onClose: () => void;
}

const AddTaskModal = ({ onClose }: AddTaskModalProps) => {
    const { currentBoard, setCurrentBoard, refreshBoards } = useBoard();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(currentBoard?.columns[0]?.name || '');
    const [subtasks, setSubtasks] = useState<
        Array<{ id: string; title: string; isCompleted: boolean }>
    >([]);
    const [isLoading, setIsLoading] = useState(false);
    const [titleError, setTitleError] = useState('');

    const validateTitle = (value: string) => {
        if (!value.trim()) {
            setTitleError("Can't be empty");
            return false;
        }
        setTitleError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateTitle(title)) {
            return;
        }

        setIsLoading(true);
        try {
            const targetColumn = currentBoard?.columns.find(
                (col) => col.name === status
            );
            if (!targetColumn) {
                toast.error('Invalid status selected');
                return;
            }

            const newTask = await boardService.createTask(targetColumn.id, {
                title,
                description,
                status,
                order: 0,
                column_id: targetColumn.id,
            });

            if (subtasks.length > 0) {
                const subtaskPromises = subtasks.map((subtask) =>
                    supabase.from('subtasks').insert({
                        task_id: newTask.id,
                        title: subtask.title,
                        is_completed: subtask.isCompleted,
                    })
                );
                await Promise.all(subtaskPromises);
            }

            if (currentBoard) {
                const updatedBoard = {
                    ...currentBoard,
                    columns: currentBoard.columns.map((column) => {
                        if (column.id === targetColumn.id) {
                            return {
                                ...column,
                                tasks: [
                                    ...column.tasks,
                                    { ...newTask, subtasks },
                                ],
                            };
                        }
                        return column;
                    }),
                };
                setCurrentBoard(updatedBoard);
            }

            await refreshBoards();
            toast.success('Task created successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to create task');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSubtask = () => {
        setSubtasks([
            ...subtasks,
            {
                id: crypto.randomUUID(),
                title: '',
                isCompleted: false,
            },
        ]);
    };

    const handleRemoveSubtask = (index: number) => {
        setSubtasks(subtasks.filter((_, i) => i !== index));
    };

    const handleSubtaskChange = (index: number, value: string) => {
        setSubtasks(
            subtasks.map((subtask, i) =>
                i === index ? { ...subtask, title: value } : subtask
            )
        );
    };

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white dark:bg-gray-dark rounded-lg p-6 w-[480px] max-h-[90vh] overflow-y-auto'>
                <h2 className='text-xl font-bold dark:text-white mb-6'>
                    Add New Task
                </h2>
                <form >
                    <div className='mb-6'>
                        <label
                            htmlFor='title'
                            className='block text-sm font-bold text-gray-light mb-2 dark:text-white'>
                            Title
                        </label>
                        <input
                            type='text'
                            id='title'
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (titleError) validateTitle(e.target.value);
                            }}
                            onBlur={(e) => validateTitle(e.target.value)}
                            className={`w-full p-2 border ${
                                titleError
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-light dark:border-gray-dark focus:border-primary'
                            } rounded-lg dark:bg-dark-secondary dark:text-white`}
                            placeholder='e.g. Take coffee break'
                            disabled={isLoading}
                        />
                        {titleError && (
                            <p className='text-red-500 text-sm'>{titleError}</p>
                        )}
                    </div>

                    <div className='mb-6'>
                        <label
                            htmlFor='description'
                            className='block text-sm font-bold text-gray-light mb-2 dark:text-white'>
                            Description
                        </label>
                        <textarea
                            id='description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className='w-full p-2 border border-gray-light rounded-lg dark:bg-dark-secondary dark:text-white dark:border-gray-dark'
                            rows={4}
                            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
                            disabled={isLoading}
                        />
                    </div>

                    <div className='mb-6'>
                        <label
                            htmlFor='status'
                            className='block text-sm font-bold text-gray-light mb-2 dark:text-white'>
                            Status
                        </label>
                        <StatusDropdown
                            value={status}
                            onChange={setStatus}
                            options={
                                currentBoard?.columns.map(
                                    (column) => column.name
                                ) || []
                            }
                        />
                    </div>

                    <div className='mb-6'>
                        <label className='block text-sm font-bold text-gray-light mb-2 dark:text-white'>
                            Subtasks
                        </label>
                        <div className='space-y-2'>
                            {subtasks.map((subtask, index) => (
                                <div
                                    key={index}
                                    className='flex items-center gap-3'>
                                    <input
                                        type='text'
                                        value={subtask.title}
                                        onChange={(e) =>
                                            handleSubtaskChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        className='flex-1 p-2 border border-gray-light rounded-lg dark:bg-dark-secondary dark:text-white dark:border-gray-dark'
                                        placeholder='e.g. Make coffee'
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type='button'
                                        onClick={() =>
                                            handleRemoveSubtask(index)
                                        }
                                        className='text-gray-light hover:text-danger'
                                        disabled={isLoading}>
                                        <svg
                                            width='15'
                                            height='15'
                                            xmlns='http://www.w3.org/2000/svg'>
                                            <g
                                                fill='currentColor'
                                                fillRule='evenodd'>
                                                <path d='m12.728 0 2.122 2.122L2.122 14.85 0 12.728z' />
                                                <path d='M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z' />
                                            </g>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type='button'
                            onClick={handleAddSubtask}
                            className='w-full mt-3 p-2 bg-soft-light dark:bg-white text-primary font-bold rounded-full hover:bg-[#d8d7f1] transition-colors'
                            disabled={isLoading}>
                            + Add New Subtask
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
                            onClick={handleSubmit}
                            className='flex-1 p-2 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-colors'
                            disabled={isLoading}>
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;
