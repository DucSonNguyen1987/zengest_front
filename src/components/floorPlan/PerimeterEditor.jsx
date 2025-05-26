import React, { useState, useCallback, useMemo } from 'react';
import { Group, Circle, Line } from 'react-konva';
import { useTheme } from '@mui/material/styles';

const PerimeterEditor = ({
  perimeter = [],
  onChange,
  editable = true,
  perimeterColor = '#1976d2',
  canvasWidth = 800,
  canvasHeight = 600,
  isDarkMode = false
}) => {
  const theme = useTheme();
  const [selectedPointIndex, setSelectedPointIndex] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Valider et sécuriser les points du périmètre
  const safePerimeter = useMemo(() => {
    if (!Array.isArray(perimeter)) return [];
    
    return perimeter.filter(point => 
      point && 
      typeof point.x === 'number' && 
      typeof point.y === 'number' &&
      !isNaN(point.x) && 
      !isNaN(point.y)
    ).map(point => ({
      x: Math.max(0, Math.min(point.x, canvasWidth)),
      y: Math.max(0, Math.min(point.y, canvasHeight))
    }));
  }, [perimeter, canvasWidth, canvasHeight]);
  
  // Ajouter un point au périmètre
  const addPoint = useCallback((x, y) => {
    if (!editable) return;
    
    const newPoint = { 
      x: Math.max(10, Math.min(x, canvasWidth - 10)), 
      y: Math.max(10, Math.min(y, canvasHeight - 10)) 
    };
    
    const newPerimeter = [...safePerimeter, newPoint];
    onChange(newPerimeter);
  }, [editable, safePerimeter, onChange, canvasWidth, canvasHeight]);
  
  // Déplacer un point existant
  const movePoint = useCallback((index, x, y) => {
    if (!editable || index < 0 || index >= safePerimeter.length) return;
    
    const newPerimeter = [...safePerimeter];
    newPerimeter[index] = { 
      x: Math.max(10, Math.min(x, canvasWidth - 10)), 
      y: Math.max(10, Math.min(y, canvasHeight - 10)) 
    };
    onChange(newPerimeter);
  }, [editable, safePerimeter, onChange, canvasWidth, canvasHeight]);
  
  // Supprimer un point
  const removePoint = useCallback((index) => {
    if (!editable || index < 0 || index >= safePerimeter.length || safePerimeter.length <= 3) return;
    
    const newPerimeter = safePerimeter.filter((_, i) => i !== index);
    onChange(newPerimeter);
    setSelectedPointIndex(null);
  }, [editable, safePerimeter, onChange]);
  
  // Gestionnaire de clic sur le canvas pour ajouter un point
  const handleCanvasClick = useCallback((e) => {
    if (!editable) return;
    
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pos = stage.getPointerPosition();
    if (pos && e.target === stage) {
      addPoint(pos.x, pos.y);
    }
  }, [editable, addPoint]);
  
  // Gestionnaire de drag d'un point
  const handlePointDragEnd = useCallback((index, e) => {
    if (!editable) return;
    
    const pos = e.target.position();
    movePoint(index, pos.x, pos.y);
  }, [editable, movePoint]);
  
  // Gestionnaire de clic droit pour supprimer un point
  const handlePointContextMenu = useCallback((index, e) => {
    e.evt.preventDefault();
    removePoint(index);
  }, [removePoint]);
  
  // Couleurs selon le thème
  const colors = useMemo(() => ({
    line: perimeterColor,
    lineFill: `${perimeterColor}20`, // Transparence légère
    point: perimeterColor,
    pointSelected: theme.palette.secondary.main,
    pointHover: theme.palette.primary.light,
    stroke: isDarkMode ? '#ffffff' : '#000000'
  }), [perimeterColor, theme, isDarkMode]);
  
  // Rendu du périmètre
  const renderPerimeter = useMemo(() => {
    if (safePerimeter.length < 2) return null;
    
    const points = safePerimeter.flatMap(point => [point.x, point.y]);
    
    return (
      <Line
        points={points}
        closed={safePerimeter.length >= 3}
        stroke={colors.line}
        strokeWidth={2}
        fill={safePerimeter.length >= 3 ? colors.lineFill : 'transparent'}
        listening={false}
      />
    );
  }, [safePerimeter, colors]);
  
  // Rendu des points éditables
  const renderPoints = useMemo(() => {
    if (!editable) return null;
    
    return safePerimeter.map((point, index) => (
      <Circle
        key={`perimeter-point-${index}`}
        x={point.x}
        y={point.y}
        radius={selectedPointIndex === index ? 8 : 6}
        fill={selectedPointIndex === index ? colors.pointSelected : colors.point}
        stroke={colors.stroke}
        strokeWidth={1}
        draggable={true}
        onDragEnd={(e) => handlePointDragEnd(index, e)}
        onMouseEnter={(e) => {
          e.target.fill(colors.pointHover);
          e.target.getLayer().batchDraw();
          document.body.style.cursor = 'pointer';
        }}
        onMouseLeave={(e) => {
          e.target.fill(selectedPointIndex === index ? colors.pointSelected : colors.point);
          e.target.getLayer().batchDraw();
          document.body.style.cursor = 'default';
        }}
        onClick={() => setSelectedPointIndex(index)}
        onTap={() => setSelectedPointIndex(index)}
        onContextMenu={(e) => handlePointContextMenu(index, e)}
      />
    ));
  }, [
    editable, 
    safePerimeter, 
    selectedPointIndex, 
    colors, 
    handlePointDragEnd, 
    handlePointContextMenu
  ]);
  
  // Lignes guides entre les points (optionnel, pour une meilleure visualisation)
  const renderGuideLines = useMemo(() => {
    if (!editable || safePerimeter.length < 2) return null;
    
    return safePerimeter.map((point, index) => {
      if (index === safePerimeter.length - 1) return null;
      
      const nextPoint = safePerimeter[index + 1];
      
      return (
        <Line
          key={`guide-line-${index}`}
          points={[point.x, point.y, nextPoint.x, nextPoint.y]}
          stroke={colors.line}
          strokeWidth={1}
          dash={[5, 5]}
          opacity={0.5}
          listening={false}
        />
      );
    });
  }, [editable, safePerimeter, colors]);
  
  return (
    <Group>
      {/* Périmètre principal */}
      {renderPerimeter}
      
      {/* Lignes guides (mode édition) */}
      {renderGuideLines}
      
      {/* Points éditables */}
      {renderPoints}
      
      {/* Zone de clic pour ajouter des points */}
      {editable && (
        <Group
          onMouseDown={handleCanvasClick}
          onTouchStart={handleCanvasClick}
        />
      )}
    </Group>
  );
};

export default React.memo(PerimeterEditor);