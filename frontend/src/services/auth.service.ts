import api from '@/lib/api-client';

export const AuthService = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user_role', response.data.user.role);
    }
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
  },

  getUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },
  
  updateUserRole: async (userId: string, roleId: number) => {
    const response = await api.put(`/auth/users/${userId}/role`, { role_id: roleId });
    return response.data;
  }
};
