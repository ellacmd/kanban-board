import { Task } from '../types';
import { useState } from 'react';
import TaskModal from './TaskModal';
import { useDrag } from 'react-dnd';

interface CardProps {
    task: Task;
    index: number;
    columnId: string;
}

const Card = ({ task, index, columnId }: CardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const completedSubtasks = task.subtasks.filter(
        (subtask) => subtask.isCompleted
    ).length;

    const [{ isDragging }, drag] = useDrag<
        any,
        unknown,
        { isDragging: boolean }
    >(
        () => ({
            type: 'TASK',
            item: {
                id: task.id.toString(),
                index,
                columnId: columnId.toString(),
            },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [task, index, columnId]
    );

    return (
        <>
            <div
                ref={drag as unknown as React.LegacyRef<HTMLDivElement>}
                className={`bg-white dark:bg-gray-dark p-4 rounded-lg shadow-sm
                    cursor-pointer hover:text-primary
                    ${isDragging ? 'opacity-50' : ''}
                    ${isDragging ? 'shadow-lg' : ''}`}
                style={{ opacity: isDragging ? 0.5 : 1 }}
                onClick={() => setIsModalOpen(true)}>
                <h2 className='dark:text-white font-bold'>{task.title}</h2>
                <p className='text-gray-light text-sm font-medium mt-2'>
                    {completedSubtasks} of {task.subtasks.length} subtasks
                </p>
            </div>

            {isModalOpen && (
                <TaskModal task={task} onClose={() => setIsModalOpen(false)} />
            )}
        </>
    );
};

export default Card;
