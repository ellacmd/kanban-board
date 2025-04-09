import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import { Board } from '../types';
import { boardService } from '../services/boardService';

interface BoardContextType {
    boards: Board[];
    currentBoard: Board | null;
    setCurrentBoard: (board: Board) => void;
    isLoading: boolean;
    isUpdating: boolean;
    error: Error | null;
    refreshBoards: () => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider = ({ children }: { children: ReactNode }) => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchBoards = async () => {
        try {
            const data = await boardService.getBoards();
            setBoards(data);
            if (!currentBoard && data.length > 0) {
                setCurrentBoard(data[0]);
            }
            setError(null);
        } catch (error) {
            console.error('Error fetching boards:', error);
            setError(error as Error);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshBoards = async () => {
        setIsUpdating(true);
        try {
            await fetchBoards();
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    return (
        <BoardContext.Provider
            value={{
                boards,
                currentBoard,
                setCurrentBoard,
                isLoading,
                isUpdating,
                error,
                refreshBoards,
            }}>
            {children}
        </BoardContext.Provider>
    );
};

export const useBoard = () => {
    const context = useContext(BoardContext);
    if (context === undefined) {
        throw new Error('useBoard must be used within a BoardProvider');
    }
    return context;
};
