import axiosInstance from '../../utils/axios';
import {
  fetchFloorPlansStart,
  fetchFloorPlansSuccess,
  fetchFloorPlansFailure,
  fetchFloorPlanStart,
  fetchFloorPlanSuccess,
  fetchFloorPlanFailure,
  createFloorPlanStart,
  createFloorPlanSuccess,
  createFloorPlanFailure,
  updateFloorPlanStart,
  updateFloorPlanSuccess,
  updateFloorPlanFailure,
  deleteFloorPlanStart,
  deleteFloorPlanSuccess,
  deleteFloorPlanFailure
} from '../slices/floorPlanSlice';

// Action pour récupérer tous les plans
export const fetchFloorPlans = () => async (dispatch) => {
  try {
    dispatch(fetchFloorPlansStart());
    const response = await axiosInstance.get('/floor-plans');
    dispatch(fetchFloorPlansSuccess(response.data));
  } catch (error) {
    dispatch(fetchFloorPlansFailure(error.message));
  }
};

// Action pour récupérer un plan spécifique
export const fetchFloorPlan = (id) => async (dispatch) => {
  try {
    dispatch(fetchFloorPlanStart());
    const response = await axiosInstance.get(`/floor-plans/${id}`);
    dispatch(fetchFloorPlanSuccess(response.data));
  } catch (error) {
    dispatch(fetchFloorPlanFailure(error.message));
  }
};

// Action pour créer un nouveau plan
export const createFloorPlan = (floorPlanData) => async (dispatch) => {
  try {
    dispatch(createFloorPlanStart());
    const response = await axiosInstance.post('/floor-plans', floorPlanData);
    dispatch(createFloorPlanSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(createFloorPlanFailure(error.message));
    throw error;
  }
};

// Action pour mettre à jour un plan
export const updateFloorPlan = (id, floorPlanData) => async (dispatch) => {
  try {
    dispatch(updateFloorPlanStart());
    const response = await axiosInstance.put(`/floor-plans/${id}`, floorPlanData);
    dispatch(updateFloorPlanSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(updateFloorPlanFailure(error.message));
    throw error;
  }
};

// Action pour supprimer un plan
export const deleteFloorPlan = (id) => async (dispatch) => {
  try {
    dispatch(deleteFloorPlanStart());
    await axiosInstance.delete(`/floor-plans/${id}`);
    dispatch(deleteFloorPlanSuccess(id));
  } catch (error) {
    dispatch(deleteFloorPlanFailure(error.message));
    throw error;
  }
};