import { authService } from './authService';

// Funciones de autenticación
const API_URL = 'http://localhost:3001/api/auth';

export interface LoginCredentials {
  email: string;
  contraseña: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  contraseña: string;
  rol_id: number;
}

export async function login(credentials: LoginCredentials) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
      mode: 'cors'
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Error en el inicio de sesión');
    }

    const data = await response.json();
    authService.setSession(data.token, data.user);
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}

export async function register(userData: RegisterData) {
  try {
    console.log('Enviando datos de registro:', userData);
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Credentials': 'true'  // Añadido
      },
      body: JSON.stringify(userData),
      credentials: 'include',
      mode: 'cors'
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error en el registro');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
}

export function logout() {
  authService.clearSession();
  window.location.href = '/login';
}