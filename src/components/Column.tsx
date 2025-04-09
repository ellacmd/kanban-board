import Card from './Card';
import { Column as ColumnType } from '../types';

interface ColumnProps {
    column: ColumnType;
}

const Column = ({ column }: ColumnProps) => {
    return (
        <div className='w-[280px]'>
            <div className='flex items-center gap-4 text-gray-light text-sm mb-8 font-semibold'>
                <span className='w-4 h-4 rounded-full bg-primary-light inline-block'></span>
                <h3>
                    {column.name} &nbsp; ({column.tasks.length})
                </h3>
            </div>

            <div
                className={`flex flex-col gap-4 ${
                    column.tasks.length === 0
                        ? 'outline-dotted h-[550px]  outline-gray-light rounded-md'
                        : ''
                }`}>
                {column.tasks.map((task, index) => (
                    <Card key={index} task={task} />
                ))}
            </div>
        </div>
    );
};

export default Column;
