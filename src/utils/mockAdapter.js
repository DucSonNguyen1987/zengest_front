import MockAdapter from 'axios-mock-adapter';
import { 
  mockUsers, 
  mockUserRoles,
  mockTables, 
  mockReservations,
  mockOrders,
  mockMenuItems
} from '../mocks/data';

const generateValidMockToken = (userId) => {
  const header = { "alg": "HS256", "typ": "JWT" };
  const payload = {
    "sub": userId,
    "iat": Math.floor(Date.now() / 1000),
    "exp": Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    "mock": true,
    "role": mockUsers.find(u => u.id === userId)?.role || 'guest'
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const fakeSignature = btoa(`mock-signature-${userId}-${Date.now()}`);

  return `${encodedHeader}.${encodedPayload}.${fakeSignature}`;
};

const setupMock = (axiosInstance) => {
  // ✅ LOGS DÉSACTIVÉS TEMPORAIREMENT
  const ENABLE_LOGS = false;
  
  const log = (message) => {
    if (ENABLE_LOGS) console.log(`🎭 Mock: ${message}`);
  };
  
  try {
    const mock = new MockAdapter(axiosInstance, { 
      delayResponse: 100, // Réduit à 100ms
      onNoMatch: "throwException"
    });

    // ✅ AUTHENTIFICATION ULTRA-SIMPLIFIÉE
    mock.onPost('/auth/login').reply((config) => {
      try {
        const { email, password } = JSON.parse(config.data);
        const user = mockUsers.find(u => u.email === email);
        
        if (!user || user.password !== password) {
          return [401, { message: 'Email ou mot de passe incorrect' }];
        }
        
        const { password: _, ...userWithoutPassword } = user;
        const validToken = generateValidMockToken(user.id);
        
        return [200, { user: userWithoutPassword, token: validToken }];
      } catch (error) {
        return [400, { message: 'Données invalides' }];
      }
    });
    
    mock.onPost('/auth/register').reply((config) => {
      try {
        const userData = JSON.parse(config.data);
        
        if (mockUsers.some(u => u.email === userData.email)) {
          return [400, { message: 'Cet email est déjà utilisé' }];
        }
        
        const newUser = {
          id: `user-${mockUsers.length + 1}`,
          ...userData,
          createdAt: new Date().toISOString()
        };
        
        mockUsers.push(newUser);
        return [201, { message: 'Inscription réussie' }];
      } catch (error) {
        return [400, { message: 'Données invalides' }];
      }
    });
    
    mock.onGet('/auth/me').reply((config) => {
      const authHeader = config.headers.Authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return [401, { message: 'Token requis' }];
      }
      
      const token = authHeader.substring(7);
      
      try {
        const parts = token.split('.');
        if (parts.length !== 3) return [401, { message: 'Token invalide' }];
        
        const payload = JSON.parse(atob(parts[1]));
        const user = mockUsers.find(u => u.id === payload.sub);
        
        if (!user) return [401, { message: 'Utilisateur non trouvé' }];
        
        const { password: _, ...userWithoutPassword } = user;
        return [200, userWithoutPassword];
      } catch (error) {
        return [401, { message: 'Token invalide' }];
      }
    });
    
    mock.onPost('/auth/logout').reply(() => [200, { message: 'Déconnexion réussie' }]);

    // ✅ FLOOR PLANS SIMPLIFIÉS
    const mockFloorPlans = [
      {
        id: '1',
        name: 'Salle principale',
        description: 'Rez-de-chaussée',
        tables: [
          { id: '101', label: 'Table 1', capacity: 4, shape: 'rectangle', color: '#3498db', x: 100, y: 100, width: 80, height: 80, rotation: 0 },
          { id: '102', label: 'Table 2', capacity: 2, shape: 'circle', color: '#e74c3c', x: 250, y: 120, width: 60, height: 60, rotation: 0 }
        ],
        obstacles: [],
        perimeter: [],
        capacityLimit: 50
      }
    ];

    mock.onGet('/floor-plans').reply(() => [200, mockFloorPlans]);
    mock.onGet(/\/floor-plans\/\w+/).reply((config) => {
      const id = config.url.split('/').pop();
      const plan = mockFloorPlans.find(p => p.id === id);
      return plan ? [200, plan] : [404, { message: 'Plan non trouvé' }];
    });

    mock.onPost('/floor-plans').reply((config) => {
      try {
        const data = JSON.parse(config.data);
        const newPlan = { id: Date.now().toString(), ...data };
        return [201, newPlan];
      } catch (error) {
        return [400, { message: 'Données invalides' }];
      }
    });

    // Autres routes simplifiées
    mock.onGet('/user-roles').reply(() => [200, mockUserRoles]);
    mock.onGet('/tables').reply(() => [200, mockTables]);
    mock.onGet('/reservations').reply(() => [200, mockReservations]);
    mock.onGet('/orders').reply(() => [200, mockOrders]);
    mock.onGet('/menu-items').reply(() => [200, mockMenuItems]);
    mock.onAny().reply(() => [404, { message: 'Route non trouvée' }]);

  } catch (error) {
    console.error('Erreur MockAdapter:', error);
  }
};

export default setupMock;