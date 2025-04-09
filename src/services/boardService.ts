import { supabase } from '../lib/supabase';
import { Board, Task, Column, CreateTaskInput } from '../types';

export const boardService = {
    async getBoards() {
        const { data, error } = await supabase
            .from('boards')
            .select(
                'id,name,columns!columns_board_id_fkey(id,name,order,tasks!tasks_column_id_fkey(id,title,description,status,order,subtasks!subtasks_task_id_fkey(id,title,is_completed)))'
            );

        if (error) throw error;
        return data as Board[];
    },

    async getBoardById(id: string) {
        const { data, error } = await supabase
            .from('boards')
            .select(
                'id,name,columns!columns_board_id_fkey(id,name,order,tasks!tasks_column_id_fkey(id,title,description,status,order,subtasks!subtasks_task_id_fkey(id,title,is_completed)))'
            )
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Board;
    },

    async createBoard(name: string) {
        const { data, error } = await supabase
            .from('boards')
            .insert([{ name }])
            .select()
            .single();

        if (error) throw error;
        return data as Board;
    },

    async updateBoard(id: string, updates: Partial<Board>) {
        const { data, error } = await supabase
            .from('boards')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Board;
    },

    async deleteBoard(id: string) {
        const { error } = await supabase.from('boards').delete().eq('id', id);

        if (error) throw error;
    },

    async createTask(columnId: string, task: CreateTaskInput) {
        const { data: maxOrderData, error: maxOrderError } = await supabase
            .from('tasks')
            .select('order')
            .eq('column_id', columnId)
            .order('order', { ascending: false })
            .limit(1)
            .single();

        if (maxOrderError && maxOrderError.code !== 'PGRST116') {
            console.error('Error getting max order:', maxOrderError);
            throw maxOrderError;
        }

        const nextOrder = (maxOrderData?.order ?? -1) + 1;

        const { data, error } = await supabase
            .from('tasks')
            .insert([{ ...task, column_id: columnId, order: nextOrder }])
            .select()
            .single();

        if (error) throw error;
        return data as Task;
    },

    async updateTask(taskId: string, updates: Partial<Task>) {
        if (updates.column_id) {
            const { data: maxOrderData, error: maxOrderError } = await supabase
                .from('tasks')
                .select('order')
                .eq('column_id', updates.column_id)
                .order('order', { ascending: false })
                .limit(1)
                .single();

            if (maxOrderError && maxOrderError.code !== 'PGRST116') {
                console.error('Error getting max order:', maxOrderError);
                throw maxOrderError;
            }

            const nextOrder = (maxOrderData?.order ?? -1) + 1;

            const { error: taskError } = await supabase
                .from('tasks')
                .update({
                    column_id: updates.column_id,
                    order: nextOrder,
                })
                .eq('id', taskId);

            if (taskError) {
                console.error('Error updating column_id:', taskError);
                throw taskError;
            }
        }

        const { data: taskData, error: taskError } = await supabase
            .from('tasks')
            .update({
                title: updates.title,
                description: updates.description,
                status: updates.status,
            })
            .eq('id', taskId)
            .select()
            .single();

        if (taskError) {
            console.error('Error updating task:', taskError);
            throw taskError;
        }

        if (updates.subtasks) {
            const { error: deleteError } = await supabase
                .from('subtasks')
                .delete()
                .eq('task_id', taskId);

            if (deleteError) {
                console.error('Error deleting subtasks:', deleteError);
                throw deleteError;
            }

            const newSubtasks = updates.subtasks.map((subtask) => ({
                task_id: taskId,
                title: subtask.title,
                is_completed: subtask.isCompleted,
            }));

            const { error: insertError } = await supabase
                .from('subtasks')
                .insert(newSubtasks);

            if (insertError) {
                console.error('Error inserting subtasks:', insertError);
                throw insertError;
            }
        }

        return taskData as Task;
    },

    async deleteTask(taskId: string) {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId);

        if (error) throw error;
    },

    async createColumn(boardId: string, name: string) {
        const { data, error } = await supabase
            .from('columns')
            .insert([{ name, board_id: boardId }])
            .select()
            .single();

        if (error) throw error;
        return data as Column;
    },

    async updateColumn(columnId: string, updates: Partial<Column>) {
        const { data, error } = await supabase
            .from('columns')
            .update(updates)
            .eq('id', columnId)
            .select()
            .single();

        if (error) throw error;
        return data as Column;
    },

    async deleteColumn(columnId: string) {
        const { error } = await supabase
            .from('columns')
            .delete()
            .eq('id', columnId);

        if (error) throw error;
    },

    async moveTask(taskId: string, newColumnId: string, newOrder: number) {
        const { data, error } = await supabase
            .from('tasks')
            .update({ column_id: newColumnId, order: newOrder })
            .eq('id', taskId)
            .select()
            .single();

        if (error) throw error;
        return data as Task;
    },

    async reorderTasks(taskIds: string[]) {
        const updates = taskIds.map((taskId, index) => ({
            id: taskId,
            order: index,
        }));

        const { data, error } = await supabase
            .from('tasks')
            .upsert(updates)
            .select();

        if (error) throw error;
        return data as Task[];
    },

    async reorderColumns(columnIds: string[]) {
        const updates = columnIds.map((columnId, index) => ({
            id: columnId,
            order: index,
        }));

        const { data, error } = await supabase
            .from('columns')
            .upsert(updates)
            .select();

        if (error) throw error;
        return data as Column[];
    },

    async updateSubtask(subtaskId: string, isCompleted: boolean) {
        const { data, error } = await supabase
            .from('subtasks')
            .update({ is_completed: isCompleted })
            .eq('id', subtaskId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },
};
