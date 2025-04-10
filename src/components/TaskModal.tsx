import { Task } from '../types';
import menuIcon from '../assets/icon-vertical-ellipsis.svg';
import { useBoard } from '../context/BoardContext';
import { boardService } from '../services/boardService';
import { useRef, useState } from 'react';
import EditTaskModal from './EditTaskModal';
import StatusDropdown from '../services/StatusDropdown';
import toast from 'react-hot-toast';

interface TaskModalProps {
    task: Task;
    onClose: () => void;
}

const TaskModal = ({ task, onClose }: TaskModalProps) => {
    const { currentBoard, setCurrentBoard, refreshBoards } = useBoard();
    const [showMenu, setShowMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const completedSubtasks = task.subtasks.filter(
        (subtask) => subtask.isCompleted
    ).length;

    const handleSubtaskToggle = async (
        subtaskId: string,
        isCompleted: boolean
    ) => {
        try {
            await boardService.updateSubtask(subtaskId, isCompleted);

            if (currentBoard) {
                const updatedBoard = {
                    ...currentBoard,
                    columns: currentBoard.columns.map((column) => ({
                        ...column,
                        tasks: column.tasks.map((t) => {
                            if (t.id === task.id) {
                                return {
                                    ...t,
                                    subtasks: t.subtasks.map((subtask) =>
                                        subtask.id === subtaskId
                                            ? { ...subtask, isCompleted }
                                            : subtask
                                    ),
                                };
                            }
                            return t;
                        }),
                    })),
                };
                setCurrentBoard(updatedBoard);
            }

            await refreshBoards();
            toast.success('Subtask updated successfully');
        } catch (error) {
            toast.error('Failed to update subtask');
        }
    };

    const handleClickOutside = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleDeleteTask = async () => {
        setIsLoading(true);
        try {
            await boardService.deleteTask(task.id);

            if (currentBoard) {
                const updatedBoard = {
                    ...currentBoard,
                    columns: currentBoard.columns.map((column) => ({
                        ...column,
                        tasks: column.tasks.filter((t) => t.id !== task.id),
                    })),
                };
                setCurrentBoard(updatedBoard);
            }

            await refreshBoards();
            toast.success('Task deleted successfully');
            onClose();
        } catch (error) {
            console.error('Failed to delete task:', error);
            toast.error('Failed to delete task');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            const targetColumn = currentBoard?.columns.find(
                (col) => col.name === newStatus
            );
            if (!targetColumn) return;

            await boardService.updateTask(task.id, {
                column_id: targetColumn.id,
                status: newStatus,
            });

            if (currentBoard) {
                const updatedBoard = {
                    ...currentBoard,
                    columns: currentBoard.columns.map((column) => {
                        if (column.id === targetColumn.id) {
                            return {
                                ...column,
                                tasks: [
                                    ...column.tasks,
                                    { ...task, status: newStatus },
                                ],
                            };
                        } else {
                            return {
                                ...column,
                                tasks: column.tasks.filter(
                                    (t) => t.id !== task.id
                                ),
                            };
                        }
                    }),
                };
                setCurrentBoard(updatedBoard);
            }

            await refreshBoards();
            toast.success('Task status updated successfully');
        } catch (error) {
            toast.error('Failed to update task status');
        }
    };

    return (
        <>
            <div
                className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
                onClick={handleClickOutside}>
                <div
                    ref={modalRef}
                    className='bg-white dark:bg-gray-dark rounded-lg p-6 w-[480px] max-h-[90vh] overflow-y-auto relative'>
                    <div className='flex justify-between items-start mb-6'>
                        <h2 className='text-xl font-bold dark:text-white'>
                            {task.title}
                        </h2>

                        <div className='relative'>
                            <button
                                onClick={handleMenuClick}
                                className='hover:opacity-70 cursor-pointer'>
                                <img src={menuIcon} alt='menu' />
                            </button>

                            {showMenu && (
                                <div
                                    ref={menuRef}
                                    className='absolute right-0 top-8 w-[192px] bg-white dark:bg-gray-dark rounded-lg shadow-lg p-4'>
                                    <button
                                        className='text-gray-light hover:text-primary w-full text-left mb-4'
                                        onClick={() => {
                                            setShowMenu(false);
                                            setShowEditModal(true);
                                        }}>
                                        Edit Task
                                    </button>
                                    <button
                                        className='text-danger hover:text-danger-light w-full text-left'
                                        onClick={() => {
                                            setShowMenu(false);
                                            handleDeleteTask();
                                        }}>
                                        Delete Task
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className='text-gray-light text-sm mb-6'>
                        {task.description ? task.description : 'No description'}
                    </p>

                    <div>
                        <h3 className='text-sm font-bold dark:text-white text-gray-light mb-4'>
                            Subtasks ( {completedSubtasks} of{' '}
                            {task.subtasks.length} )
                        </h3>
                        <div className='space-y-2'>
                            {task.subtasks.map((subtask, index) => (
                                <div
                                    key={index}
                                    className='flex items-center gap-3 dark:bg-dark-secondary p-4 bg-soft-light rounded-lg text-gray-light font-semibold hover:bg-[#d8d7f1]   hover:text-black transition-colors dark:hover:bg-[#39395b] dark:hover:text-white dark:text-white'>
                                    <input
                                        type='checkbox'
                                        checked={subtask.isCompleted}
                                        onChange={() =>
                                            handleSubtaskToggle(
                                                subtask.id,
                                                !subtask.isCompleted
                                            )
                                        }
                                        className='w-4 h-4 rounded border-gray-light text-primary focus:ring-primary accent-primary transition-colors cursor-pointer'
                                        disabled={isLoading}
                                    />
                                    <span
                                        className={`text-sm ${
                                            subtask.isCompleted
                                                ? 'line-through line-through-thickness-1'
                                                : ''
                                        }`}>
                                        {subtask.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='mt-6'>
                        <h3 className='text-sm font-bold text-gray-light mb-2 dark:text-white'>
                            Current Status
                        </h3>
                        <StatusDropdown
                            value={task.status}
                            onChange={handleStatusChange}
                            options={
                                currentBoard?.columns.map(
                                    (column) => column.name
                                ) || []
                            }
                        />
                    </div>
                </div>
            </div>

            {showEditModal && (
                <EditTaskModal
                    task={task}
                    onClose={() => {
                        setShowEditModal(false);
                        onClose();
                    }}
                />
            )}
        </>
    );
};

export default TaskModal;
