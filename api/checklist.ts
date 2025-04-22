import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.28:3001'; // cambia por tu IP si pruebas en celular físico

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getItems = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/items`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching checklist items:', error);
    throw error;
  }
};

export const createItem = async (item: { nombre: string; completado: boolean }) => {
  try {
    const headers = await getAuthHeaders();
    console.log('nombre', item.nombre);
    const response = await axios.post(`${API_URL}/items`, item, { headers });
    return response.data;
  } catch (error) {
    console.error('Error creating checklist item:', error);
    throw error;
  }
};

export const updateItem = async (id: string, updatedItem: { nombre?: string; completado?: boolean }) => {
  try {
    const headers = await getAuthHeaders();
    console.log('nombre actualizado', updatedItem.nombre);
    const response = await axios.put(`${API_URL}/items/${id}`, updatedItem, { headers });
    return response.data;
  } catch (error) {
    console.error('Error updating checklist item:', error);
    throw error;
  }
};

export const deleteItem = async (id: string) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.delete(`${API_URL}/items/${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error deleting checklist item:', error);
    throw error;
  }
};


