// 安全空值判断
export const isNullish = (value: any): value is null | undefined => {
  return value === null || value === undefined;
};

// 坐标换算：将鼠标坐标转换为网格单元格坐标
export const getCellPosition = (e: React.DragEvent | MouseEvent, gridElement: HTMLElement) => {
  // 确保网格元素存在
  if (!gridElement) return null;

  // 获取网格元素的位置和尺寸
  const gridRect = gridElement.getBoundingClientRect();
  const gridWidth = gridRect.width;
  const gridHeight = gridRect.height;

  // 获取鼠标在网格内的相对坐标
  const x = e.clientX - gridRect.left;
  const y = e.clientY - gridRect.top;

  // 确保坐标在网格范围内
  if (x < 0 || x > gridWidth || y < 0 || y > gridHeight) {
    return null;
  }

  // 计算单元格大小（假设7列布局）
  const cellWidth = gridWidth / 7;
  const cellHeight = gridHeight / (gridElement.classList.contains('month-view') ? 6 : 1); // 月视图6行，周视图1行

  // 计算单元格索引
  const col = Math.floor(x / cellWidth);
  const row = Math.floor(y / cellHeight);

  // 确保行列索引有效
  if (col < 0 || col > 6 || row < 0 || (gridElement.classList.contains('month-view') && row > 5) || (!gridElement.classList.contains('month-view') && row > 0)) {
    return null;
  }

  return { col, row };
};

// 检查坐标是否在单元格内
export const isWithinCell = (e: React.DragEvent | MouseEvent, cellElement: HTMLElement) => {
  if (!cellElement) return false;

  const cellRect = cellElement.getBoundingClientRect();
  return (
    e.clientX >= cellRect.left &&
    e.clientX <= cellRect.right &&
    e.clientY >= cellRect.top &&
    e.clientY <= cellRect.bottom
  );
};

// 获取拖拽数据
export const getDragData = (e: React.DragEvent): string | null => {
  try {
    return e.dataTransfer.getData('text/plain');
  } catch (error) {
    return null;
  }
};

// 设置拖拽数据
export const setDragData = (e: React.DragEvent, data: string) => {
  try {
    e.dataTransfer.setData('text/plain', data);
    return true;
  } catch (error) {
    return false;
  }
};

// 设置拖拽效果
export const setDragEffect = (e: React.DragEvent, effect: 'none' | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all' | 'uninitialized') => {
  try {
    e.dataTransfer.effectAllowed = effect;
    return true;
  } catch (error) {
    return false;
  }
};

// 阻止默认拖拽行为
export const preventDefaultDrag = (e: React.DragEvent) => {
  e.preventDefault();
  return true;
};
