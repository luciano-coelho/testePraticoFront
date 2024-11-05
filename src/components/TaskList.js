import React, { useEffect, useState } from 'react';
import { fetchTasks, toggleTaskComplete } from '../services/api';

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        console.log("Dados recebidos:", data);
        setTasks(data);
      } catch (error) {
        console.error("Erro ao carregar as tarefas:", error);
      }
    };
    loadTasks();
  }, []);

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await toggleTaskComplete(taskId);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: updatedTask.completed } : task
        )
      );
    } catch (error) {
      console.error("Erro ao alternar o status da tarefa:", error);
    }
  };

  return (
    <div>
      <h2>Lista de Tarefas</h2>
      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                />
                <strong>{task.title}</strong> - {task.description} - {task.completed ? "Concluída" : "Pendente"}
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma tarefa encontrada.</p>
      )}
    </div>
  );
}

export default TaskList;
