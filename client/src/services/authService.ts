import api from './api';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const registerUser = (data: RegisterData) =>
  api.post('/api/auth/register', data);

export const loginUser = (data: LoginData) =>
  api.post('/api/auth/login', data);