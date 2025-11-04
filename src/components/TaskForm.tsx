import { useEffect } from 'react';
import './TaskForm.css';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../store/tasks';
import { Form, Input, Button, message } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

interface TaskFormProps {
  taskId?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({ taskId }) => {
  const [form] = Form.useForm();
  const { addTask, updateTask, getTaskById } = useTasks();
  const navigate = useNavigate();

  useEffect(() => {
    if (taskId) {
      const task = getTaskById(taskId);
      if (task) {
        form.setFieldsValue({ title: task.title, description: task.description });
      } else {
        navigate('/tasks', { replace: true });
      }
    }
  }, [taskId, getTaskById, navigate, form]);

  const handleFinish = (values: { title: string; description: string }) => {
    try {
      if (taskId) {
        updateTask(taskId, values.title, values.description);
        message.success('任务已更新');
      } else {
        addTask(values.title, values.description);
        message.success('任务已添加');
      }
      navigate('/tasks');
    } catch (error) {
      message.error('操作失败，请稍后重试');
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      layout="vertical"
      className="task-form"
      validateMessages={{
        required: '${label}不能为空',
        string: {
          min: '${label}长度不能小于${min}个字符',
          max: '${label}长度不能超过${max}个字符',
        },
      }}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[
          { required: true },
          { min: 2, max: 50, message: '标题长度必须在2到50个字符之间' },
        ]}
      >
        <Input placeholder="请输入任务标题" prefix={<EditOutlined />} />
      </Form.Item>

      <Form.Item
        name="description"
        label="描述"
        rules={[{ max: 200, message: '描述不能超过200个字符' }]}
      >
        <Input.TextArea rows={3} placeholder="请输入任务描述（可选）" />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" icon={taskId ? <EditOutlined /> : <PlusOutlined />}>
          {taskId ? '保存修改' : '添加任务'}
        </Button>
        <Button type="default" onClick={() => navigate('/tasks')} style={{ marginLeft: 16 }}>
          取消
        </Button>
      </Form.Item>
    </Form>
  );
};
