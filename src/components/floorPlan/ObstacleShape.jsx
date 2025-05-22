import React, { useRef } from 'react';
import { Group, Rect, Circle, RegularPolygon, Text, Transformer } from 'react-konva';

const ObstacleShape = ({
  obstacleData,
  isSelected,
  onSelect,
  onChange,
  draggable,
  isDarkMode,
  onDragEnd,
  showDragHandles = false
}) => {
  const shapeRef = useRef();
  const transformerRef = useRef();
  
const { 
    id, 
    x = 50, 
    y = 50, 
    width = 40, 
    height = 40, 
    shape = 'rectangle', 
    color = '#FF6384',
    rotation = 0
} = obstacleData;
  
  // Effet pour attacher le transformer lorsque l'obstacle est sélectionné
  React.useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  
  // Gestionnaire de début de drag
  const handleDragStart = () => {
    onSelect();
  };
  
  // Gestionnaire de fin de drag
  const handleDragEnd = (e) => {
    // Récupérer la nouvelle position
    const newPos = {
      x: e.target.x(),
      y: e.target.y()
    };
    
    // Mettre à jour l'état local
    onChange({
      ...obstacleData,
      x: newPos.x,
      y: newPos.y
    });
    
    // Notifier le parent
    if (onDragEnd) {
      onDragEnd(newPos);
    }
  };
  
  // Gestionnaire de transformation (redimensionnement, rotation)
  const handleTransform = () => {
    if (!shapeRef.current) return;
    
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Réinitialiser les échelles
    node.scaleX(1);
    node.scaleY(1);
    
    // Mettre à jour l'objet avec les nouvelles dimensions et rotation
    onChange({
      ...obstacleData,
      x: node.x(),
      y: node.y(),
      width: Math.max(10, node.width() * scaleX),
      height: Math.max(10, node.height() * scaleY),
      rotation: node.rotation()
    });
  };
  
  // Couleurs selon le thème et les propriétés
  const fillColor = color || (isDarkMode ? 'rgba(255, 99, 132, 0.8)' : 'rgba(255, 99, 132, 0.7)');
  const strokeColor = isSelected ? (isDarkMode ? '#90caf9' : '#1976d2') : (isDarkMode ? '#555555' : '#FF6384');
  const strokeWidth = isSelected ? 2 : 1;
  
  const renderShape = () => {
    const commonProps = {
      ref: shapeRef,
      draggable: draggable,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      onClick: onSelect,
      onTap: onSelect,
      onTransformEnd: handleTransform,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth
    };
    
    switch (shape) {
      case 'circle':
        return (
          <Circle
            {...commonProps}
            x={0}
            y={0}
            radius={width / 2}
          />
        );
      case 'triangle':
        return (
          <RegularPolygon
            {...commonProps}
            x={0}
            y={0}
            sides={3}
            radius={width / 2}
          />
        );
      case 'rectangle':
      default:
        return (
          <Rect
            {...commonProps}
            x={-width / 2}
            y={-height / 2}
            width={width}
            height={height}
            cornerRadius={4}
          />
        );
    }
  };
  
  return (
    <>
      <Group
        x={x}
        y={y}
        rotation={rotation}
      >
        {renderShape()}
        <Text
          text="X"
          x={-4}
          y={-6}
          fontSize={12}
          fill="white"
          align="center"
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limiter la taille minimale
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
          rotateEnabled={true}
          keepRatio={shape === 'circle' || shape === 'triangle'}
        />
      )}
    </>
  );
};

export default ObstacleShape;