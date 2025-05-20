import React from 'react';
import { Form, Input, Button, Checkbox, Typogrphy } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

const { Title } = Typogrphy;


const LoginForm = () => {

    // Utilisation du hook d'authentification
    const { login, loading } = useAuth();
    const [form] = Form.useForm();

    // Fonction appelée à la soumission du formulaire
    const onFinish = async (values) => {
        try {
            await login(values);
            // La redirection est gérée par le composant parent (page Login)
        } catch (error) {
            console.error('Login error:', error);
        }
    };


    return (
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
                Connexion
            </Title>

            <Form
                form={form}
                name='login'
                onFinish={onFinish}
                layout='vertical'
                size='large'
            >
                {/* Champ Email avec validation */}
                <Form.Item
                    name='email'
                    rules={[
                        { required: true, message: 'Veuillez saisir votre email' },
                        { type: 'email', message: 'Email invalide' },
                    ]}>
                    <Input prefix={<UserOutlined />} placeholder='Email' />
                </Form.Item>

                {/*Champ Mot de passe */}
                <Form.Item
                    name='password'
                    rules={[{ required: true, message: 'Veuillez saisir votre mot de passe' }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder='Mot de passe' />
                </Form.Item>

                {/*Option pour "se souvenir de moi" et "Mot de passe oublié" */}

                <Form.Item>
                    <Form.Item name="remember" valuePropName='checked' noStyle>
                        <Checkbox>Se souvenir de moi</Checkbox>
                    </Form.Item>

                    <Link to='/forgot-password' style={{ float: 'right' }}>
                        Mot de passe oublié ?
                    </Link>
                </Form.Item>

                {/* Bouton de soumission */}
                <Form.Item>
                    <Button
                        type='primary'
                        htmlType="submit"
                        loading={loading}
                        style={{ width: '100%' }}
                    >
                        Connexion
                    </Button>
                </Form.Item>

                {/*Lien vers la page d'inscription */}
                <div style={{ textAlign: 'center' }}>
                    Pas encore de compte?{' '}
                    <Link to="/register">S'inscrire</Link>
                </div>
                </Form>
        </div>
    );
};

export default LoginForm;
