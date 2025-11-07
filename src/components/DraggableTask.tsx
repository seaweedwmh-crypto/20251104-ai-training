import { useRef } from 'react';
import type { Task } from '../store/tasks';

interface DraggableTaskProps {
  task: Task;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const DraggableTask = ({ task, onDragStart, onDragEnd }: DraggableTaskProps) => {
  // 任务元素引用
  const taskRef = useRef<HTMLDivElement>(null);

  // 处理拖拽开始
  const handleDragStart = (e: React.DragEvent) => {
    // 设置拖拽数据
    e.dataTransfer.setData('text/plain', task.id);
    // 设置拖拽效果
    e.dataTransfer.effectAllowed = 'move';
    // 调用外部拖拽开始回调
    onDragStart();
    // 添加拖拽样式
    if (taskRef.current) {
      taskRef.current.classList.add('dragging');
    }
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    // 移除拖拽样式
    if (taskRef.current) {
      taskRef.current.classList.remove('dragging');
    }
    // 调用外部拖拽结束回调
    onDragEnd();
  };

  // 处理键盘移动
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 支持使用方向键移动任务
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      // 这里可以添加键盘移动逻辑
      console.log('Keyboard move:', e.key);
    }
  };

  // 获取任务状态样式
  const getStatusClass = () => {
    switch (task.status) {
      case 'todo':
        return 'task-todo';
      case 'in-progress':
        return 'task-in-progress';
      case 'done':
        return 'task-done';
      default:
        return '';
    }
  };

  return (
    <div 
      ref={taskRef}
      className={`draggable-task ${getStatusClass()}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`任务: ${task.title}, 状态: ${task.status}`}
    >
      <div className="task-title">{task.title}</div>
      {task.dueDate && (
        <div className="task-due-date">
          {task.dueDate.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
        </div>
      )}
    </div>
  );
};

export default DraggableTask;
