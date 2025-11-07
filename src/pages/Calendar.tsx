import { useState } from 'react';
import CalendarGrid from '../components/CalendarGrid';
import useCalendar from '../hooks/useCalendar';
import './Calendar.css';

// 视图类型
type ViewType = 'month' | 'week';

const Calendar = () => {
  // 当前日期
  const [currentDate, setCurrentDate] = useState(new Date());
  // 视图类型
  const [viewType, setViewType] = useState<ViewType>('month');
  // 仅工作日排期开关
  const [workdayOnly, setWorkdayOnly] = useState(false);
  // 每日最大任务数
  const [maxTasksPerDay, setMaxTasksPerDay] = useState(10);

  // 使用日历钩子
  const { tasks, updateTaskDueDate, validateTaskMove } = useCalendar();

  // 切换到上一个周期
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  // 切换到下一个周期
  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  // 切换到今天
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // 处理任务拖拽放置
  const handleTaskDrop = (taskId: string, targetDate: Date) => {
    // 验证任务移动
    const validation = validateTaskMove(taskId, targetDate, workdayOnly, maxTasksPerDay);
    
    if (validation.isValid) {
      // 更新任务截止日期
      updateTaskDueDate(taskId, targetDate);
    } else {
      // 显示错误提示
      alert(validation.errorMessage);
    }
  };

  return (
    <div className="calendar-container">
      {/* 顶部导航栏 */}
      <div className="calendar-header">
        <div className="calendar-controls">
          <button onClick={handlePrev}>&lt;</button>
          <h2>{currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}</h2>
          <button onClick={handleNext}>&gt;</button>
          <button onClick={handleToday} className="today-btn">今天</button>
        </div>

        <div className="calendar-view-selector">
          <button 
            className={`view-btn ${viewType === 'month' ? 'active' : ''}`}
            onClick={() => setViewType('month')}
          >
            月视图
          </button>
          <button 
            className={`view-btn ${viewType === 'week' ? 'active' : ''}`}
            onClick={() => setViewType('week')}
          >
            周视图
          </button>
        </div>

        <div className="calendar-settings">
          <label>
            <input 
              type="checkbox" 
              checked={workdayOnly} 
              onChange={(e) => setWorkdayOnly(e.target.checked)}
            />
            仅工作日排期
          </label>
          <div className="max-tasks-setting">
            <label>每日最大任务数: </label>
            <input 
              type="number" 
              min="1" 
              max="50" 
              value={maxTasksPerDay}
              onChange={(e) => setMaxTasksPerDay(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* 日历网格 */}
      <CalendarGrid 
        viewType={viewType}
        currentDate={currentDate}
        tasks={tasks}
        onTaskDrop={handleTaskDrop}
        workdayOnly={workdayOnly}
      />
    </div>
  );
};

export default Calendar;
