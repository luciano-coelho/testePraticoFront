import React, { useEffect, useState } from 'react';
import { fetchTasks, toggleTaskComplete } from '../services/api';
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
  Tooltip,
  Stack,
  Chip,
  Button,
  Box,
  Pagination,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useNavigate } from 'react-router-dom';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks(page);
        setTasks(data.results || []);
        setTotalPages(Math.ceil(data.count / 10));
      } catch (error) {
        console.error("Erro ao carregar as tarefas:", error);
      }
    };
    loadTasks();
  }, [page]);

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

  const handleAddTask = () => {
    navigate('/create-task'); 
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
      <TableContainer component={Paper} sx={{ maxWidth: 900, p: 3, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5" fontWeight="bold">
            Lista de Tarefas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddTask}
            sx={{ bgcolor: '#007bff', ':hover': { bgcolor: '#0056b3' } }}
          >
            Adicionar Tarefa
          </Button>
        </Stack>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Título</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Descrição</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Categoria</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Compartilhado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <React.Fragment key={task.id}>
                  <TableRow>
                    <TableCell>
                      <Tooltip title={task.completed ? 'Concluída' : 'Pendente'}>
                        <Checkbox
                          checked={task.completed}
                          icon={<RadioButtonUncheckedIcon />}
                          checkedIcon={<CheckCircleOutlineIcon />}
                          onChange={() => handleToggleComplete(task.id)}
                          sx={{
                            color: task.completed ? 'green' : 'gray',
                            '&.Mui-checked': { color: 'green' },
                          }}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        style={{
                          textDecoration: task.completed ? 'line-through' : 'none',
                          fontWeight: task.completed ? 'normal' : 'bold',
                          color: task.completed ? '#888' : 'inherit',
                        }}
                      >
                        {task.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        style={{
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? '#888' : 'inherit',
                        }}
                      >
                        {task.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.category ? task.category.name : 'Sem categoria'}
                        color={task.category ? 'primary' : 'default'}
                        variant={task.category ? 'outlined' : 'filled'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {task.shared_with.length > 0 ? (
                        <Tooltip
                          title={`Compartilhado com: ${task.shared_with
                            .map((user) => user.username)
                            .join(', ')}`}
                        >
                          <Stack direction="row" spacing={1}>
                            {task.shared_with.map((user) => (
                              <Chip
                                key={user.id}
                                label={user.username}
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        </Tooltip>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Não compartilhado
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Divider />
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nenhuma tarefa encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* Componente de paginação */}
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={totalPages} 
            page={page}
            onChange={handlePageChange} 
            color="primary"
          />
        </Box>
      </TableContainer>
    </Box>
  );
}

export default TaskList;
