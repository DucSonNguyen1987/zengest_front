// Ce fichier centralise les exports de tous les services d'API

// Import et re-export des services d'authentification
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  checkEmailExists,
  updateUserProfile,
  changePassword,
} from './auth';

// Import et re-export des services de réservation
import {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  cancelReservation,
} from './reservation';

// Import et re-export des services de gestion des tables
import {
  getAllTables,
  getTableById,
  getTableStatus,
  updateTableStatus,
  createTable,
  updateTable,
  deleteTable,
} from './table';

// Import et re-export des services de gestion des commandes
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderItemStatus,
  deleteOrder,
} from './order';

// Import et re-export des services de facturation
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  generateInvoicePdf,
} from './invoice';

// Export de tous les services d'API
export {
  // Services d'authentification
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  checkEmailExists,
  updateUserProfile,
  changePassword,
  
  // Services de réservation
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  cancelReservation,
  
  // Services de gestion des tables
  getAllTables,
  getTableById,
  getTableStatus,
  updateTableStatus,
  createTable,
  updateTable,
  deleteTable,
  
  // Services de gestion des commandes
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderItemStatus,
  deleteOrder,
  
  // Services de facturation
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  generateInvoicePdf,
};