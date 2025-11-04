import { Outlet, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { TagsOutlined } from '@ant-design/icons';
import './App.css';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Layout className="app-container">
      <Header className="app-header">
        <div className="logo">任务管理应用</div>
        <Menu 
          theme="dark" 
          mode="horizontal" 
          defaultSelectedKeys={['tasks']}
          items={[
            {
              key: 'tasks',
              icon: <TagsOutlined />,
              label: <Link to="/tasks">任务列表</Link>
            }
          ]}
        />
      </Header>
      <Content className="app-main">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </Content>
      <Footer className="app-footer">
        <p>© 2025 任务管理应用</p>
      </Footer>
    </Layout>
  );
}

export default App;
