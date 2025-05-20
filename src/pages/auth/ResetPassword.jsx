import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { resetPassword } from '../../api/auth';

const { Title } = Typography;

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Récupération du token depuis l'URL
  const token = searchParams.get('token');

  // Si aucun token n'est présent, afficher un message d'erreur
  if (!token) {
    return (
      <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
        <Alert
          message="Erreur"
          description="Lien de réinitialisation invalide ou expiré."
          type="error"
          showIcon
        />
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Button type="primary" onClick={() => navigate('/forgot-password')}>
            Demander un nouveau lien
          </Button>
        </div>
      </div>
    );
  }

  // Fonction appelée à la soumission du formulaire
  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    
    try {
      await resetPassword(token, values.password);
      setSuccess(true);
      // Redirection vers la page de connexion après un délai
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
        Réinitialiser votre mot de passe
      </Title>
      
      {/* Message de succès */}
      {success && (
        <Alert
          message="Mot de passe réinitialisé"
          description="Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion."
          type="success"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}
      
      {/* Message d'erreur */}
      {error && (
        <Alert
          message="Erreur"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}
      
      {!success && (
        <Form
          form={form}
          name="reset-password"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          {/* Champ nouveau mot de passe */}
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Veuillez saisir votre nouveau mot de passe' },
              { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nouveau mot de passe" />
          </Form.Item>

          {/* Champ confirmation du mot de passe */}
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

          {/* Bouton de soumission */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%' }}
            >
              Réinitialiser le mot de passe
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default ResetPassword;