// src/components/floorPlan/TableForm.jsx
import React from 'react';
import { Form, Input, InputNumber, Select, Button, ColorPicker } from 'antd';

const { Option } = Select;

const TableForm = ({ onSubmit, initialValues, isEdit = false }) => {
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
      id: initialValues?.id || `table-${Date.now()}`,
    });
    if (!isEdit) {
      form.resetFields();
    }
  };
  
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues || {
        label: '',
        capacity: 4,
        shape: 'rectangle',
        width: 80,
        height: 80,
        color: '#f0f0f0',
        x: 100,
        y: 100,
        rotation: 0,
      }}
    >
      <Form.Item name="label" label="Numéro/Nom de la table" rules={[{ required: true }]}>
        <Input placeholder="Ex: Table 1" />
      </Form.Item>
      
      <Form.Item name="capacity" label="Capacité (personnes)" rules={[{ required: true }]}>
        <InputNumber min={1} max={20} style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item name="shape" label="Forme" rules={[{ required: true }]}>
        <Select>
          <Option value="rectangle">Rectangle</Option>
          <Option value="circle">Rond</Option>
        </Select>
      </Form.Item>
      
      <Form.Item label="Dimensions">
        <Input.Group compact>
          <Form.Item name="width" noStyle rules={[{ required: true }]}>
            <InputNumber min={30} max={200} style={{ width: '50%' }} addonBefore="L" />
          </Form.Item>
          <Form.Item name="height" noStyle rules={[{ required: true }]}>
            <InputNumber min={30} max={200} style={{ width: '50%' }} addonBefore="H" />
          </Form.Item>
        </Input.Group>
      </Form.Item>
      
      <Form.Item label="Position (x, y)">
        <Input.Group compact>
          <Form.Item name="x" noStyle rules={[{ required: true }]}>
            <InputNumber style={{ width: '50%' }} addonBefore="X" />
          </Form.Item>
          <Form.Item name="y" noStyle rules={[{ required: true }]}>
            <InputNumber style={{ width: '50%' }} addonBefore="Y" />
          </Form.Item>
        </Input.Group>
      </Form.Item>
      
      <Form.Item name="rotation" label="Rotation (degrés)">
        <InputNumber min={0} max={359} style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item name="color" label="Couleur">
        <ColorPicker showText format="hex" />
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {isEdit ? 'Mettre à jour la table' : 'Ajouter la table'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TableForm;
