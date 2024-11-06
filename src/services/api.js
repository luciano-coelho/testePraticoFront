import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Função para buscar todas as tarefas com paginação
export const fetchTasks = async (page = 1) => {
  try {
    const response = await axios.get(`${API_URL}/tasks/?page=${page}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    throw error;
  }
};

// Função para fazer login do usuário
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/token/`, {
      username,
      password,
    });
    const { access, refresh } = response.data;

    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);

    return { access, refresh };
  } catch (error) {
    console.error("Erro ao fazer login:", error.response.data);
    throw error;
  }
};

// Função para alternar o status de conclusão de uma tarefa
export const toggleTaskComplete = async (taskId) => {
  try {
    const response = await axios.patch(
      `${API_URL}/tasks/${taskId}/toggle_complete/`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao alternar status da tarefa:", error);
    throw error;
  }
};

// Função para criar uma nova tarefa
export const createTask = async (taskData) => {
  try {
    const response = await axios.post(`${API_URL}/tasks/`, taskData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar tarefa:", error.response.data);
    throw error;
  }
};

// Função para registrar um novo usuário
export const registerUser = async (username, password, email) => {
  try {
    const response = await axios.post(`${API_URL}/register/`, {
      username,
      password,
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error.response.data);
    throw error;
  }
};

// Função para buscar todas as categorias
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories/`, {
      headers: getAuthHeaders(),
    });
    return response.data.results || [];
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return [];
  }
};

// Função para criar uma nova categoria
export const createCategory = async (name) => {
  try {
    const response = await axios.post(
      `${API_URL}/categories/`,
      { name },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    throw error;
  }
};

// Função para buscar todos os usuários
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/`, {
      headers: getAuthHeaders(),
    });
    console.log(response.data);
    
    return response.data.results; 
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
};


// Função para compartilhar uma tarefa com um usuário
export const shareTask = async (taskId, userId) => {
  try {
    await axios.post(
      `${API_URL}/tasks/${taskId}/share/`,
      { user_id: userId },
      {
        headers: getAuthHeaders(),
      }
    );
  } catch (error) {
    console.error("Erro ao compartilhar tarefa:", error);
    throw error;
  }
};

