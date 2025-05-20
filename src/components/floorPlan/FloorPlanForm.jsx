import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';

const FloorPlanForm = ({ onSubmit, initialValues, isEdit = false }) => {
  const [form] = Form.useForm();
  
  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);
  
  const handleSubmit = (values) => {
    onSubmit({
      ...values,
      id: initialValues?.id || `floor-plan-${Date.now()}`,
      tables: initialValues?.tables || [],
    });
  };
  
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues || {
        name: '',
        description: '',
      }}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item 
            name="name" 
            label="Nom du plan" 
            rules={[{ required: true, message: 'Veuillez saisir un nom pour ce plan' }]}
          >
            <Input placeholder="Ex: Salle principale" />
          </Form.Item>
        </Col>
        
        <Col span={24}>
          <Form.Item 
            name="description" 
            label="Description"
          >
            <Input.TextArea 
              placeholder="Description du plan de salle"
              rows={4}
            />
          </Form.Item>
        </Col>
      </Row>
      
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {isEdit ? 'Mettre à jour le plan' : 'Créer le plan'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FloorPlanForm;