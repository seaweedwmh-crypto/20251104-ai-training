import { useTasks } from '../store/tasks';

const useCalendar = () => {
  // 获取任务状态管理
  const { tasks, updateTaskDueDate, getTasksByDate } = useTasks();

  // 验证任务移动
  const validateTaskMove = (taskId: string, targetDate: Date, workdayOnly: boolean, maxTasksPerDay: number) => {
    // 查找任务
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      return { isValid: false, errorMessage: '无效的任务ID' };
    }

    // 检查任务是否已完成
    if (task.status === 'done') {
      return { isValid: false, errorMessage: '完成状态的任务不可排期' };
    }

    // 检查是否为周末
    if (workdayOnly) {
      const dayOfWeek = targetDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return { isValid: false, errorMessage: '已启用仅工作日排期，周末禁止放置' };
      }
    }

    // 检查目标日期是否越界
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    // 这里可以根据业务需求添加日期范围限制
    // 例如：禁止排期到过去的日期
    // if (targetDate < today) {
    //   return { isValid: false, errorMessage: '禁止排期到过去的日期' };
    // }

    // 检查当天任务数量是否超过上限
    const tasksOnDate = getTasksByDate(targetDate);
    if (tasksOnDate.length >= maxTasksPerDay) {
      return { isValid: false, errorMessage: `每天最多允许${maxTasksPerDay}条任务` };
    }

    // 所有检查通过
    return { isValid: true, errorMessage: '' };
  };

  // 构建日期索引
  const buildDateIndex = () => {
    const dateIndex: Record<string, typeof tasks> = {};
    
    tasks.forEach(task => {
      if (task.dueDate) {
        const dateKey = task.dueDate.toDateString();
        if (!dateIndex[dateKey]) {
          dateIndex[dateKey] = [];
        }
        dateIndex[dateKey].push(task);
      }
    });
    
    return dateIndex;
  };

  return {
    tasks,
    updateTaskDueDate,
    getTasksByDate,
    validateTaskMove,
    buildDateIndex
  };
};

export default useCalendar;
