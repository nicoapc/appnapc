import axios from 'axios';

const API_URL = 'http://192.168.1.28:3001'; // cambia por tu IP si pruebas en celular físico

export const register = async (email: string, password: string) => {
  return axios.post(`${API_URL}/register`, { email, password });
};

export const login = async (email: string, password: string) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export const verifyCode = async (email: string, codigo: string) => {
  return axios.post(`${API_URL}/verify`, { email, codigo });
};