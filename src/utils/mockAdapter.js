import MockAdapter from 'axios-mock-adapter';
import { 
  mockUsers, 
  mockUserRoles,
  mockTables, 
  mockReservations,
  mockOrders,
  mockMenuItems
} from '../mocks/data';

/**
 * Configuration d'un adaptateur mock pour Axios
 * Cet adaptateur intercepte les requêtes API et renvoie des données fictives
 * @param {Object} axiosInstance - Instance Axios à mocker
 */
const setupMock = (axiosInstance) => {
  // Création d'une nouvelle instance de MockAdapter
  const mock = new MockAdapter(axiosInstance, { delayResponse: 500 }); // Délai de 500ms pour simuler une requête réseau

  // ========== AUTHENTIFICATION ==========
  
  // Login
  mock.onPost('/auth/login').reply((config) => {
    // config est correctement défini comme paramètre de la fonction de rappel
    const { email, password } = JSON.parse(config.data);
    
    // Recherche de l'utilisateur
    const user = mockUsers.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      return [401, { message: 'Email ou mot de passe incorrect' }];
    }
    
    // Ne pas envoyer le mot de passe dans la réponse
    const { password: _, ...userWithoutPassword } = user;
    
    return [200, {
      user: userWithoutPassword,
      token: `mock-jwt-token-${user.id}-${Date.now()}`
    }];
  });
  
  // Register
  mock.onPost('/auth/register').reply((config) => {
    const userData = JSON.parse(config.data);
    
    // Vérification si l'email existe déjà
    if (mockUsers.some(u => u.email === userData.email)) {
      return [400, { message: 'Cet email est déjà utilisé' }];
    }
    
    // Création d'un nouvel utilisateur
    const newUser = {
      id: `user-${mockUsers.length + 1}`,
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    // Ajout de l'utilisateur au mock (uniquement pour la session)
    mockUsers.push(newUser);
    
    return [201, { message: 'Inscription réussie' }];
  });
  
  // Récupération des données utilisateur
  // Ici, config est correctement défini comme paramètre même s'il n'est pas utilisé
  mock.onGet('/auth/me').reply((_config) => {
    // En situation réelle, on utiliserait le token pour identifier l'utilisateur
    // Ici, on retourne simplement le premier utilisateur pour simuler
    const { password: _, ...userWithoutPassword } = mockUsers[0];
    
    return [200, userWithoutPassword];
  });
  
  // Logout - config défini même si non utilisé
  mock.onPost('/auth/logout').reply(200, { message: 'Déconnexion réussie' });

  // ========== ROLES UTILISATEURS ==========
  
  // Nouveau endpoint pour les rôles utilisateurs
  mock.onGet('/user-roles').reply(200, mockUserRoles);
  
  // Récupération d'un rôle spécifique
  mock.onGet(/\/user-roles\/\w+/).reply((config) => {
    const roleId = config.url.split('/').pop();
    const role = mockUserRoles.find(r => r.id === roleId);
    
    if (!role) {
      return [404, { message: 'Rôle non trouvé' }];
    }
    
    return [200, role];
  });
  
  // Récupération des utilisateurs par rôle
  mock.onGet(/\/user-roles\/\w+\/users/).reply((config) => {
    const roleId = config.url.split('/')[2];
    const usersWithRole = mockUsers
      .filter(u => u.role === roleId)
      .map(({ password, ...user }) => user); // Ne pas envoyer les mots de passe
    
    return [200, usersWithRole];
  });
  
  // ========== TABLES ==========
  
  // Récupération de toutes les tables - config défini même si non utilisé
  mock.onGet('/tables').reply(200, mockTables);
  
  // Récupération d'une table par ID
  mock.onGet(/\/tables\/\d+/).reply((config) => {
    const id = config.url.split('/').pop();
    const table = mockTables.find(t => t.id.toString() === id);
    
    if (!table) {
      return [404, { message: 'Table non trouvée' }];
    }
    
    return [200, table];
  });
  
  // Mise à jour du statut d'une table
  mock.onPut(/\/tables\/\d+\/status/).reply((config) => {
    const id = config.url.split('/')[2];
    const { status } = JSON.parse(config.data);
    
    const tableIndex = mockTables.findIndex(t => t.id.toString() === id);
    
    if (tableIndex === -1) {
      return [404, { message: 'Table non trouvée' }];
    }
    
    // Mise à jour du statut
    mockTables[tableIndex] = {
      ...mockTables[tableIndex],
      status
    };
    
    return [200, mockTables[tableIndex]];
  });

   // ========== FLOOR PLANS ==========
  
  // Données fictives pour les plans de salle
  const mockFloorPlans = [
    {
      id: '1',
      name: 'Salle principale',
      description: 'Rez-de-chaussée, 20 tables',
      tables: [
        {
          id: '101',
          label: 'Table 1',
          capacity: 4,
          shape: 'rectangle',
          color: '#3498db',
          x: 100,
          y: 100,
          width: 80,
          height: 80
        },
        {
          id: '102',
          label: 'Table 2',
          capacity: 2,
          shape: 'circle',
          color: '#e74c3c',
          x: 250,
          y: 120,
          width: 60,
          height: 60
        },
        {
          id: '103',
          label: 'Table 3',
          capacity: 6,
          shape: 'rectangle',
          color: '#2ecc71',
          x: 150,
          y: 250,
          width: 120,
          height: 80
        }
      ]
    },
    {
      id: '2',
      name: 'Terrasse',
      description: 'Extérieur, 8 tables',
      tables: [
        {
          id: '201',
          label: 'Terrasse 1',
          capacity: 4,
          shape: 'circle',
          color: '#f39c12',
          x: 80,
          y: 80,
          width: 70,
          height: 70
        },
        {
          id: '202',
          label: 'Terrasse 2',
          capacity: 4,
          shape: 'circle',
          color: '#f39c12',
          x: 200,
          y: 80,
          width: 70,
          height: 70
        }
      ]
    }
  ];

  // GET /floor-plans - Récupération de tous les plans
  mock.onGet('/floor-plans').reply(200, mockFloorPlans);

  // GET /floor-plans/:id - Récupération d'un plan spécifique
  mock.onGet(/\/floor-plans\/\w+/).reply((config) => {
    const id = config.url.split('/').pop();
    const floorPlan = mockFloorPlans.find(plan => plan.id === id);
    
    if (!floorPlan) {
      return [404, { message: 'Plan de salle non trouvé' }];
    }
    
    return [200, floorPlan];
  });

  // POST /floor-plans - Création d'un nouveau plan
  mock.onPost('/floor-plans').reply((config) => {
    const floorPlanData = JSON.parse(config.data);
    
    const newFloorPlan = {
      id: Date.now().toString(),
      ...floorPlanData,
      tables: floorPlanData.tables || []
    };
    
    // En situation réelle, nous ajouterions à la base de données
    // Ici, pour le mock, nous le retournons simplement
    return [201, newFloorPlan];
  });

  // PUT /floor-plans/:id - Mise à jour d'un plan
  mock.onPut(/\/floor-plans\/\w+/).reply((config) => {
    const id = config.url.split('/').pop();
    const updatedData = JSON.parse(config.data);
    
    const floorPlanIndex = mockFloorPlans.findIndex(plan => plan.id === id);
    
    if (floorPlanIndex === -1) {
      return [404, { message: 'Plan de salle non trouvé' }];
    }
    
    // En situation réelle, nous mettrions à jour la base de données
    // Ici, nous retournons simplement les données mises à jour
    const updatedFloorPlan = {
      ...mockFloorPlans[floorPlanIndex],
      ...updatedData,
      id // Préserver l'ID d'origine
    };
    
    return [200, updatedFloorPlan];
  });

  // DELETE /floor-plans/:id - Suppression d'un plan
  mock.onDelete(/\/floor-plans\/\w+/).reply((config) => {
    const id = config.url.split('/').pop();
    
    const floorPlanIndex = mockFloorPlans.findIndex(plan => plan.id === id);
    
    if (floorPlanIndex === -1) {
      return [404, { message: 'Plan de salle non trouvé' }];
    }
    
    // En situation réelle, nous supprimerions de la base de données
    // Ici, nous retournons simplement l'ID supprimé
    return [200, { id }];
  });
  
  // ========== RÉSERVATIONS ==========
  
  // Récupération de toutes les réservations
  mock.onGet('/reservations').reply((config) => {
    // Gestion des filtres (si présents dans l'URL)
    const params = new URLSearchParams(config.params);
    let filteredReservations = [...mockReservations];
    
    if (params.has('date')) {
      const dateFilter = params.get('date');
      filteredReservations = filteredReservations.filter(r => 
        r.date.startsWith(dateFilter)
      );
    }
    
    if (params.has('status')) {
      const statusFilter = params.get('status');
      filteredReservations = filteredReservations.filter(r => 
        r.status === statusFilter
      );
    }
    
    return [200, filteredReservations];
  });
  
  // Récupération d'une réservation par ID
  mock.onGet(/\/reservations\/\d+/).reply((config) => {
    const id = config.url.split('/').pop();
    const reservation = mockReservations.find(r => r.id.toString() === id);
    
    if (!reservation) {
      return [404, { message: 'Réservation non trouvée' }];
    }
    
    return [200, reservation];
  });
  
  // Création d'une réservation
  mock.onPost('/reservations').reply((config) => {
    const reservationData = JSON.parse(config.data);
    
    const newReservation = {
      id: `reservation-${mockReservations.length + 1}`,
      ...reservationData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    // Ajout de la réservation au mock (uniquement pour la session)
    mockReservations.push(newReservation);
    
    return [201, newReservation];
  });
  
  // Mise à jour d'une réservation
  mock.onPut(/\/reservations\/\d+/).reply((config) => {
    const id = config.url.split('/').pop();
    const updatedData = JSON.parse(config.data);
    
    const reservationIndex = mockReservations.findIndex(r => r.id.toString() === id);
    
    if (reservationIndex === -1) {
      return [404, { message: 'Réservation non trouvée' }];
    }
    
    // Mise à jour de la réservation
    mockReservations[reservationIndex] = {
      ...mockReservations[reservationIndex],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    
    return [200, mockReservations[reservationIndex]];
  });
  
  // Annulation d'une réservation
  mock.onPost(/\/reservations\/\d+\/cancel/).reply((config) => {
    const id = config.url.split('/')[2];
    const { reason } = JSON.parse(config.data);
    
    const reservationIndex = mockReservations.findIndex(r => r.id.toString() === id);
    
    if (reservationIndex === -1) {
      return [404, { message: 'Réservation non trouvée' }];
    }
    
    // Mise à jour du statut de la réservation
    mockReservations[reservationIndex] = {
      ...mockReservations[reservationIndex],
      status: 'cancelled',
      cancellationReason: reason,
      cancelledAt: new Date().toISOString()
    };
    
    return [200, mockReservations[reservationIndex]];
  });
  
  // ========== COMMANDES ==========
  
  // Récupération de toutes les commandes - config défini même si non utilisé
  mock.onGet('/orders').reply((_config) => {
    return [200, mockOrders];
  });
  
  // Récupération d'une commande par ID
  mock.onGet(/\/orders\/\d+/).reply((config) => {
    const id = config.url.split('/').pop();
    const order = mockOrders.find(o => o.id.toString() === id);
    
    if (!order) {
      return [404, { message: 'Commande non trouvée' }];
    }
    
    return [200, order];
  });
  
  // Création d'une commande
  mock.onPost('/orders').reply((config) => {
    const orderData = JSON.parse(config.data);
    
    const newOrder = {
      id: `order-${mockOrders.length + 1}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Ajout de la commande au mock
    mockOrders.push(newOrder);
    
    return [201, newOrder];
  });
  
  // Mise à jour du statut d'un item de commande
  mock.onPut(/\/orders\/\d+\/items\/\d+\/status/).reply((config) => {
    const orderId = config.url.split('/')[2];
    const itemId = config.url.split('/')[4];
    const { status } = JSON.parse(config.data);
    
    const orderIndex = mockOrders.findIndex(o => o.id.toString() === orderId);
    
    if (orderIndex === -1) {
      return [404, { message: 'Commande non trouvée' }];
    }
    
    const itemIndex = mockOrders[orderIndex].items.findIndex(i => i.id.toString() === itemId);
    
    if (itemIndex === -1) {
      return [404, { message: 'Item de commande non trouvé' }];
    }
    
    // Mise à jour du statut de l'item
    mockOrders[orderIndex].items[itemIndex] = {
      ...mockOrders[orderIndex].items[itemIndex],
      status
    };
    
    return [200, mockOrders[orderIndex].items[itemIndex]];
  });

  // ========== MENU ITEMS ==========
  
  // Récupération de tous les items du menu - config défini même si non utilisé
  mock.onGet('/menu-items').reply((_config) => {
    return [200, mockMenuItems];
  });

  // Gestion des routes non mockées
  mock.onAny().passThrough(); // Laisse passer les requêtes non mockées
};

export default setupMock;