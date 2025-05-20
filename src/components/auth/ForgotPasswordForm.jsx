import React, { useState } from 'react';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';

const { Title } = Typography;

const ForgotPasswordForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Fonction appelée à la soumission du formulaire
  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    
    try {
      await forgotPassword(values.email);
      setSuccess(true);
      form.resetFields();
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
        Mot de passe oublié
      </Title>
      
      {/* Message de succès */}
      {success && (
        <Alert
          message="Email envoyé"
          description="Si un compte existe avec cet email, vous recevrez un lien pour réinitialiser votre mot de passe."
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
      
      <Form
        form={form}
        name="forgot-password"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        {/* Champ email */}
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Veuillez saisir votre email' },
            { type: 'email', message: 'Email invalide' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        {/* Bouton de soumission */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%' }}
          >
            Envoyer le lien de réinitialisation
          </Button>
        </Form.Item>

        {/* Lien vers la page de connexion */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/login">Retour à la connexion</Link>
        </div>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;