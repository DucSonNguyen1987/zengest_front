import React, { useCallback, useMemo } from 'react';
import { Group, Rect, Circle, Text } from 'react-konva';

const TableShape = React.memo(({
  table,
  tableData, // Compatibilité avec l'ancien nom
  isSelected = false,
  selected = false, // Compatibilité avec l'ancien nom
  onSelect,
  draggable = false,
  isDarkMode = false,
  onDragEnd,
  dragBorderColor = '#1976d2'
}) => {
  // Utiliser table ou tableData pour la compatibilité
  const tableInfo = table || tableData;
  
  // Validation et sécurisation des données - CRITIQUE
  const safeTable = useMemo(() => {
    if (!tableInfo) return null;
    
    // Validation stricte des dimensions pour éviter l'erreur Konva
    const width = Math.max(Number(tableInfo.width) || 80, 20);
    const height = Math.max(Number(tableInfo.height) || 80, 20);
    const x = Number(tableInfo.x) || 0;
    const y = Number(tableInfo.y) || 0;
    
    // Vérifications de sécurité supplémentaires
    if (isNaN(width) || isNaN(height) || isNaN(x) || isNaN(y)) {
      console.warn('TableShape: Invalid dimensions detected, using defaults');
      return {
        id: tableInfo.id || 'unknown',
        x: 100,
        y: 100,
        width: 80,
        height: 80,
        capacity: 4,
        color: '#e6f7ff',
        shape: 'rectangle',
        label: `Table ${tableInfo.id}`,
        rotation: 0
      };
    }
    
    return {
      id: tableInfo.id || 'unknown',
      x,
      y,
      width,
      height,
      capacity: Math.max(Number(tableInfo.capacity) || 4, 1),
      color: tableInfo.color || '#e6f7ff',
      shape: tableInfo.shape || 'rectangle',
      label: tableInfo.label || `Table ${tableInfo.id}`,
      rotation: Number(tableInfo.rotation) || 0
    };
  }, [tableInfo]);
  
  // Déterminer si la table est sélectionnée
  const isTableSelected = isSelected || selected;
  
  // Gestionnaire de clic optimisé
  const handleClick = useCallback(() => {
    if (onSelect && safeTable) {
      onSelect(safeTable);
    }
  }, [onSelect, safeTable]);
  
  // Gestionnaire de fin de drag optimisé
  const handleDragEnd = useCallback((e) => {
    if (!onDragEnd) return;
    
    try {
      const newPosition = {
        x: e.target.x(),
        y: e.target.y()
      };
      
      onDragEnd(newPosition);
    } catch (error) {
      console.warn('TableShape: Error in drag end handler:', error);
    }
  }, [onDragEnd]);
  
  // Couleurs et styles optimisés
  const styles = useMemo(() => {
    if (!safeTable) return {};
    
    const baseColor = safeTable.color;
    const borderColor = isTableSelected ? dragBorderColor : '#ccc';
    const borderWidth = isTableSelected ? 3 : 1;
    const shadowOpacity = isTableSelected ? 0.3 : 0;
    
    return {
      fill: baseColor,
      stroke: borderColor,
      strokeWidth: borderWidth,
      shadowColor: borderColor,
      shadowOpacity,
      shadowOffsetX: shadowOpacity > 0 ? 2 : 0,
      shadowOffsetY: shadowOpacity > 0 ? 2 : 0,
      shadowBlur: shadowOpacity > 0 ? 5 : 0
    };
  }, [safeTable, isTableSelected, dragBorderColor]);
  
  // Ne pas rendre si les données sont invalides
  if (!safeTable || safeTable.width <= 0 || safeTable.height <= 0) {
    return null;
  }
  
  // Calculer la taille du texte proportionnellement avec limites de sécurité
  const fontSize = Math.max(Math.min(safeTable.width, safeTable.height) * 0.2, 10);
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  
  try {
    return (
      <Group
        x={safeTable.x}
        y={safeTable.y}
        draggable={draggable}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        onTap={handleClick}
        rotation={safeTable.rotation}
      >
        {/* Forme de la table avec validation des dimensions */}
        {safeTable.shape === 'circle' ? (
          <Circle
            radius={Math.max(safeTable.width / 2, 10)}
            {...styles}
            offsetX={0}
            offsetY={0}
          />
        ) : (
          <Rect
            width={Math.max(safeTable.width, 20)}
            height={Math.max(safeTable.height, 20)}
            {...styles}
            cornerRadius={4}
            offsetX={safeTable.width / 2}
            offsetY={safeTable.height / 2}
          />
        )}
        
        {/* Texte avec le numéro de capacité */}
        <Text
          text={safeTable.capacity.toString()}
          fontSize={Math.max(fontSize, 10)}
          fontFamily="Arial"
          fill={textColor}
          align="center"
          verticalAlign="middle"
          offsetX={safeTable.shape === 'circle' ? 0 : safeTable.width / 2}
          offsetY={safeTable.shape === 'circle' ? 0 : safeTable.height / 2}
          width={safeTable.shape === 'circle' ? undefined : safeTable.width}
          height={safeTable.shape === 'circle' ? undefined : safeTable.height}
          listening={false}
        />
        
        {/* Label de la table si disponible */}
        {safeTable.label && safeTable.label !== `Table ${safeTable.id}` && (
          <Text
            text={safeTable.label}
            fontSize={Math.max(fontSize * 0.7, 8)}
            fontFamily="Arial"
            fill={textColor}
            align="center"
            offsetX={safeTable.shape === 'circle' ? 0 : safeTable.width / 2}
            offsetY={safeTable.shape === 'circle' ? -fontSize : (safeTable.height / 2) - fontSize}
            width={safeTable.shape === 'circle' ? undefined : safeTable.width}
            listening={false}
          />
        )}
      </Group>
    );
  } catch (error) {
    console.warn('TableShape: Render error:', error);
    return null;
  }
});

TableShape.displayName = 'TableShape';

export default TableShape;