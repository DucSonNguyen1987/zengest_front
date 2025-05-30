import {jwtDecode} from 'jwt-decode';

// Récupérer le token depuis le localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Enregistrer le token dans le localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Supprimer le token du localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Vérifier si c'est un token de mock (pour le développement)
const isMockToken = (token) => {
  return token && token.startsWith('mock-jwt-token-');
};

// Créer un token JWT factice valide pour les mocks
const createValidMockToken = (userId) => {
  // Créer un header JWT basique
  const header = {
    "alg": "HS256",
    "typ": "JWT"
  };

  // Créer un payload JWT avec expiration dans 24h
  const payload = {
    "sub": userId,
    "iat": Math.floor(Date.now() / 1000),
    "exp": Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24h
    "mock": true
  };

  // Encoder en base64 (simulation d'un vrai JWT)
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const fakeSignature = btoa(`mock-signature-${userId}`);

  return `${encodedHeader}.${encodedPayload}.${fakeSignature}`;
};

// Vérifier si le token est valide (non expiré)
export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;

  try {
    // Gestion spéciale pour les anciens tokens de mock mal formés
    if (isMockToken(token)) {
      console.log('🎭 Détection d\'un ancien token de mock, conversion en cours...');
      
      // Extraire l'ID utilisateur de l'ancien token
      const parts = token.split('-');
      const userId = parts.length > 3 ? parts[3] : 'user-1';
      
      // Créer un nouveau token valide et le sauvegarder
      const newValidToken = createValidMockToken(userId);
      setToken(newValidToken);
      
      console.log('✅ Token de mock converti avec succès');
      return true;
    }

    // Décoder le token JWT normal
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Vérification de l'expiration du token
    const isValid = decoded.exp > currentTime;
    
    if (!isValid) {
      console.log('❌ Token expiré, suppression...');
      removeToken();
    }
    
    return isValid;
  } catch (_error) {
    console.error('❌ Erreur lors de la vérification du token:', error);
    console.log('🧹 Nettoyage du token invalide...');
    
    // Supprimer le token invalide
    removeToken();
    return false;
  }
};

// Décoder le token pour récupérer ses informations
export const getDecodedToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    // Gestion spéciale pour les tokens de mock mal formés
    if (isMockToken(token)) {
      // Convertir d'abord le token
      if (isTokenValid()) {
        // Récupérer le nouveau token converti
        const newToken = getToken();
        return jwtDecode(newToken);
      }
      return null;
    }

    return jwtDecode(token);
  } catch (_error) {
    console.error('❌ Erreur lors du décodage du token:', error);
    removeToken();
    return null;
  }
};

// Utilitaire pour nettoyer complètement l'authentification
export const clearAuth = () => {
  console.log('🧹 Nettoyage complet de l\'authentification...');
  removeToken();
  // Nettoyer d'autres données d'auth si nécessaire
  localStorage.removeItem('user');
  localStorage.removeItem('authTimestamp');
};

// Utilitaire pour générer un token de mock valide (pour les tests)
export const generateMockToken = (userId = 'user-1', expirationHours = 24) => {
  return createValidMockToken(userId);
};