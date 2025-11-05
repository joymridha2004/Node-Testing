import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Button,
  Card,
  Table,
  Typography,
  Avatar,
  Dropdown,
  Space,
  Tag,
  message,
  Spin,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

// API service
const apiService = {
  getUsers: async () => {
    const response = await fetch('http://localhost:8081/api/admin/users/');
    return await response.json();
  },

  createUser: async (userData) => {
    const response = await fetch('http://localhost:8081/api/admin/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    return await response.json();
  },

  updateUser: async (id, userData) => {
    const response = await fetch(`http://localhost:8081/api/admin/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    return await response.json();
  },

  deleteUser: async (id) => {
    const response = await fetch(`http://localhost:8081/api/admin/delete/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  }
};

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadUsers();
    }
  }, [isLoggedIn]);

  const checkLoginStatus = () => {
    const loginStatus = localStorage.getItem('loginStatus');
    const userDataStr = localStorage.getItem('user');

    if (loginStatus === 'true' && userDataStr) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(userDataStr));
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await apiService.getUsers();
      setUsers(usersData);
    } catch (error) {
      message.error('Failed to load users');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
    navigate('/');
    message.success('Logged out successfully');
  };

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsUserModalVisible(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      status: user.status
    });
    setIsUserModalVisible(true);
  };

  const handleDeleteUser = async (user) => {
    modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: `This will permanently delete ${user.first_name} ${user.last_name}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await apiService.deleteUser(user.id);
          message.success('User deleted successfully');
          await loadUsers();
        } catch (error) {
          message.error('Failed to delete user');
          console.error('Error deleting user:', error);
        }
      },
    });
  };

  const handleUserSubmit = async (values) => {
    try {
      const userData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone,
        status: values.status
      };

      if (editingUser) {
        await apiService.updateUser(editingUser.id, userData);
        message.success('User updated successfully');
      } else {
        await apiService.createUser(userData);
        message.success('User created successfully');
      }

      setIsUserModalVisible(false);
      await loadUsers();
    } catch (error) {
      message.error(editingUser ? 'Failed to update user' : 'Failed to create user');
    }
  };

  const refreshData = () => {
    loadUsers();
    message.success('Data refreshed successfully');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: 'Users',
    },
    {
      key: '3',
      icon: <ShoppingCartOutlined />,
      label: 'Products',
    },
    {
      key: '4',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
    {
      key: '5',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  // Table columns
  const columns = [
    {
      title: 'User',
      dataIndex: 'first_name',
      key: 'user',
      width: 250,
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <Text strong>{record.first_name} {record.last_name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (username) => username || 'N/A',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          active: { color: 'green', text: 'Active' },
          inactive: { color: 'red', text: 'Inactive' },
          banned: { color: 'orange', text: 'Banned' }
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return (
          <Tag color={config.color}>
            {config.text.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
            title="Edit User"
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record)}
            title="Delete User"
          />
        </Space>
      ),
    },
  ];

  // Inline CSS styles
  const styles = {
    layout: {
      minHeight: '100vh',
      background: '#f0f2f5',
    },
    header: {
      padding: '0 24px',
      background: '#fff',
      boxShadow: '0 1px 4px rgba(0,21,41,.08)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sider: {
      background: '#fff',
      boxShadow: '2px 0 6px rgba(0,21,41,.08)',
    },
    content: {
      margin: '24px',
      padding: '24px',
      background: '#fff',
      borderRadius: '8px',
      minHeight: '280px',
    },
    logo: {
      height: '32px',
      margin: '16px',
      background: 'rgba(255, 255, 255, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '18px',
      color: '#1890ff',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    statCard: {
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
      border: '1px solid #f0f0f0',
    },
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={styles.layout}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={styles.sider}
        width={250}
      >
        <div style={styles.logo}>
          {collapsed ? 'QSA' : 'Quickly System Admin'}
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>

      {contextHolder}
      <Layout>
        <Header style={styles.header}>
          <div>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </div>

          <Space size="large">

            {isLoggedIn ? (
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                arrow
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    padding: '6px 10px',
                    borderRadius: 8,
                    transition: 'all 0.2s ease',
                    background: 'rgba(24,144,255,0.06)',
                  }}
                >
                  <Avatar
                    size={40}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: '#1890ff' }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      maxWidth: 150,
                      overflow: 'hidden',
                    }}
                  >
                    <Text
                      strong
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {userData?.first_name} {userData?.last_name}
                    </Text>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 12,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {userData?.email}
                    </Text>
                  </div>
                </div>
              </Dropdown>
            ) : (
              <Button
                type="primary"
                icon={<UserOutlined />}
                onClick={handleLogin}
                style={{
                  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                }}
              >
                Login
              </Button>
            )}
          </Space>
        </Header>

        <Content style={styles.content}>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                User Management
              </Title>
              <Text type="secondary">
                Welcome back, {userData?.first_name}! Manage all users from here.
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddUser}
            >
              Add User
            </Button>
          </div>

          {/* Users Table */}
          <Card
            title={`All Users (${users.length})`}
            bordered={false}
            style={styles.statCard}
            extra={
              <Button
                icon={<ReloadOutlined />}
                onClick={refreshData}
              >
                Refresh
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              scroll={{ x: 1000 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} users`
              }}
              loading={loading}
            />
          </Card>
        </Content>
      </Layout>

      {/* User Modal */}
      <Modal
        title={editingUser ? 'Edit User' : 'Add New User'}
        open={isUserModalVisible}
        onCancel={() => setIsUserModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUserSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' }
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input maxLength={10} placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="banned">Banned</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsUserModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Home;