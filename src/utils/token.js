import jwtDecode from 'jwt-decode';

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

// Vérifier si le token est valide (non expiré)
export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    // Vérification de l'expiration du token
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return false;
  }
};

// Décoder le token pour récupérer ses informations
export const getDecodedToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return null;
  }
};