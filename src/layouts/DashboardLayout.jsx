import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Badge } from 'antd';
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  TableOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  HomeOutlined,
  CoffeeOutlined,
  ShopOutlined
} from '@ant-design/icons';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { hasPermission, ROLES } from '../utils/permissions';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const DashboardLayout = () => {
  // État pour la sidebar repliable
  const [collapsed, setCollapsed] = useState(false);
  // Récupération des données utilisateur et fonction de déconnexion
  const { user, logout, getStaffType, isStaff } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const staffType = getStaffType();

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menu déroulant du profil utilisateur
  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/profile">Mon profil</Link>
      </Menu.Item>
      {hasPermission(user?.role, 'EDIT_SETTINGS') && (
        <Menu.Item key="2" icon={<SettingOutlined />}>
          <Link to="/settings">Paramètres</Link>
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
        Déconnexion
      </Menu.Item>
    </Menu>
  );

  // Détermine si une icône spécifique doit être affichée pour le staff
  const getStaffIcon = () => {
    if (!staffType) return <UserOutlined />;
    
    switch(staffType) {
      case 'bar':
        return <CoffeeOutlined />;
      case 'floor':
        return <ShopOutlined />;
      case 'kitchen':
        return <ShoppingCartOutlined />;
      default:
        return <UserOutlined />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar avec menu principal */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        // Configuration responsive
        breakpoint="lg"
        collapsedWidth="80"
        width={250}
      >
        {/* Logo */}
        <div className="logo" style={{ height: 64, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h2 style={{ color: 'white', margin: 0 }}>
            {collapsed ? 'RESTO' : 'RESTAURANT APP'}
          </h2>
        </div>
        
        {/* Menu principal avec items conditionnels selon les permissions */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['restaurant']}
        >
          {/* Tableau de bord (accessible à tous) */}
          <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
            <Link to="/dashboard">Tableau de bord</Link>
          </Menu.Item>
          
          {/* Section Restaurant */}
          {hasPermission(user?.role, 'ACCESS_BACKOFFICE') && (
            <SubMenu key="restaurant" icon={<ShopOutlined />} title="Restaurant">
              {/* Réservations - accessible à tous */}
              <Menu.Item key="/reservations" icon={<ClockCircleOutlined />}>
                <Link to="/reservations">Réservations</Link>
              </Menu.Item>
              
              {/* Plan de salle - visible selon les permissions */}
              {hasPermission(user?.role, 'VIEW_TABLE_STATUS') && (
                <Menu.Item key="/floor-plan" icon={<TableOutlined />}>
                  <Link to="/floor-plan">Plan de salle</Link>
                </Menu.Item>
              )}
              
              {/* Commandes - visible selon les permissions */}
              {hasPermission(user?.role, 'CREATE_ORDER') && (
                <Menu.Item key="/orders" icon={<ShoppingCartOutlined />}>
                  <Link to="/orders">Commandes</Link>
                </Menu.Item>
              )}
              
              {/* Interface Cuisine - uniquement pour la cuisine */}
              {user?.role === ROLES.STAFF_KITCHEN && (
                <Menu.Item key="/kitchen" icon={<ShoppingCartOutlined />}>
                  <Link to="/kitchen">Cuisine</Link>
                </Menu.Item>
              )}
              
              {/* Interface Bar - uniquement pour le bar */}
              {user?.role === ROLES.STAFF_BAR && (
                <Menu.Item key="/bar" icon={<CoffeeOutlined />}>
                  <Link to="/bar">Bar</Link>
                </Menu.Item>
              )}
              
              {/* Facturation - visible selon les permissions */}
              {hasPermission(user?.role, 'CREATE_INVOICE') && (
                <Menu.Item key="/billing" icon={<FileTextOutlined />}>
                  <Link to="/billing">Facturation</Link>
                </Menu.Item>
              )}
            </SubMenu>
          )}
          
          {/* Site vitrine - accessible uniquement aux guests */}
          {hasPermission(user?.role, 'ACCESS_SHOWCASE') && (
            <Menu.Item key="/showcase" icon={<HomeOutlined />}>
              <Link to="/showcase">Site vitrine</Link>
            </Menu.Item>
          )}
          
          {/* Menu d'administration - visible uniquement pour Admin, Owner et Manager */}
          {(user?.role === ROLES.ADMIN || user?.role === ROLES.OWNER || user?.role === ROLES.MANAGER) && (
            <SubMenu key="admin" icon={<SettingOutlined />} title="Administration">
              {/* Gestion des utilisateurs */}
              {hasPermission(user?.role, 'VIEW_USERS') && (
                <Menu.Item key="/users" icon={<TeamOutlined />}>
                  <Link to="/users">Utilisateurs</Link>
                </Menu.Item>
              )}
              
              {/* Configuration des salles et tables */}
              {hasPermission(user?.role, 'CREATE_ROOM_TABLE') && (
                <Menu.Item key="/room-config" icon={<TableOutlined />}>
                  <Link to="/room-config">Configuration des salles</Link>
                </Menu.Item>
              )}
              
              {/* Paramètres */}
              {hasPermission(user?.role, 'EDIT_SETTINGS') && (
                <Menu.Item key="/settings" icon={<SettingOutlined />}>
                  <Link to="/settings">Paramètres</Link>
                </Menu.Item>
              )}
            </SubMenu>
          )}
        </Menu>
      </Sider>
      
      {/* Layout principal */}
      <Layout className="site-layout">
        {/* Header avec bouton toggle et menu utilisateur */}
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Bouton pour replier/déplier la sidebar */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          {/* Zone droite du header avec notifications et profil */}
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 20 }}>
            {/* Icône de notifications avec badge */}
            <Badge count={5} style={{ marginRight: 24 }}>
              <Button icon={<BellOutlined />} shape="circle" />
            </Badge>
            
            {/* Menu déroulant du profil utilisateur */}
            <Dropdown overlay={userMenu} trigger={['click']}>
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar icon={getStaffIcon()} />
                <span style={{ marginLeft: 8, display: collapsed ? 'none' : 'inline' }}>
                  {user?.firstName} {user?.lastName}
                  {isStaff() && ` (${staffType.toUpperCase()})`}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        {/* Contenu principal - Outlet pour rendre les routes enfants */}
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: 4,
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;