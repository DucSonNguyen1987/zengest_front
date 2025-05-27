import MockAdapter from 'axios-mock-adapter';
import { 
  mockUsers, 
  mockUserRoles,
  mockTables, 
  mockReservations,
  mockOrders,
  mockMenuItems
} from '../mocks/data';

// ✅ OPTIMISATION: Cache pour les tokens générés
const tokenCache = new Map();
const TOKEN_CACHE_MAX_SIZE = 20;

const generateValidMockToken = (userId) => {
  // Vérifier le cache en premier
  if (tokenCache.has(userId)) {
    return tokenCache.get(userId);
  }
  
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
  const fakeSignature = btoa(`mock-signature-${userId}`);
  const token = `${encodedHeader}.${encodedPayload}.${fakeSignature}`;
  
  // Nettoyer le cache si nécessaire
  if (tokenCache.size >= TOKEN_CACHE_MAX_SIZE) {
    const firstKey = tokenCache.keys().next().value;
    tokenCache.delete(firstKey);
  }
  
  tokenCache.set(userId, token);
  return token;
};

// ✅ OPTIMISATION: Cache pour les utilisateurs par email
const userEmailCache = new Map();
mockUsers.forEach(user => {
  userEmailCache.set(user.email, user);
});

const setupMock = (axiosInstance) => {
  try {
    const mock = new MockAdapter(axiosInstance, { 
      delayResponse: 50, // ✅ Réduit à 50ms pour plus de réactivité
      onNoMatch: "passthrough" // ✅ Changé de throwException à passthrough
    });

    // ✅ OPTIMISATION: Authentification ultra-rapide
    mock.onPost('/auth/login').reply((config) => {
      try {
        const { email, password } = JSON.parse(config.data);
        
        // Utiliser le cache pour la recherche d'utilisateur
        const user = userEmailCache.get(email);
        
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
        
        if (userEmailCache.has(userData.email)) {
          return [400, { message: 'Cet email est déjà utilisé' }];
        }
        
        const newUser = {
          id: `user-${Date.now()}`, // ✅ Plus simple que mockUsers.length
          ...userData,
          createdAt: new Date().toISOString()
        };
        
        // Ajouter au cache
        userEmailCache.set(newUser.email, newUser);
        mockUsers.push(newUser);
        
        return [201, { message: 'Inscription réussie' }];
      } catch (error) {
        return [400, { message: 'Données invalides' }];
      }
    });
    
    // ✅ OPTIMISATION: Token validation ultra-rapide
    mock.onGet('/auth/me').reply((config) => {
      const authHeader = config.headers.Authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return [401, { message: 'Token requis' }];
      }
      
      const token = authHeader.substring(7);
      
      try {
        const parts = token.split('.');
        if (parts.length !== 3) return [401, { message: 'Token invalide' }];
        
        const payload = JSON.parse(atob(parts[1]));
        
        // Vérifier l'expiration rapidement
        if (payload.exp < Math.floor(Date.now() / 1000)) {
          return [401, { message: 'Token expiré' }];
        }
        
        const user = mockUsers.find(u => u.id === payload.sub);
        if (!user) return [401, { message: 'Utilisateur non trouvé' }];
        
        const { password: _, ...userWithoutPassword } = user;
        return [200, userWithoutPassword];
      } catch (error) {
        return [401, { message: 'Token invalide' }];
      }
    });
    
    mock.onPost('/auth/logout').reply(() => [200, { message: 'Déconnexion réussie' }]);

    // ✅ OPTIMISATION: Floor plans simplifiés et mis en cache
    const mockFloorPlans = [
      {
        id: '1',
        name: 'Salle principale',
        description: 'Rez-de-chaussée - 20 places',
        tables: [
          { 
            id: '101', 
            label: 'Table 1', 
            capacity: 4, 
            shape: 'rectangle', 
            color: '#e3f2fd', 
            x: 100, 
            y: 100, 
            width: 80, 
            height: 80, 
            rotation: 0 
          },
          { 
            id: '102', 
            label: 'Table 2', 
            capacity: 2, 
            shape: 'circle', 
            color: '#e8f5e8', 
            x: 250, 
            y: 120, 
            width: 60, 
            height: 60, 
            rotation: 0 
          },
          { 
            id: '103', 
            label: 'Table 3', 
            capacity: 6, 
            shape: 'rectangle', 
            color: '#fff3e0', 
            x: 150, 
            y: 250, 
            width: 120, 
            height: 80, 
            rotation: 0 
          }
        ],
        obstacles: [
          {
            id: 'obs-1',
            x: 50,
            y: 350,
            width: 200,
            height: 20,
            shape: 'rectangle',
            color: '#ffcdd2'
          }
        ],
        perimeter: [
          { x: 50, y: 50 },
          { x: 500, y: 50 },
          { x: 500, y: 400 },
          { x: 50, y: 400 }
        ],
        capacityLimit: 50,
        createdAt: '2024-01-01T10:00:00Z'
      },
      {
        id: '2',
        name: 'Terrasse',
        description: 'Espace extérieur - 14 places',
        tables: [
          { 
            id: '201', 
            label: 'Terrasse 1', 
            capacity: 4, 
            shape: 'circle', 
            color: '#e8f5e8', 
            x: 120, 
            y: 120, 
            width: 70, 
            height: 70, 
            rotation: 0 
          }
        ],
        obstacles: [],
        perimeter: [],
        capacityLimit: 30,
        createdAt: '2024-01-02T10:00:00Z'
      }
    ];

    // ✅ OPTIMISATION: Réponses directes sans traitement
    mock.onGet('/floor-plans').reply(() => [200, mockFloorPlans]);
    
    mock.onGet(/\/floor-plans\/\w+/).reply((config) => {
      const id = config.url.split('/').pop();
      const plan = mockFloorPlans.find(p => p.id === id);
      return plan ? [200, plan] : [404, { message: 'Plan non trouvé' }];
    });

    mock.onPost('/floor-plans').reply((config) => {
      try {
        const data = JSON.parse(config.data);
        const newPlan = { 
          id: Date.now().toString(), 
          createdAt: new Date().toISOString(),
          ...data 
        };
        mockFloorPlans.push(newPlan);
        return [201, newPlan];
      } catch (error) {
        return [400, { message: 'Données invalides' }];
      }
    });

    mock.onPut(/\/floor-plans\/\w+/).reply((config) => {
      try {
        const id = config.url.split('/').pop();
        const data = JSON.parse(config.data);
        const index = mockFloorPlans.findIndex(p => p.id === id);
        
        if (index === -1) {
          return [404, { message: 'Plan non trouvé' }];
        }
        
        mockFloorPlans[index] = { 
          ...mockFloorPlans[index], 
          ...data, 
          id,
          updatedAt: new Date().toISOString()
        };
        
        return [200, mockFloorPlans[index]];
      } catch (error) {
        return [400, { message: 'Données invalides' }];
      }
    });

    mock.onDelete(/\/floor-plans\/\w+/).reply((config) => {
      const id = config.url.split('/').pop();
      const index = mockFloorPlans.findIndex(p => p.id === id);
      
      if (index === -1) {
        return [404, { message: 'Plan non trouvé' }];
      }
      
      mockFloorPlans.splice(index, 1);
      return [204]; // No Content
    });

    // ✅ OPTIMISATION: Autres routes avec réponses directes
    mock.onGet('/user-roles').reply(() => [200, mockUserRoles]);
    mock.onGet('/tables').reply(() => [200, mockTables]);
    mock.onGet('/reservations').reply(() => [200, mockReservations]);
    mock.onGet('/orders').reply(() => [200, mockOrders]);
    mock.onGet('/menu-items').reply(() => [200, mockMenuItems]);
    
    // ✅ Routes génériques pour les autres endpoints
    mock.onGet(/\/users\/\w+\/roles\/\w+/).reply(() => [200, { hasRole: true }]);
    mock.onGet(/\/user-roles\/\w+\/users/).reply(() => [200, []]);
    mock.onGet(/\/user-roles\/\w+/).reply(() => [200, { id: 'admin', name: 'Administrateur' }]);
    
    // ✅ Fallback optimisé
    mock.onAny().reply((config) => {
      console.warn(`Mock: Route non trouvée ${config.method?.toUpperCase()} ${config.url}`);
      return [404, { message: 'Route non trouvée' }];
    });

  } catch (error) {
    console.error('Erreur MockAdapter:', error);
    // Fallback en cas d'erreur - désactiver les mocks
    return null;
  }
};

export default setupMock;