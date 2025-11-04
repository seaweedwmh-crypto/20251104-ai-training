import { useReducer, useEffect, useState } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

type TaskState = Task[];

type TaskAction = 
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'DELETE_TASK'; payload: string };

const TASKS_KEY = 'tasks';

const initialTasks: TaskState = [];

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.payload];
    case 'UPDATE_TASK':
      return state.map(task => task.id === action.payload.id ? action.payload : task);
    case 'TOGGLE_TASK':
      return state.map(task => 
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );
    case 'DELETE_TASK':
      return state.filter(task => task.id !== action.payload);
    default:
      return state;
  }
};

const loadTasks = (): TaskState => {
  try {
    const savedTasks = localStorage.getItem(TASKS_KEY);
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      // Convert createdAt strings back to Date objects
      return parsedTasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
    }
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
  }
  return initialTasks;
};

const saveTasks = (tasks: TaskState): void => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

export const useTasks = () => {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks, loadTasks);
  const [sortByCompleted, setSortByCompleted] = useState(false);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (title: string, description: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      createdAt: new Date()
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    return newTask.id;
  };

  const updateTask = (id: string, title: string, description: string) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;

    const updatedTask: Task = {
      ...taskToUpdate,
      title,
      description
    };
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
  };

  const toggleTask = (id: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  const toggleSort = () => {
    setSortByCompleted(prev => !prev);
  };

  // Sort tasks: uncompleted first, then by createdAt descending
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortByCompleted) {
      if (a.completed === b.completed) {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
      return a.completed ? 1 : -1;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return {
    tasks: sortedTasks,
    sortByCompleted,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    getTaskById,
    toggleSort
  };
};
