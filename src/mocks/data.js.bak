// ==========================================
// DONNÉES FICTIVES POUR LES TESTS
// ==========================================

// src/mocks/data.js

// Mock des utilisateurs avec différents rôles
export const mockUsers = [
  {
    id: "user-1",
    firstName: "Admin",
    lastName: "Système",
    email: "admin@restaurant.com",
    password: "password123", // En production, les mots de passe ne seraient jamais stockés en clair
    role: "admin",
    createdAt: "2023-01-01T10:00:00Z",
    lastLogin: "2025-05-18T08:30:00Z"
  },
  {
    id: "user-2",
    firstName: "Pierre",
    lastName: "Dupont",
    email: "pierre@restaurant.com",
    password: "password123",
    role: "owner",
    createdAt: "2023-01-02T11:15:00Z",
    lastLogin: "2025-05-19T09:45:00Z"
  },
  {
    id: "user-3",
    firstName: "Marie",
    lastName: "Martin",
    email: "marie@restaurant.com",
    password: "password123",
    role: "manager",
    createdAt: "2023-02-15T14:30:00Z",
    lastLogin: "2025-05-19T17:20:00Z"
  },
  {
    id: "user-4",
    firstName: "Jean",
    lastName: "Petit",
    email: "jean@restaurant.com",
    password: "password123",
    role: "staff_bar",
    createdAt: "2023-03-10T09:20:00Z",
    lastLogin: "2025-05-20T08:10:00Z"
  },
  {
    id: "user-5",
    firstName: "Sophie",
    lastName: "Bernard",
    email: "sophie@restaurant.com",
    password: "password123",
    role: "staff_floor",
    createdAt: "2023-04-05T13:45:00Z",
    lastLogin: "2025-05-20T12:05:00Z"
  },
  {
    id: "user-6",
    firstName: "Michel",
    lastName: "Legrand",
    email: "michel@restaurant.com",
    password: "password123",
    role: "staff_kitchen",
    createdAt: "2023-05-12T10:30:00Z",
    lastLogin: "2025-05-20T07:30:00Z"
  },
  {
    id: "user-7",
    firstName: "Client",
    lastName: "Régulier",
    email: "client@example.com",
    password: "password123",
    role: "guest",
    createdAt: "2023-06-01T15:10:00Z",
    lastLogin: "2025-05-19T19:45:00Z"
  }
];

// Descriptions des rôles pour l'interface admin
export const mockUserRoles = [
  {
    id: "admin",
    name: "Administrateur",
    description: "Accès complet à toutes les fonctionnalités du système",
    level: 1
  },
  {
    id: "owner",
    name: "Propriétaire",
    description: "Gestion complète du restaurant, rapports et configuration",
    level: 2
  },
  {
    id: "manager",
    name: "Manager",
    description: "Gestion des réservations, du personnel et des opérations quotidiennes",
    level: 3
  },
  {
    id: "staff_bar",
    name: "Staff (Bar)",
    description: "Gestion des boissons et préparation des commandes de bar",
    level: 4
  },
  {
    id: "staff_floor",
    name: "Staff (Salle)",
    description: "Service en salle, gestion des tables et des commandes",
    level: 4
  },
  {
    id: "staff_kitchen",
    name: "Staff (Cuisine)",
    description: "Préparation des plats et gestion des commandes cuisine",
    level: 4
  },
  {
    id: "guest",
    name: "Client",
    description: "Accès au site vitrine et gestion des réservations personnelles",
    level: 5
  }
];

// Mock des tables du restaurant
export const mockTables = [
  {
    id: 1,
    number: "1",
    capacity: 2,
    status: "free", // free, occupied, reserved
    roomId: 1,
    position: { x: 100, y: 150 },
    shape: "circle",
    size: { width: 60, height: 60 }
  },
  {
    id: 2,
    number: "2",
    capacity: 4,
    status: "occupied",
    roomId: 1,
    position: { x: 200, y: 150 },
    shape: "rectangle",
    size: { width: 80, height: 80 }
  },
  {
    id: 3,
    number: "3",
    capacity: 6,
    status: "reserved",
    roomId: 1,
    position: { x: 350, y: 150 },
    shape: "rectangle",
    size: { width: 120, height: 80 }
  },
  {
    id: 4,
    number: "4",
    capacity: 2,
    status: "free",
    roomId: 1,
    position: { x: 100, y: 300 },
    shape: "circle",
    size: { width: 60, height: 60 }
  },
  {
    id: 5,
    number: "5",
    capacity: 4,
    status: "occupied",
    roomId: 1,
    position: { x: 200, y: 300 },
    shape: "rectangle",
    size: { width: 80, height: 80 }
  },
  {
    id: 6,
    number: "6",
    capacity: 8,
    status: "free",
    roomId: 2,
    position: { x: 150, y: 150 },
    shape: "rectangle",
    size: { width: 160, height: 80 }
  },
  {
    id: 7,
    number: "7",
    capacity: 4,
    status: "reserved",
    roomId: 2,
    position: { x: 350, y: 150 },
    shape: "rectangle",
    size: { width: 80, height: 80 }
  },
  {
    id: 8,
    number: "8",
    capacity: 2,
    status: "free",
    roomId: 2,
    position: { x: 450, y: 150 },
    shape: "circle",
    size: { width: 60, height: 60 }
  },
  {
    id: 9,
    number: "9",
    capacity: 6,
    status: "free",
    roomId: 3,
    position: { x: 200, y: 200 },
    shape: "rectangle",
    size: { width: 120, height: 80 }
  },
  {
    id: 10,
    number: "10",
    capacity: 4,
    status: "free",
    roomId: 3,
    position: { x: 350, y: 200 },
    shape: "rectangle",
    size: { width: 80, height: 80 }
  }
];

// Mock des salles du restaurant
export const mockRooms = [
  {
    id: 1,
    name: "Salle principale",
    floor: 0,
    capacity: 20,
    description: "Salle principale du restaurant"
  },
  {
    id: 2,
    name: "Terrasse",
    floor: 0,
    capacity: 14,
    description: "Terrasse extérieure"
  },
  {
    id: 3,
    name: "Salle privée",
    floor: 1,
    capacity: 10,
    description: "Salle pour événements privés"
  }
];

// Mock des réservations
export const mockReservations = [
  {
    id: 1,
    customerName: "Dupont",
    customerEmail: "dupont@example.com",
    customerPhone: "0601020304",
    date: "2025-05-21",
    time: "19:30",
    numberOfPeople: 4,
    tableId: 2,
    status: "confirmed", // confirmed, cancelled, no-show, completed
    notes: "Allergies aux fruits de mer",
    createdAt: "2025-05-15T14:30:00Z"
  },
  {
    id: 2,
    customerName: "Martin",
    customerEmail: "martin@example.com",
    customerPhone: "0607080910",
    date: "2025-05-21",
    time: "20:00",
    numberOfPeople: 2,
    tableId: 1,
    status: "confirmed",
    notes: "",
    createdAt: "2025-05-16T10:15:00Z"
  },
  {
    id: 3,
    customerName: "Bernard",
    customerEmail: "bernard@example.com",
    customerPhone: "0611121314",
    date: "2025-05-21",
    time: "20:30",
    numberOfPeople: 6,
    tableId: 3,
    status: "confirmed",
    notes: "Anniversaire",
    createdAt: "2025-05-14T09:45:00Z"
  },
  {
    id: 4,
    customerName: "Petit",
    customerEmail: "petit@example.com",
    customerPhone: "0615161718",
    date: "2025-05-20",
    time: "19:00",
    numberOfPeople: 3,
    tableId: 5,
    status: "completed",
    notes: "",
    createdAt: "2025-05-18T16:20:00Z",
    completedAt: "2025-05-20T21:45:00Z"
  },
  {
    id: 5,
    customerName: "Dubois",
    customerEmail: "dubois@example.com",
    customerPhone: "0619202122",
    date: "2025-05-19",
    time: "20:30",
    numberOfPeople: 5,
    tableId: 7,
    status: "no-show",
    notes: "",
    createdAt: "2025-05-17T11:30:00Z"
  },
  {
    id: 6,
    customerName: "Leroy",
    customerEmail: "leroy@example.com",
    customerPhone: "0623242526",
    date: "2025-05-22",
    time: "19:30",
    numberOfPeople: 4,
    tableId: null, // Pas encore attribué
    status: "confirmed",
    notes: "Table près de la fenêtre si possible",
    createdAt: "2025-05-19T14:10:00Z"
  },
  {
    id: 7,
    customerName: "Moreau",
    customerEmail: "moreau@example.com",
    customerPhone: "0627282930",
    date: "2025-05-23",
    time: "20:00",
    numberOfPeople: 2,
    tableId: 8,
    status: "confirmed",
    notes: "",
    createdAt: "2025-05-20T09:05:00Z"
  },
  {
    id: 8,
    customerName: "Lefebvre",
    customerEmail: "lefebvre@example.com",
    customerPhone: "0631323334",
    date: "2025-05-22",
    time: "20:30",
    numberOfPeople: 8,
    tableId: 6,
    status: "confirmed",
    notes: "Végétariens",
    createdAt: "2025-05-18T17:45:00Z"
  }
];

// Mock des items du menu
export const mockMenuItems = [
  // Entrées
  {
    id: 1,
    name: "Salade Caesar",
    description: "Laitue romaine, croûtons, parmesan, sauce Caesar",
    price: 8.50,
    category: "starter",
    preparationTime: 10, // en minutes
    available: true,
    imageUrl: "https://via.placeholder.com/150?text=Salade+Caesar"
  },
  {
    id: 2,
    name: "Soupe à l'oignon",
    description: "Soupe traditionnelle à l'oignon avec croûtons et fromage gratiné",
    price: 7.00,
    category: "starter",
    preparationTime: 15,
    available: true,
    imageUrl: "https://via.placeholder.com/150?text=Soupe+Oignon"
  },
  {
    id: 3,
    name: "Foie gras maison",
    description: "Foie gras mi-cuit, chutney de figues et toasts",
    price: 14.50,
    category: "starter",
    preparationTime: 10,
    available: true,
    imageUrl: "https://via.placeholder.com/150?text=Foie+Gras"
  },
  
  // Plats principaux
  {
    id: 4,
    name: "Steak frites",
    description: "Entrecôte grillée, frites maison et sauce au choix",
    price: 18.50,
    category: "main",
    preparationTime: 20,
    available: true,
    imageUrl: "https://via.placeholder.com/150?text=Steak+Frites"
  },
  {
    id: 5,
    name: "Magret de canard",
    description: "Magret de canard, sauce à l'orange et purée de patates douces",
    price: 22.00,
    category: "main",
    preparationTime: 25,
    available: true,
    imageUrl: "https://via.placeholder.com/150?text=Magret+Canard"
  },
  {
    id: 6,
    name: "Risotto aux champignons",
    description: "Risotto crémeux aux champignons de saison et parmesan",
    price: 16.00,
    category: "main",
    preparationTime: 20,
    available: true,
    imageUrl: "https://via.placeholder.com/150?text=Risotto"
  },
  {
    id: 7,
    name: "Filet de poisson du jour",
    description: "Poisson frais selon arrivage, légumes de saison, sauce vierge",
    price: 19.50,
    category: "main",
    preparationTime: 18,
    available: true,
    imageUrl: "https://via.placeholder.com/150?text=Poisson"
  },
  
  // Desserts
  {
    id: 8,
    name: "Crème brûlée",
    description: "Crème brûlée à la vanille",
    price: 7.50,
    category: "dessert",
    preparationTime: 10,
    available: true,
    imageUrl: "https://via.placeholder.com/150?text=Creme+Brulee"
  },
  {
    id: 9,
    name: "Mousse au chocolat",
    description: "Mousse au chocolat noir intense",
    price: 6.50,
    category: "dessert",
    preparationTime: 5,
    available: true,
    imageUrl: "https://via.placeholder.com/150?text=Mousse+Chocolat"
  },
  {
    id: 10,
    name: "Tarte Tatin",
    description: "Tarte Tatin aux pommes et glace vanille",
    price: 8.00,
    category: "dessert",
    preparationTime: 10,
    available: true,
    imageUrl: "https://via.placeholder.com/150?text=Tarte+Tatin"
  },
  
  // Boissons
  {
    id: 11,
    name: "Verre de vin rouge",
    description: "Sélection du sommelier",
    price: 6.00,
    category: "drink",
    preparationTime: 2,
    available: true,
    imageUrl: "https://via.placeholder.com/150?text=Vin+Rouge"
  },
  {
    id: 12,
    name: "Mojito",
    description: "Rhum, menthe fraîche, citron vert, sucre de canne, eau gazeuse",
    price: 9.00,
    category: "drink",
    preparationTime: 5,
    available: true,
    imageUrl: "https://via.placeholder.com/150?text=Mojito"
  },
  {
    id: 13,
    name: "Café expresso",
    description: "Café expresso corsé",
    price: 2.50,
    category: "drink",
    preparationTime: 3,
    available: true,
    imageUrl: "https://via.placeholder.com/150?text=Cafe"
  }
];

// Mock des commandes
export const mockOrders = [
  {
    id: 1,
    tableId: 2,
    serverId: "user-5", // ID de Sophie (staff_floor)
    status: "in-progress", // pending, in-progress, completed, cancelled
    items: [
      {
        id: 1,
        menuItemId: 1, // Salade Caesar
        quantity: 2,
        status: "served", // pending, preparing, ready, served
        notes: "Sans anchois",
        price: 8.50,
        name: "Salade Caesar" // Dupliqué pour faciliter l'affichage
      },
      {
        id: 2,
        menuItemId: 4, // Steak frites
        quantity: 1,
        status: "preparing", // En cours de préparation
        notes: "Saignant",
        price: 18.50,
        name: "Steak frites"
      },
      {
        id: 3,
        menuItemId: 5, // Magret de canard
        quantity: 1,
        status: "pending", // Pas encore commencé
        notes: "",
        price: 22.00,
        name: "Magret de canard"
      },
      {
        id: 4,
        menuItemId: 11, // Verre de vin rouge
        quantity: 2,
        status: "served", // Déjà servi
        notes: "",
        price: 6.00,
        name: "Verre de vin rouge"
      }
    ],
    createdAt: "2025-05-20T19:45:00Z",
    updatedAt: "2025-05-20T20:10:00Z",
    total: 63.00
  },
  {
    id: 2,
    tableId: 5,
    serverId: "user-5", // ID de Sophie (staff_floor)
    status: "in-progress",
    items: [
      {
        id: 5,
        menuItemId: 2, // Soupe à l'oignon
        quantity: 1,
        status: "served",
        notes: "",
        price: 7.00,
        name: "Soupe à l'oignon"
      },
      {
        id: 6,
        menuItemId: 6, // Risotto aux champignons
        quantity: 1,
        status: "ready", // Prêt à être servi
        notes: "Sans parmesan",
        price: 16.00,
        name: "Risotto aux champignons"
      },
      {
        id: 7,
        menuItemId: 8, // Crème brûlée
        quantity: 1,
        status: "pending",
        notes: "",
        price: 7.50,
        name: "Crème brûlée"
      },
      {
        id: 8,
        menuItemId: 13, // Café expresso
        quantity: 1,
        status: "pending",
        notes: "",
        price: 2.50,
        name: "Café expresso"
      }
    ],
    createdAt: "2025-05-20T20:00:00Z",
    updatedAt: "2025-05-20T20:15:00Z",
    total: 33.00
  },
  {
    id: 3,
    tableId: 3,
    serverId: "user-5", // ID de Sophie (staff_floor)
    status: "completed",
    items: [
      {
        id: 9,
        menuItemId: 3, // Foie gras maison
        quantity: 2,
        status: "served",
        notes: "",
        price: 14.50,
        name: "Foie gras maison"
      },
      {
        id: 10,
        menuItemId: 5, // Magret de canard
        quantity: 2,
        status: "served",
        notes: "",
        price: 22.00,
        name: "Magret de canard"
      },
      {
        id: 11,
        menuItemId: 9, // Mousse au chocolat
        quantity: 2,
        status: "served",
        notes: "",
        price: 6.50,
        name: "Mousse au chocolat"
      },
      {
        id: 12,
        menuItemId: 11, // Verre de vin rouge
        quantity: 1,
        status: "served",
        notes: "",
        price: 6.00,
        name: "Verre de vin rouge"
      }
    ],
    createdAt: "2025-05-20T18:30:00Z",
    updatedAt: "2025-05-20T19:50:00Z",
    completedAt: "2025-05-20T20:45:00Z",
    total: 92.00,
    paymentMethod: "card", // card, cash, mobile
    paymentStatus: "paid" // paid, pending
  }
];

// Mock des factures
export const mockInvoices = [
  {
    id: 1,
    orderId: 3,
    invoiceNumber: "INV-2025-001",
    customerId: null, // Pour les clients non enregistrés
    customerName: "Bernard",
    items: mockOrders.find(o => o.id === 3).items,
    subtotal: 92.00,
    tax: 15.33,
    tip: 10.00,
    total: 117.33,
    status: "paid",
    paymentMethod: "card",
    createdAt: "2025-05-20T20:45:00Z",
    paidAt: "2025-05-20T20:50:00Z"
  }
];