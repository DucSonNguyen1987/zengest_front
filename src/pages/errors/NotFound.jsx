import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="La page que vous recherchez n'existe pas."
      extra={
        <Link to="/">
          <Button type="primary">Retour à l'accueil</Button>
        </Link>
      }
    />
  );
};

export default NotFound;