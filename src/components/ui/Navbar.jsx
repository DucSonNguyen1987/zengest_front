import React from 'react';
import { Layout, Menu, Button, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Header } = Layout;

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menu déroulant du profil
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Mon profil</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/settings">Paramètres</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Déconnexion
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo et titre de l'application */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
            Mon Application
          </Link>
        </div>

        {/* Liens de navigation du header */}
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <Menu.Item key="/">
            <Link to="/">Accueil</Link>
          </Menu.Item>
          {isAuthenticated && (
            <Menu.Item key="/dashboard">
              <Link to="/dashboard">Tableau de bord</Link>
            </Menu.Item>
          )}
          {/* Ajoutez d'autres liens selon les besoins */}
        </Menu>

        {/* Affichage conditionnel selon l'état d'authentification */}
        <div>
          {isAuthenticated ? (
            <Dropdown overlay={userMenu} trigger={['click']}>
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar icon={<UserOutlined />} />
                <span style={{ color: 'white', marginLeft: 8 }}>
                  {user?.firstName}
                </span>
              </div>
            </Dropdown>
          ) : (
            <Button type="primary">
              <Link to="/login">Connexion</Link>
            </Button>
          )}
        </div>
      </div>
    </Header>
  );
};

export default Navbar;