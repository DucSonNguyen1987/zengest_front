import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Unauthorized = () => {
  const { user } = useAuth();

  return (
    <Result
      status="403"
      title="403"
      subTitle={
        <>
          <p>Vous n'avez pas l'autorisation d'accéder à cette page.</p>
          <p>
            Votre rôle actuel ({user?.role}) ne dispose pas des permissions nécessaires.
          </p>
        </>
      }
      extra={
        <Link to="/dashboard">
          <Button type="primary">Retour au tableau de bord</Button>
        </Link>
      }
    />
  );
};

export default Unauthorized;