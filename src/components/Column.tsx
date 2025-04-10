
import Card from './Card';
import { Column as ColumnType, } from '../types';
import { useBoard } from '../context/BoardContext';
import { boardService } from '../services/boardService';
import toast from 'react-hot-toast';
import { useDrop } from 'react-dnd';


interface ColumnProps {
    column: ColumnType;
}

const columnColors = ['#4ac4e5', '#635fc7', '#67e2ae', '#e5734a', '#e267cf'];

const Column = ({ column }: ColumnProps) => {
    const { currentBoard, setCurrentBoard, refreshBoards } = useBoard();
 

   

    const getColumnColor = (columnIndex: number) => {
        return columnColors[columnIndex % columnColors.length];
    };

    const [{ isOver }, drop] = useDrop({
        accept: 'TASK',
        canDrop: () => true,
        hover: (item: any, monitor) => {
            if (!monitor.isOver({ shallow: true })) return;
        },
        drop: async (item: {
            id: string;
            columnId: string;
            status: string;
        }) => {
            if (item.columnId === column.id.toString()) return;

            try {
                await boardService.updateTask(item.id, {
                    column_id: column.id.toString(),
                    status: column.name,
                });

                if (currentBoard) {
                    const newColumns = currentBoard.columns.map((col) => {
                        if (col.id.toString() === item.columnId) {
                            return {
                                ...col,
                                tasks: col.tasks.filter(
                                    (t) => t.id.toString() !== item.id
                                ),
                            };
                        }
                        if (col.id === column.id) {
                            const movedTask = currentBoard.columns
                                .find((c) => c.id.toString() === item.columnId)
                                ?.tasks.find(
                                    (t) => t.id.toString() === item.id
                                );

                            if (movedTask) {
                                return {
                                    ...col,
                                    tasks: [
                                        ...col.tasks,
                                        {
                                            ...movedTask,
                                            status: column.name,
                                            column_id: column.id.toString(),
                                        },
                                    ],
                                };
                            }
                        }
                        return col;
                    });

                    setCurrentBoard({ ...currentBoard, columns: newColumns });
                }

                toast.success('Task moved successfully');
            } catch (error) {
                console.error('Failed to move task:', error);
                toast.error('Failed to move task');
                await refreshBoards();
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div className='max-w-[280px] min-w-[280px] '>
            <div className='flex items-center justify-between text-gray-light text-sm mb-8 '>
                <div className='flex items-center gap-4 font-semibold'>
                    <span
                        className='w-4 h-4 rounded-full inline-block'
                        style={{
                            backgroundColor: getColumnColor(
                                currentBoard?.columns.findIndex(
                                    (c) => c.id === column.id
                                ) ?? 0
                            ),
                        }}></span>
                    <h3>
                        {column.name} &nbsp; ({column.tasks.length})
                    </h3>
                </div>
             
            </div>

            <div
                ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
                className={`flex flex-col gap-4 min-h-[550px] transition-colors  rounded-md
                    ${
                        isOver
                            ? 'bg-gray-100 dark:bg-dark-primary ring-2 ring-primary ring-opacity-50'
                            : column.tasks.length === 0
                            ? 'outline-dotted outline-gray-light'
                            : ''
                    }`}>
                {column.tasks.map((task, index) => (
                    <Card
                        key={task.id}
                        task={task}
                        index={index}
                        columnId={column.id}
                    />
                ))}
            </div>

      
        </div>
    );
};

export default Column;
