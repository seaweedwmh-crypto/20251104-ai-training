import { useTasks } from '../store/tasks';
import { Link } from 'react-router-dom';
import { Card, List, Checkbox, Button, Badge } from 'antd';
import { PlusOutlined, CalendarOutlined } from '@ant-design/icons';

export const TaskList: React.FC = () => {
  const { tasks, toggleTask, sortByCompleted, toggleSort } = useTasks();

  const formatDate = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="task-list-container">
      <Card title="任务管理" variant="filled" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button onClick={toggleSort} style={{ marginRight: 8 }}>
            {sortByCompleted ? '按创建时间排序' : '按完成状态排序'}
          </Button>
          <Button type="primary" icon={<PlusOutlined />}>
            <Link to="/tasks/new" style={{ color: 'white' }}>新增任务</Link>
          </Button>
        </div>

        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p>暂无任务</p>
            <Button type="primary" icon={<PlusOutlined />} style={{ marginTop: 16 }}>
              <Link to="/tasks/new" style={{ color: 'white' }}>创建第一个任务</Link>
            </Button>
          </div>
        ) : (
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={tasks}
            renderItem={task => (
              <List.Item key={task.id}>
                <Card
                  hoverable
                  style={{ cursor: 'pointer' }}
                  onClick={() => window.location.href = `/tasks/${task.id}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        style={{ marginRight: 16 }}
                      />
                      <Badge status={task.completed ? 'success' : 'processing'} text={task.completed ? '已完成' : '未完成'} />
                      <h3 style={{ margin: 0, marginLeft: 16, flex: 1 }}>{task.title}</h3>
                    </div>
                    <CalendarOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  </div>
                  {task.description && (
                    <p style={{ marginTop: 8, marginBottom: 0 }}>{task.description}</p>
                  )}
                  <p style={{ marginTop: 8, marginBottom: 0, color: '#8c8c8c', fontSize: 12 }}>
                    创建于：{formatDate(task.createdAt)}
                  </p>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};
