import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Select, Modal, message, Card, Typography, Tooltip, Badge } from 'antd';
import { UserOutlined, KeyOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getAllUserRoles, getUsersByRole, assignRoleToUser, removeRoleFromUser } from '../../api/userRole';
import { hasPermission } from '../../utils/permissions';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const UserRoleManagement = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  // Charger tous les rôles au montage du composant
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const rolesData = await getAllUserRoles();
        setRoles(rolesData);
        if (rolesData.length > 0) {
          setSelectedRole(rolesData[0].id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des rôles:', error);
        message.error('Impossible de charger les rôles utilisateurs');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Charger les utilisateurs lorsqu'un rôle est sélectionné
  useEffect(() => {
    if (selectedRole) {
      const fetchUsersByRole = async () => {
        try {
          setLoading(true);
          const usersData = await getUsersByRole(selectedRole);
          setUsers(usersData);
        } catch (error) {
          console.error(`Erreur lors du chargement des utilisateurs avec le rôle ${selectedRole}:`, error);
          message.error('Impossible de charger les utilisateurs');
        } finally {
          setLoading(false);
        }
      };

      fetchUsersByRole();
    }
  }, [selectedRole]);

  // Gérer le changement de rôle dans le sélecteur
  const handleRoleChange = (value) => {
    setSelectedRole(value);
  };

  // Confirmer et retirer un rôle à un utilisateur
  const handleRemoveRole = (userId, userName) => {
    // Vérifier si l'utilisateur actuel a la permission
    if (!hasPermission(user?.role, 'EDIT_USERS')) {
      message.error('Vous n\'avez pas l\'autorisation de modifier les rôles utilisateurs');
      return;
    }

    confirm({
      title: `Retirer le rôle ${selectedRole}?`,
      icon: <ExclamationCircleOutlined />,
      content: `Êtes-vous sûr de vouloir retirer le rôle ${selectedRole} à ${userName}?`,
      okText: 'Oui',
      okType: 'danger',
      cancelText: 'Non',
      async onOk() {
        try {
          await removeRoleFromUser(userId, selectedRole);
          message.success(`Rôle ${selectedRole} retiré de ${userName}`);
          // Recharger les utilisateurs
          const updatedUsers = await getUsersByRole(selectedRole);
          setUsers(updatedUsers);
        } catch (error) {
          console.error('Erreur lors du retrait du rôle:', error);
          message.error('Impossible de retirer le rôle');
        }
      },
    });
  };

  // Configuration des colonnes du tableau
  const columns = [
    {
      title: 'Utilisateur',
      dataIndex: 'firstName',
      key: 'name',
      render: (text, record) => (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Date d\'inscription',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Dernière connexion',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="danger" 
          size="small"
          onClick={() => handleRemoveRole(record.id, `${record.firstName} ${record.lastName}`)}
          disabled={!hasPermission(user?.role, 'EDIT_USERS')}
        >
          Retirer le rôle
        </Button>
      ),
    },
  ];

  // Obtenir les informations du rôle sélectionné
  const selectedRoleInfo = roles.find(role => role.id === selectedRole);

  return (
    <div>
      <Title level={2}>Gestion des Rôles Utilisateurs</Title>
      
      {/* Carte d'information sur les rôles */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4}>Rôles disponibles</Title>
          <Select
            value={selectedRole}
            onChange={handleRoleChange}
            style={{ width: 200 }}
            loading={loading && roles.length === 0}
          >
            {roles.map(role => (
              <Option key={role.id} value={role.id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </div>
        
        {selectedRoleInfo && (
          <div>
            <div style={{ marginBottom: 8 }}>
              <Badge status="processing" color="#108ee9" />
              <Text strong style={{ marginLeft: 8 }}>{selectedRoleInfo.name}</Text>
              <Tag color="blue" style={{ marginLeft: 16 }}>Niveau {selectedRoleInfo.level}</Tag>
            </div>
            <Text>{selectedRoleInfo.description}</Text>
          </div>
        )}
      </Card>
      
      {/* Tableau des utilisateurs avec le rôle sélectionné */}
      <Card>
        <Title level={4}>
          Utilisateurs avec le rôle {selectedRoleInfo?.name || selectedRole}
          <Badge count={users.length} style={{ marginLeft: 8 }} />
        </Title>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default UserRoleManagement;