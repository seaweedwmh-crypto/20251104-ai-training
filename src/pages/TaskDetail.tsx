import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../store/tasks';
import { useState } from 'react';
import { Button, Card, Checkbox, Badge, Modal } from 'antd';
import { CalendarOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';

export const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, toggleTask, deleteTask } = useTasks();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!id) {
    navigate('/tasks', { replace: true });
    return null;
  }

  const task = getTaskById(id);

  if (!task) {
    return (
      <div className="task-detail-container">
        <div className="not-found">
          <h1>任务未找到</h1>
          <p>您访问的任务不存在或已被删除</p>
          <button onClick={() => navigate('/tasks')} className="btn-back">
            返回任务列表
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = () => {
    deleteTask(id);
    navigate('/tasks');
  };

  return (
    <div className="task-detail-container" style={{ padding: 24 }}>
      <Card variant="filled" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/tasks')}>
            返回列表
          </Button>
          <div style={{ display: 'flex' }}>
            <Button icon={<EditOutlined />} onClick={() => navigate(`/tasks/${id}/edit`)} style={{ marginRight: 8 }}>
              编辑
            </Button>
            <Button icon={<DeleteOutlined />} danger onClick={() => setConfirmDelete(true)}>
              删除
            </Button>
          </div>
        </div>
      </Card>

      <Card title={task.title} variant="filled" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Checkbox
            checked={task.completed}
            onChange={() => toggleTask(id)}
            style={{ marginRight: 16 }}
          />
          <Badge status={task.completed ? 'success' : 'processing'} text={task.completed ? '已完成' : '未完成'} />
        </div>

        {task.description && (
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 8 }}>描述</h3>
            <p>{task.description}</p>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', color: '#8c8c8c', fontSize: 14 }}>
          <CalendarOutlined style={{ marginRight: 8 }} />
          <span>创建于：{formatDate(task.createdAt)}</span>
        </div>
      </Card>

      <Modal
        title="确认删除"
        open={confirmDelete}
        onCancel={() => setConfirmDelete(false)}
        footer={[
          <Button key="back" onClick={() => setConfirmDelete(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" danger onClick={handleDelete}>
            确认删除
          </Button>
        ]}
      >
        <p>您确定要删除这个任务吗？此操作不可恢复。</p>
      </Modal>
    </div>
  );
};
