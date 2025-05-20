import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text as KonvaText, Group } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';
import { updateTable, deleteTable } from '../../store/slices/floorPlanSlice';
import TableShape from './TableShape';
import { notification } from 'antd';

const Canvas = ({ editable = true, height = 400 }) => {
  const dispatch = useDispatch();
  const { currentFloorPlan } = useSelector(state => state.floorPlan);
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: height });
  
  // Ajustement du canvas au redimensionnement de la fenêtre
  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        setCanvasSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    
    // Observer pour détecter les changements dans le DOM parent
    const resizeObserver = new ResizeObserver(() => {
      checkSize();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      checkSize(); // Vérifier la taille initiale
    }
    
    // Ajouter également un écouteur de redimensionnement de fenêtre
    window.addEventListener('resize', checkSize);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkSize);
    };
  }, []);
  
  // Désélectionner lorsqu'on clique ailleurs que sur une table
  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };
  
  // Gérer la suppression avec la touche Delete
  const handleKeyDown = (e) => {
    if (e.keyCode === 46 && selectedId && editable) { // touche Delete
      dispatch(deleteTable(selectedId));
      setSelectedId(null);
      notification.success({
        message: 'Table supprimée',
        description: 'La table a été supprimée avec succès'
      });
    }
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedId]);
  
  if (!currentFloorPlan) {
    return (
      <div 
        className="floor-plan-empty" 
        ref={containerRef}
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: `${height}px`, 
          border: '1px dashed #ccc',
          borderRadius: '4px',
          backgroundColor: '#fafafa'
        }}
      >
        <div style={{ textAlign: 'center', color: '#999' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>
            <i className="anticon anticon-table" />
          </div>
          <div>Aucun plan sélectionné</div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="floor-plan-container" 
      ref={containerRef}
      style={{ 
        border: '1px solid #eee', 
        borderRadius: '4px', 
        height: `${height}px`, 
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f9f9f9'
      }}
    >
      <Stage
        ref={stageRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>
          {/* Fond du plan de salle */}
          <Rect
            x={0}
            y={0}
            width={canvasSize.width}
            height={canvasSize.height}
            fill="#f9f9f9"
            stroke="#ddd"
            strokeWidth={1}
          />
          
          {/* Affichage des tables */}
          {currentFloorPlan.tables && currentFloorPlan.tables.map((table) => (
            <TableShape
              key={table.id}
              tableData={table}
              isSelected={table.id === selectedId}
              onSelect={() => setSelectedId(table.id)}
              onChange={(newAttrs) => {
                dispatch(updateTable({
                  ...table,
                  ...newAttrs
                }));
              }}
              draggable={editable}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;