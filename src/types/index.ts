export interface Subtask {
    id: string;
    title: string;
    isCompleted: boolean;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    order: number;
    column_id: string;
    subtasks: Subtask[];
}

export interface CreateTaskInput {
    title: string;
    description: string;
    status: string;
    order: number;
    column_id: string;
}

export interface Column {
    id: string;
    name: string;
    order: number;
    tasks: Task[];
}

export interface Board {
    id: string;
    name: string;
    columns: Column[];
}
