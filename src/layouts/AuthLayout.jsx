import React from 'react';
import { Layout, Typography } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content, Footer } = Layout;
const { Title } = Typography;

const AuthLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Contenu centré pour les formulaires d'authentification */}
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
          {/* Logo ou titre de l'application */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Title level={2}>Mon Application</Title>
          </div>
          {/* Outlet pour rendre le contenu des routes enfants */}
          <Outlet />
        </div>
      </Content>
      {/* Pied de page avec copyright */}
      <Footer style={{ textAlign: 'center' }}>
        ©{new Date().getFullYear()} Mon Application
      </Footer>
    </Layout>
  );
};

export default AuthLayout;