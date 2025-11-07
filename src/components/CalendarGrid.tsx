import { useState, useRef } from 'react';
import DraggableTask from './DraggableTask';
import type { Task } from '../store/tasks';

// 视图类型
type ViewType = 'month' | 'week';

interface CalendarGridProps {
  viewType: ViewType;
  currentDate: Date;
  tasks: Task[];
  onTaskDrop: (taskId: string, targetDate: Date) => void;
  workdayOnly: boolean;
}

const CalendarGrid = ({ viewType, currentDate, tasks, onTaskDrop, workdayOnly }: CalendarGridProps) => {
  // 拖拽中的任务ID
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  // 高亮的目标日期
  const [highlightedDate, setHighlightedDate] = useState<Date | null>(null);
  // 网格容器引用
  const gridRef = useRef<HTMLDivElement>(null);

  // 生成日历日期
  const generateCalendarDates = () => {
    const dates: Date[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();

    if (viewType === 'month') {
      // 月视图：生成整个月的日期
      const firstDay = new Date(year, month, 1);
      
      // 计算需要显示的前一个月的日期
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());
      
      // 显示6周的日期
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dates.push(date);
      }
    } else {
      // 周视图：生成当前周的日期
      const startOfWeek = new Date(year, month, day);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
      }
    }

    return dates;
  };

  // 获取指定日期的任务
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return task.dueDate.toDateString() === date.toDateString();
    });
  };

  // 处理拖拽进入
  const handleDragEnter = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    setHighlightedDate(date);
  };

  // 处理拖拽离开
  const handleDragLeave = () => {
    setHighlightedDate(null);
  };

  // 处理拖拽放置
  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    setHighlightedDate(null);
    
    if (draggingTaskId) {
      onTaskDrop(draggingTaskId, date);
      setDraggingTaskId(null);
    }
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setHighlightedDate(null);
  };

  // 日历日期
  const calendarDates = generateCalendarDates();
  // 星期几名称
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="calendar-grid-container" ref={gridRef}>
      {/* 星期标题行 */}
      <div className="calendar-weekdays">
        {weekdays.map((day, index) => (
          <div 
            key={index} 
            className={`calendar-weekday ${index === 0 || index === 6 ? 'weekend' : ''}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日历网格 */}
      <div className="calendar-grid">
        {calendarDates.map((date, index) => {
          const tasksForDate = getTasksForDate(date);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const isHighlighted = highlightedDate?.toDateString() === date.toDateString();
          const isDisabled = workdayOnly && isWeekend;

          return (
            <div 
              key={index} 
              className={`calendar-cell 
                ${!isCurrentMonth ? 'other-month' : ''} 
                ${isWeekend ? 'weekend' : ''} 
                ${isHighlighted ? 'highlighted' : ''} 
                ${isDisabled ? 'disabled' : ''}`}
              onDragEnter={(e) => handleDragEnter(e, date)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, date)}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="calendar-cell-date">
                {date.getDate()}
              </div>
              <div className="calendar-cell-tasks">
                {tasksForDate.map(task => (
                  <DraggableTask 
                    key={task.id} 
                    task={task}
                    onDragStart={() => setDraggingTaskId(task.id)}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </div>
              {tasksForDate.length > 0 && (
                <div className="calendar-cell-task-count">
                  {tasksForDate.length}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
