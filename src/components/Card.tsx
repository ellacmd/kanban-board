import { Task } from '../types';
import { useState } from 'react';
import TaskModal from './TaskModal';

interface CardProps {
    task: Task;
}

const Card = ({ task }: CardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const completedSubtasks = task.subtasks.filter(
        (subtask) => subtask.isCompleted
    ).length;

    return (
        <>
            <div
                className='bg-white dark:bg-gray-dark w-[280px] px-4 py-6 rounded-lg cursor-pointer '
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
