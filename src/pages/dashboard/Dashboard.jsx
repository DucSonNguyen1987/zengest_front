import React from 'react';
import { Typography, Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, ProjectOutlined, FileOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission } from '../../utils/permissions';

const { Title } = Typography;

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* En-tête du tableau de bord avec message de bienvenue personnalisé */}
      <Title level={2}>Tableau de bord</Title>
      <Title level={4} style={{ marginBottom: 30 }}>
        Bienvenue, {user?.firstName} {user?.lastName} ({user?.role})
      </Title>
      
      {/* Cartes statistiques */}
      <Row gutter={[16, 16]}>
        {/* Statistique utilisateurs (visible selon les permissions) */}
        {hasPermission(user?.role, 'VIEW_USERS') && (
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card hoverable>
              <Statistic
                title="Utilisateurs"
                value={42}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        )}
        
        {/* Statistique projets (visible selon les permissions) */}
        {hasPermission(user?.role, 'VIEW_PROJECTS') && (
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card hoverable>
              <Statistic
                title="Projets"
                value={12}
                prefix={<ProjectOutlined />}
              />
            </Card>
          </Col>
        )}
        
        {/* Statistique rapports (visible selon les permissions) */}
        {hasPermission(user?.role, 'VIEW_REPORTS') && (
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card hoverable>
              <Statistic
                title="Rapports"
                value={8}
                prefix={<FileOutlined />}
              />
            </Card>
          </Col>
        )}
      </Row>
      
      {/* Contenu supplémentaire du tableau de bord */}
      <div style={{ marginTop: 30 }}>
        {/* Ici vous pouvez ajouter des graphiques, tableaux, etc. */}
        <p>Contenu personnalisé selon le rôle de l'utilisateur: {user?.role}</p>
      </div>
    </div>
  );
};

export default Dashboard;