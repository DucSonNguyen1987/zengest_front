import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  // Importez les actions de votre slice
  fetchFloorPlansStart,
  fetchFloorPlansSuccess,
  fetchFloorPlansFailure,
  createFloorPlanStart,
  createFloorPlanSuccess,
  createFloorPlanFailure,
  updateFloorPlanStart,
  updateFloorPlanSuccess,
  updateFloorPlanFailure,
  deleteFloorPlanStart,
  deleteFloorPlanSuccess,
  deleteFloorPlanFailure,
  addTable, 
  updateTable, 
  deleteTable, 
  setCurrentFloorPlan,
  // Nouvelle action pour le déplacement des tables
  updateTablePosition 
} from '../../store/slices/floorPlanSlice';
import { 
  Layout, 
  Button, 
  List, 
  Card, 
  Modal, 
  message, 
  Popconfirm, 
  Typography, 
  Space, 
  Divider, 
  Empty, 
  Spin,
  Row,
  Col,
  Drawer,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SaveOutlined, 
  TableOutlined,
  MenuOutlined,
  EyeOutlined,
  LayoutOutlined,
  DragOutlined
} from '@ant-design/icons';
import Canvas from '../../components/floorPlan/Canvas';
import TableForm from '../../components/floorPlan/TableForm';
import FloorPlanForm from '../../components/floorPlan/FloorPlanForm';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission, PERMISSIONS } from '../../utils/permissions';
// Importez le nouveau service
import floorPlanService from '../../services/floorPlanService';
import FloorPlanEditor from '../../components/floorPlan/FloorPlanEditor';
const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const FloorPlanManagement = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { floorPlans, currentFloorPlan, loading } = useSelector(state => state.floorPlan);
  
  const [floorPlanModalVisible, setFloorPlanModalVisible] = useState(false);
  const [tableModalVisible, setTableModalVisible] = useState(false);
  const [currentTable, setCurrentTable] = useState(null);
  const [isEditingFloorPlan, setIsEditingFloorPlan] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [dragMode, setDragMode] = useState(false);
  
  // Responsive design
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const isMobile = screenWidth < 768;
  
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Vérification des permissions
const isDevelopment = true; // En production, utilisez process.env.NODE_ENV === 'development'
const canEdit = isDevelopment ? true : hasPermission(user?.role, PERMISSIONS.EDIT_PROJECTS);
const canDelete = isDevelopment ? true : hasPermission(user?.role, PERMISSIONS.DELETE_PROJECTS);  
  

// Chargement initial des plans
  useEffect(() => {
    const loadFloorPlans = async () => {
      try {
        dispatch(fetchFloorPlansStart());
        const data = await floorPlanService.getAll();
        dispatch(fetchFloorPlansSuccess(data));
      } catch (error) {
        dispatch(fetchFloorPlansFailure(error.message));
        message.error('Erreur lors du chargement des plans');
      }
    };
    
    loadFloorPlans();
  }, [dispatch]);
  
  // Gestion des plans de salle
  const handleCreateFloorPlan = async (floorPlanData) => {
    try {
      dispatch(createFloorPlanStart());
      const data = await floorPlanService.create(floorPlanData);
      dispatch(createFloorPlanSuccess(data));
      setFloorPlanModalVisible(false);
      message.success('Plan de salle créé avec succès');
    } catch (error) {
      dispatch(createFloorPlanFailure(error.message));
      message.error('Erreur lors de la création du plan');
    }
  };
  
  const handleUpdateFloorPlan = async (floorPlanData) => {
    try {
      dispatch(updateFloorPlanStart());
      const data = await floorPlanService.update(floorPlanData.id, floorPlanData);
      dispatch(updateFloorPlanSuccess(data));
      setFloorPlanModalVisible(false);
      message.success('Plan de salle mis à jour avec succès');
    } catch (error) {
      dispatch(updateFloorPlanFailure(error.message));
      message.error('Erreur lors de la mise à jour du plan');
    }
  };
  
  const handleDeleteFloorPlan = async (id) => {
    try {
      dispatch(deleteFloorPlanStart());
      await floorPlanService.delete(id);
      dispatch(deleteFloorPlanSuccess(id));
      message.success('Plan de salle supprimé avec succès');
    } catch (error) {
      dispatch(deleteFloorPlanFailure(error.message));
      message.error('Erreur lors de la suppression du plan');
    }
  };
  
  // Gestion des tables
  const handleAddTable = (tableData) => {
    const newTable = {
      ...tableData,
      id: Date.now().toString(), // Génération d'un ID temporaire
      x: 50, // Position initiale X
      y: 50, // Position initiale Y
    };
    dispatch(addTable(newTable));
    setTableModalVisible(false);
    message.success('Table ajoutée au plan');
  };
  
  const handleUpdateTable = (tableData) => {
    dispatch(updateTable(tableData));
    setTableModalVisible(false);
    message.success('Table mise à jour');
  };
  
  const saveCurrentFloorPlan = async () => {
    if (currentFloorPlan) {
      try {
        dispatch(updateFloorPlanStart());
        const data = await floorPlanService.update(currentFloorPlan.id, currentFloorPlan);
        dispatch(updateFloorPlanSuccess(data));
        message.success('Plan de salle enregistré avec succès');
      } catch (error) {
        dispatch(updateFloorPlanFailure(error.message));
        message.error('Erreur lors de l\'enregistrement du plan');
      }
    }
  };
  
  // Sélection d'un plan
  const handleSelectFloorPlan = (floorPlan) => {
    dispatch(setCurrentFloorPlan(floorPlan));
    if (isMobile) {
      setDrawerVisible(false);
    }
  };
  
  // Édition d'une table existante
  const handleEditTable = (table) => {
    setCurrentTable(table);
    setTableModalVisible(true);
  };
  
  // Gestion du mode drag & drop
  const toggleDragMode = () => {
    setDragMode(!dragMode);
    message.info(dragMode 
      ? 'Mode déplacement désactivé' 
      : 'Mode déplacement activé - Vous pouvez maintenant déplacer les tables'
    );
  };
  
  // Callback pour le drag & drop
  const handleTableDragEnd = (tableId, newPosition) => {
    dispatch(updateTablePosition({ tableId, position: newPosition }));
  };
  
  // Configuration du Sider pour les versions mobile et desktop
  const renderFloorPlansList = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <Title level={4} style={{ margin: 0 }}>Plans disponibles</Title>
        {canEdit && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              setIsEditingFloorPlan(false);
              setFloorPlanModalVisible(true);
            }}
          >
            Nouveau
          </Button>
        )}
      </div>
      
      {floorPlans.length === 0 ? (
        <Empty description="Aucun plan de salle disponible" />
      ) : (
        <List
          dataSource={floorPlans}
          renderItem={(plan) => (
            <List.Item style={{ padding: '4px 0' }}>
              <Card 
                title={plan.name} 
                size="small"
                style={{ 
                  width: '100%',
                  cursor: 'pointer',
                  border: currentFloorPlan?.id === plan.id ? '2px solid #1890ff' : '1px solid #eee'
                }}
                onClick={() => handleSelectFloorPlan(plan)}
                actions={[
                  canEdit && (
                    <EditOutlined 
                      key="edit" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditingFloorPlan(true);
                        dispatch(setCurrentFloorPlan(plan));
                        setFloorPlanModalVisible(true);
                      }}
                    />
                  ),
                  canDelete && (
                    <Popconfirm
                      title="Êtes-vous sûr de vouloir supprimer ce plan?"
                      onConfirm={(e) => {
                        e.stopPropagation();
                        handleDeleteFloorPlan(plan.id);
                      }}
                      okText="Oui"
                      cancelText="Non"
                    >
                      <DeleteOutlined 
                        key="delete" 
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Popconfirm>
                  )
                ].filter(Boolean)}
              >
                <Text type="secondary">{plan.description}</Text>
                <div>
                  <Text>
                    {plan.tables ? `${plan.tables.length} tables` : '0 table'}
                  </Text>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
    </>
  );
  
  // Rendu de l'interface
  return (
    <Layout style={{ background: '#fff', padding: '0', minHeight: 'calc(100vh - 64px)', marginTop: '2vh' }}>
      <Content style={{ padding: isMobile ? '10px' : '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '15px' 
        }}>
          <Title level={2} style={{ margin: 0 }}>Plans de Salle</Title>
          
          {isMobile && (
            <Button 
              type="primary" 
              icon={<MenuOutlined />} 
              onClick={() => setDrawerVisible(true)}
            >
              Plans
            </Button>
          )}
        </div>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <Spin size="large" fullscreen tip="Chargement des plans de salle..." />
          </div>
        ) : (
          <Layout style={{ background: '#fff', marginTop: '20px' }}>
            {!isMobile && (
              <Sider 
                width={280} 
                style={{ 
                  background: '#f5f5f5', 
                  padding: '15px', 
                  borderRadius: '4px',
                  marginRight: '20px',
                  height: 'calc(100vh - 200px)',
                  overflow: 'auto'
                }}
              >
                {renderFloorPlansList()}
              </Sider>
            )}
            
            <Content style={{ padding: isMobile ? '0' : '0 10px' }}>
              <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
                <Title level={4} style={{ margin: 0 }}>
                  {currentFloorPlan ? (
                    `${currentFloorPlan.name}`
                  ) : (
                    'Éditeur de plan'
                  )}
                </Title>
                
                <Space>
                  {currentFloorPlan && (
                    <>
                      {canEdit && (
                        <>
                          <Tooltip title="Éditer le plan">
                            <Button
                              icon={<LayoutOutlined />}
                              onClick={() => {
                                setIsEditingFloorPlan(true);
                                setFloorPlanModalVisible(true);
                              }}
                              size={isMobile ? "small" : "middle"}
                            >
                              {!isMobile && "Éditer plan"}
                            </Button>
                          </Tooltip>
                          
                          <Tooltip title="Activer/Désactiver le mode déplacement">
                            <Button
                              type={dragMode ? "primary" : "default"}
                              icon={<DragOutlined />}
                              onClick={toggleDragMode}
                              size={isMobile ? "small" : "middle"}
                            >
                              {!isMobile && (dragMode ? "Désactiver déplacement" : "Activer déplacement")}
                            </Button>
                          </Tooltip>
                          
                          <Tooltip title="Ajouter une table">
                            <Button
                              icon={<TableOutlined />}
                              onClick={() => {
                                setCurrentTable(null);
                                setTableModalVisible(true);
                              }}
                              size={isMobile ? "small" : "middle"}
                            >
                              {!isMobile && "Ajouter table"}
                            </Button>
                          </Tooltip>
                          
                          <Tooltip title="Enregistrer les modifications">
                            <Button
                              type="primary"
                              icon={<SaveOutlined />}
                              onClick={saveCurrentFloorPlan}
                              size={isMobile ? "small" : "middle"}
                            >
                              {!isMobile && "Enregistrer"}
                            </Button>
                          </Tooltip>
                        </>
                      )}
                    </>
                  )}
                </Space>
              </div>
              
              <div style={{ 
                border: '1px solid #f0f0f0', 
                borderRadius: '4px', 
                minHeight: isMobile ? '300px' : '400px',
                marginBottom: '20px'
              }}>
                <Canvas 
                  editable={canEdit} 
                  height={isMobile ? 300 : 400} 
                  dragMode={dragMode}
                  onTableDragEnd={handleTableDragEnd}
                />
              </div>
              
              {currentFloorPlan && currentFloorPlan.tables && currentFloorPlan.tables.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <Divider orientation="left" style={{ margin: '10px 0' }}>Tables</Divider>
                  <Row gutter={[8, 8]}>
                    {currentFloorPlan.tables.map((table) => (
                      <Col key={table.id} xs={12} sm={8} md={6} lg={4}>
                        <Card
                          size="small"
                          title={table.label}
                          style={{ height: '100%' }}
                          actions={canEdit ? [
                            <Tooltip title="Éditer cette table">
                              <EditOutlined key="edit" onClick={() => handleEditTable(table)} />
                            </Tooltip>,
                            <Popconfirm
                              title="Supprimer cette table?"
                              onConfirm={() => dispatch(deleteTable(table.id))}
                              okText="Oui"
                              cancelText="Non"
                            >
                              <Tooltip title="Supprimer cette table">
                                <DeleteOutlined key="delete" />
                              </Tooltip>
                            </Popconfirm>
                          ] : [
                            <EyeOutlined key="view" onClick={() => handleEditTable(table)} />
                          ]}
                        >
                          <p style={{ margin: '0 0 5px 0' }}>Capacité: {table.capacity} pers.</p>
                          <div 
                            style={{ 
                              width: '100%', 
                              height: '15px', 
                              background: table.color || '#f0f0f0',
                              borderRadius: '4px'
                            }} 
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Content>
          </Layout>
        )}
        
        {/* Drawer pour mobile */}
        <Drawer
          title="Plans de salle"
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={280}
        >
          {renderFloorPlansList()}
        </Drawer>
      </Content>
      
     {/* Modal pour créer/éditer un plan */}
<Modal
  title={isEditingFloorPlan ? "Modifier le plan de salle" : "Créer un nouveau plan de salle"}
  open={floorPlanModalVisible}
  onCancel={() => setFloorPlanModalVisible(false)}
  footer={null}
  width={1200} // Augmenter la largeur pour accommoder l'éditeur amélioré
>
  {isEditingFloorPlan ? (
    <FloorPlanEditor 
      currentFloorPlan={currentFloorPlan}
      editable={canEdit}
      onSaveFloorPlan={(updatedPlan) => {
        handleUpdateFloorPlan(updatedPlan);
        setFloorPlanModalVisible(false);
      }}
    />
  ) : (
    <FloorPlanForm
      onSubmit={handleCreateFloorPlan}
      initialValues={null}
      isEdit={false}
    />
  )}
</Modal>
      
      {/* Modal pour ajouter/éditer une table */}
      <Modal
        title={currentTable ? "Modifier la table" : "Ajouter une table"}
        open={tableModalVisible}
        onCancel={() => {
          setTableModalVisible(false);
          setCurrentTable(null);
        }}
        footer={null}
      >
        <TableForm
          onSubmit={currentTable ? handleUpdateTable : handleAddTable}
          initialValues={currentTable}
          isEdit={!!currentTable}
        />
      </Modal>
    </Layout>
  );
};

export default FloorPlanManagement;