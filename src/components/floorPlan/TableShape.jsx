import React from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';

// Formes de table possibles
const TABLE_SHAPES = {
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
};

const TableShape = ({ tableData, isSelected, onSelect, onChange, draggable = true }) => {
  const { id, x, y, width, height, shape, label, capacity, rotation, color } = tableData;
  
  // Bordure plus épaisse si la table est sélectionnée
  const shapeProps = {
    fill: color || '#f0f0f0',
    stroke: isSelected ? '#3498db' : '#333',
    strokeWidth: isSelected ? 2 : 1,
    shadowColor: isSelected ? 'black' : 'transparent',
    shadowBlur: isSelected ? 10 : 0,
    shadowOpacity: isSelected ? 0.5 : 0,
    onClick: onSelect,
    onTap: onSelect,
    draggable: draggable,
    onDragEnd: (e) => {
      onChange({
        x: e.target.x(),
        y: e.target.y(),
      });
    },
    onTransformEnd: (e) => {
      // Transformer modifie la dimension/rotation
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      
      // Réinitialiser l'échelle, mais appliquer les changements aux dimensions directement
      node.scaleX(1);
      node.scaleY(1);
      
      onChange({
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
        rotation: node.rotation(),
      });
    },
  };
  
  // Rendu en fonction de la forme
  return (
    <Group 
      x={x} 
      y={y} 
      rotation={rotation || 0}
      draggable={draggable}
      onDragEnd={(e) => {
        onChange({
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
    >
      {shape === TABLE_SHAPES.CIRCLE ? (
        <Circle
          x={width / 2}
          y={height / 2}
          radius={Math.min(width, height) / 2}
          {...shapeProps}
        />
      ) : (
        <Rect
          width={width}
          height={height}
          {...shapeProps}
          cornerRadius={4}
        />
      )}
      
      {/* Texte du numéro de la table */}
      <Text
        text={label}
        fontSize={16}
        fontFamily="Arial"
        fill="#333"
        width={width}
        height={height}
        align="center"
        verticalAlign="middle"
      />
      
      {/* Texte de la capacité de la table (petit) */}
      <Text
        text={`(${capacity} pers.)`}
        fontSize={12}
        fontFamily="Arial"
        fill="#666"
        width={width}
        height={height}
        offsetY={-10}
        align="center"
        verticalAlign="bottom"
      />
    </Group>
  );
};

export default TableShape;