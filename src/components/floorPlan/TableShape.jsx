import React, { useRef, useEffect } from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';

const TableShape = ({
  tableData,
  isSelected,
  onSelect,
  onChange,
  draggable,
  isDarkMode,
  onDragEnd,
  dragBorderColor = '#1976d2',
  showDragHandles = false
}) => {
  const shapeRef = useRef();
  const textRef = useRef();
  const capacityRef = useRef();
  
  const { 
    id, 
    x = 50, 
    y = 50, 
    width = 80, 
    height = 80, 
    label = 'Table', 
    capacity = 0, 
    shape = 'rectangle', 
    color = '#3498db',
    rotation = 0 // Extraction de la propriété rotation
  } = tableData;
  
  // Debug: Log les props reçues
  useEffect(() => {
    console.log(`TableShape ${id} - draggable: ${draggable}, showDragHandles: ${showDragHandles}, rotation: ${rotation}`);
  }, [id, draggable, showDragHandles, rotation]);
  
  const handleDragStart = () => {
    // Debug: Log le début du drag
    console.log(`TableShape ${id} - DRAG START at position: x=${x}, y=${y}`);
  };
  
  const handleDragEnd = (e) => {
    // Debug: Log la fin du drag
    const newX = e.target.x();
    const newY = e.target.y();
    console.log(`TableShape ${id} - DRAG END to position: x=${newX}, y=${newY}`);
    
    // Mettre à jour l'état local
    onChange({
      ...tableData,
      x: newX,
      y: newY,
    });
    
    // Notifier le parent que le drag est terminé
    if (onDragEnd) {
      onDragEnd({
        x: newX,
        y: newY
      });
    }
  };
  
  const textColor = isDarkMode ? '#ffffff' : '#ffffff';
  const strokeColor = isDarkMode ? '#555555' : '#2c3e50';
  const selectionColor = isDarkMode ? '#90caf9' : '#1976d2';
  
  // Déterminer l'opacité en fonction du mode drag
  const fillOpacity = draggable ? 0.9 : 0.7;
  const strokeWidth = isSelected ? 2 : 1;
  
  return (
    <Group
      x={x}
      y={y}
      rotation={rotation} // Appliquer la rotation au groupe entier
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onSelect}
      onTap={onSelect}
      ref={shapeRef}
      // Définir le point d'origine de la rotation au centre de la table
      offsetX={shape === 'circle' ? width / 2 : width / 2}
      offsetY={shape === 'circle' ? height / 2 : height / 2}
    >
      {/* Ajout d'une bordure rouge visible pour indiquer que la table est draggable */}
      {draggable && (
        <Rect
          width={width + 10}
          height={height + 10}
          x={-width/2 - 5}
          y={-height/2 - 5}
          stroke="red"
          strokeWidth={2}
          dash={[4, 2]}
          fill="transparent"
          perfectDrawEnabled={false}
        />
      )}
    
      {/* Forme de la table selon le type */}
      {shape === 'circle' ? (
        <Circle
          radius={Math.min(width, height) / 2}
          x={0} // Centré à 0 car le groupe est décalé par offsetX/Y
          y={0} // Centré à 0 car le groupe est décalé par offsetX/Y
          fill={color}
          stroke={isSelected ? selectionColor : strokeColor}
          strokeWidth={strokeWidth}
          opacity={fillOpacity}
          shadowColor={isSelected ? selectionColor : 'transparent'}
          shadowBlur={isSelected ? 10 : 0}
          shadowOpacity={0.3}
          perfectDrawEnabled={false}
        />
      ) : (
        <Rect
          width={width}
          height={height}
          x={-width/2} // Centré à -width/2 car le groupe est décalé par offsetX
          y={-height/2} // Centré à -height/2 car le groupe est décalé par offsetY
          fill={color}
          stroke={isSelected ? selectionColor : strokeColor}
          strokeWidth={strokeWidth}
          cornerRadius={8}
          opacity={fillOpacity}
          shadowColor={isSelected ? selectionColor : 'transparent'}
          shadowBlur={isSelected ? 10 : 0}
          shadowOpacity={0.3}
          perfectDrawEnabled={false}
        />
      )}
      
      {/* Bordure de déplacement */}
      {draggable && showDragHandles && (
        <Rect
          width={width + 6}
          height={height + 6}
          x={-width/2 - 3}
          y={-height/2 - 3}
          stroke={dragBorderColor}
          strokeWidth={1}
          dash={[4, 2]}
          fill="transparent"
          cornerRadius={10}
          perfectDrawEnabled={false}
        />
      )}
      
      {/* Poignées de déplacement */}
      {draggable && showDragHandles && [
        { x: -width/2 - 5, y: -height/2 - 5 },
        { x: width/2 + 5 - 8, y: -height/2 - 5 },
        { x: -width/2 - 5, y: height/2 + 5 - 8 },
        { x: width/2 + 5 - 8, y: height/2 + 5 - 8 }
      ].map((pos, i) => (
        <Circle
          key={i}
          x={pos.x}
          y={pos.y}
          radius={4}
          fill={dragBorderColor}
          opacity={0.8}
          perfectDrawEnabled={false}
        />
      ))}
      
      {/* Numéro/Label de la table */}
      <Text
        text={label}
        width={width}
        height={height}
        x={-width/2}
        y={-height/2 + (shape === 'circle' ? -8 : 0)}
        align="center"
        verticalAlign="middle"
        fill={textColor}
        fontSize={16}
        fontStyle="bold"
        ref={textRef}
        perfectDrawEnabled={false}
      />
      
      {/* Capacité de la table */}
      <Text
        text={`${capacity} pers.`}
        width={width}
        height={height}
        x={-width/2}
        y={-height/2 + 18}
        align="center"
        verticalAlign="middle"
        fill={textColor}
        fontSize={12}
        ref={capacityRef}
        perfectDrawEnabled={false}
      />
      
      {/* Indicateur de rotation (optionnel, pour le débogage) */}
      {rotation !== 0 && (
        <Text
          text={`${rotation}°`}
          x={-15}
          y={-height/2 - 20}
          fill="red"
          fontSize={10}
          perfectDrawEnabled={false}
        />
      )}
    </Group>
  );
};

export default TableShape;