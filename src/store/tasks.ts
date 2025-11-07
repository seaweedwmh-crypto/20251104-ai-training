import React from 'react';

// 任务类型定义
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 初始任务数据
export const initialTasks: Task[] = [
  { id: 'task-1', title: '完成项目需求分析', status: 'todo', createdAt: new Date(), updatedAt: new Date() },
  { id: 'task-2', title: '设计系统架构', status: 'in-progress', dueDate: new Date(new Date().setDate(new Date().getDate() + 3)), createdAt: new Date(), updatedAt: new Date() },
  { id: 'task-3', title: '实现核心功能模块', status: 'todo', dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), createdAt: new Date(), updatedAt: new Date() },
  { id: 'task-4', title: '编写单元测试', status: 'todo', createdAt: new Date(), updatedAt: new Date() },
  { id: 'task-5', title: '进行系统集成测试', status: 'todo', dueDate: new Date(new Date().setDate(new Date().getDate() + 14)), createdAt: new Date(), updatedAt: new Date() },
  { id: 'task-6', title: '部署到生产环境', status: 'todo', createdAt: new Date(), updatedAt: new Date() },
  { id: 'task-7', title: '完成用户培训文档', status: 'done', dueDate: new Date(new Date().setDate(new Date().getDate() - 2)), createdAt: new Date(), updatedAt: new Date() },
];

// 任务状态管理
export const useTasks = () => {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);

  // 更新任务截止日期
  const updateTaskDueDate = (taskId: string, dueDate?: Date) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, dueDate, updatedAt: new Date() } : task
    ));
  };

  // 获取指定日期的任务
  const getTasksByDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return task.dueDate.toDateString() === date.toDateString();
    });
  };

  return { tasks, updateTaskDueDate, getTasksByDate };
};
