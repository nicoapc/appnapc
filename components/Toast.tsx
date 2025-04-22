import axios from 'axios';

const API_URL = 'http://localhost:3001'; // cambia por tu IP si pruebas en celular físico

export const register = async (email: string, password: string) => {
  return axios.post(`${API_URL}/api/register`, { email, password });
};

export const login = async (email: string, password: string) => {
  return axios.post(`${API_URL}/api/login`, { email, password });
};