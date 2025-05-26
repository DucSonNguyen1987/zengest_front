import { mockTables, mockRooms } from '../mocks/data.js';

/**
 * Transforme les données mockées en format compatible FloorPlanEditor
 */
export const transformMockDataToFloorPlans = () => {
  return mockRooms.map(room => {
    // Récupérer les tables de cette salle
    const roomTables = mockTables
      .filter(table => table.roomId === room.id)
      .map(table => ({
        id: `table-${table.id}`,
        type: 'table',
        label: `Table ${table.number}`,
        capacity: table.capacity,
        shape: table.shape, // 'circle' ou 'rectangle'
        color: getTableColor(table.status),
        x: table.position.x,
        y: table.position.y,
        width: table.size.width,
        height: table.size.height,
        rotation: 0,
        status: table.status // free, occupied, reserved
      }));

    // Calculer la capacité totale des tables de cette salle et l'utiliser
    const totalTableCapacity = roomTables.reduce((sum, table) => sum + table.capacity, 0);
    
    // Utiliser la capacité calculée ou celle définie dans room
    const effectiveCapacityLimit = Math.max(room.capacity, totalTableCapacity + 10);

    return {
      id: `floor-plan-${room.id}`,
      name: room.name,
      description: room.description,
      capacityLimit: effectiveCapacityLimit, // Utilisation de la capacité calculée
      
      // Tables transformées
      tables: roomTables,
      
      // Obstacles (vide par défaut, peut être étendu)
      obstacles: [],
      
      // Périmètre par défaut (peut être personnalisé)
      perimeter: generateDefaultPerimeter(room.id),
      perimeterShape: 'custom',
      perimeterParams: {
        width: 600,
        height: 400,
        radius: 250,
        sides: 6,
        x: 300,
        y: 200
      },
      
      // Métadonnées
      floor: room.floor,
      roomId: room.id,
      currentCapacity: totalTableCapacity, // Ajouter la capacité actuelle
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
};

/**
 * Détermine la couleur d'une table selon son statut
 */
const getTableColor = (status) => {
  switch (status) {
    case 'free':
      return '#e6f7ff'; // Bleu clair
    case 'occupied':
      return '#ffccc7'; // Rouge clair
    case 'reserved':
      return '#fff7e6'; // Orange clair
    default:
      return '#f0f0f0'; // Gris clair
  }
};

/**
 * Génère un périmètre par défaut pour une salle
 */
const generateDefaultPerimeter = (roomId) => {
  const perimeters = {
    1: [ // Salle principale - rectangle
      { x: 50, y: 50 },
      { x: 550, y: 50 },
      { x: 550, y: 450 },
      { x: 50, y: 450 }
    ],
    2: [ // Terrasse - forme irrégulière
      { x: 80, y: 80 },
      { x: 520, y: 80 },
      { x: 520, y: 300 },
      { x: 400, y: 350 },
      { x: 80, y: 350 }
    ],
    3: [ // Salle privée - octogone
      { x: 150, y: 100 },
      { x: 250, y: 100 },
      { x: 300, y: 150 },
      { x: 300, y: 250 },
      { x: 250, y: 300 },
      { x: 150, y: 300 },
      { x: 100, y: 250 },
      { x: 100, y: 150 }
    ]
  };
  
  return perimeters[roomId] || perimeters[1];
};