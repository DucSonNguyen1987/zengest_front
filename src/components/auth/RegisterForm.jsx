import React, { useState } from 'react';
import { Form, Input, Button, Select, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/permissions';

const { Title } = Typography;
const { Option } = Select;

const RegisterForm = () => {
  const { register, loading } = useAuth();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  // Fonction appelée à la soumission du formulaire
  const onFinish = async (values) => {
    try {
      await register(values);
      // Redirection vers la page de connexion après inscription réussie
      navigate('/login');
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  // Gestion du changement de rôle
  const handleRoleChange = (value) => {
    setSelectedRole(value);
    
    // Si l'utilisateur change de rôle et qu'il avait sélectionné un staffType
    // et que le nouveau rôle n'est pas un staff, réinitialiser le staffType
    if (value !== 'staff') {
      form.setFieldsValue({ staffType: undefined });
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
        Créer un compte
      </Title>
      
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        {/* Champ prénom */}
        <Form.Item
          name="firstName"
          rules={[{ required: true, message: 'Veuillez saisir votre prénom' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Prénom" />
        </Form.Item>

        {/* Champ nom */}
        <Form.Item
          name="lastName"
          rules={[{ required: true, message: 'Veuillez saisir votre nom' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Nom" />
        </Form.Item>

        {/* Champ email avec validation */}
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Veuillez saisir votre email' },
            { type: 'email', message: 'Email invalide' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        {/* Champ mot de passe avec règles de validation */}
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Veuillez saisir votre mot de passe' },
            { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" />
        </Form.Item>

        {/* Champ confirmation de mot de passe avec validation de correspondance */}
        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Veuillez confirmer votre mot de passe' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Confirmer mot de passe" />
        </Form.Item>

        {/* Sélection du rôle principal */}
        <Form.Item
          name="role"
          rules={[{ required: true, message: 'Veuillez sélectionner un rôle' }]}
        >
          <Select 
            placeholder="Sélectionnez un rôle" 
            onChange={handleRoleChange}
          >
            <Option value={ROLES.GUEST}>Guest</Option>
            <Option value="staff">Staff</Option>
          </Select>
        </Form.Item>

        {/* Sélection du type de staff (affiché uniquement si "staff" est sélectionné) */}
        {selectedRole === 'staff' && (
          <Form.Item
            name="staffType"
            rules={[{ required: true, message: 'Veuillez sélectionner un type de staff' }]}
          >
            <Select placeholder="Sélectionnez votre département">
              <Option value={ROLES.STAFF_BAR}>Bar</Option>
              <Option value={ROLES.STAFF_FLOOR}>Salle</Option>
              <Option value={ROLES.STAFF_KITCHEN}>Cuisine</Option>
            </Select>
          </Form.Item>
        )}

        {/* Bouton de soumission */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%' }}
          >
            S'inscrire
          </Button>
        </Form.Item>

        {/* Lien vers la page de connexion */}
        <div style={{ textAlign: 'center' }}>
          Déjà un compte?{' '}
          <Link to="/login">Se connecter</Link>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;