import React, { useEffect, useState } from 'react';
import { fetchTasks, toggleTaskComplete, fetchTask, updateTask, fetchCategories } from '../services/api';
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
  IconButton,
  Modal,
  TextField,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [categories, setCategories] = useState([]);
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

    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    loadTasks();
    loadCategories();
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

  const handleOpenModal = async (taskId) => {
    try {
      const task = await fetchTask(taskId);
      setSelectedTask(task);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Erro ao buscar dados da tarefa:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleEditChange = (e) => {
    const { name, value, checked, type } = e.target;
    setSelectedTask((prevTask) => ({
      ...prevTask,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedTask((prevTask) => ({
      ...prevTask,
      category: categories.find((category) => category.id === categoryId),
    }));
  };

  const handleUpdateTask = async () => {
    try {
      await updateTask(selectedTask.id, {
        title: selectedTask.title,
        description: selectedTask.description,
        completed: selectedTask.completed,
        category_id: selectedTask.category ? selectedTask.category.id : null,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === selectedTask.id ? selectedTask : task
        )
      );
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
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
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Editar</TableCell>
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
                    <TableCell align="center">
                      <IconButton onClick={() => handleOpenModal(task.id)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1"
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
                        <Tooltip title={`Compartilhado com: ${task.shared_with.map((user) => user.username).join(', ')}`}>
                          <Stack direction="row" spacing={1}>
                            {task.shared_with.map((user) => (
                              <Chip key={user.id} label={user.username} size="small" color="success" variant="outlined" />
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
                    <TableCell colSpan={6}>
                      <Divider />
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
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
          />
        </Box>
      </TableContainer>

      {/* Modal de Edição */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px',
        }}>
          <Typography variant="h6" gutterBottom>Editar Tarefa</Typography>
          {selectedTask && (
            <>
              <TextField
                label="Título"
                name="title"
                variant="filled"
                fullWidth
                value={selectedTask.title}
                onChange={handleEditChange}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Descrição"
                name="description"
                variant="filled"
                fullWidth
                multiline
                minRows={3}
                value={selectedTask.description}
                onChange={handleEditChange}
                sx={{ mb: 2 }}
              />
              <FormControl variant="filled" fullWidth sx={{ mb: 2 }}>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={selectedTask.category ? selectedTask.category.id : ''}
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="">Nenhuma categoria</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedTask.completed}
                    onChange={handleEditChange}
                    name="completed"
                    color="primary"
                  />
                }
                label="Tarefa concluída"
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                <Button onClick={handleCloseModal} color="secondary">Cancelar</Button>
                <Button variant="contained" onClick={handleUpdateTask} color="primary">Salvar</Button>
              </Stack>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default TaskList;
