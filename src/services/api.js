// api.js

import axios from 'axios';

export const fetchTasks = async () => {
  const token = localStorage.getItem('access_token');
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/tasks/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    throw error;
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/token/', {
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
  const token = localStorage.getItem('access_token');
  try {
    const response = await axios.patch(`http://127.0.0.1:8000/api/tasks/${taskId}/toggle_complete/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao alternar status da tarefa:", error);
    throw error;
  }
};
