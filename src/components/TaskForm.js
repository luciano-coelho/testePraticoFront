import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Modal,
} from '@mui/material';
import { createTask, fetchCategories, createCategory, fetchUsers, shareTask } from '../services/api';

function TaskForm() {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    completed: false,
    category_id: '',
  });
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategoriesAndUsers = async () => {
      try {
        const categoriesList = await fetchCategories();
        setCategories(categoriesList);
        
        const usersList = await fetchUsers();
        setUsers(usersList);
      } catch (error) {
        console.error('Erro ao carregar categorias ou usuários:', error);
      }
    };
    loadCategoriesAndUsers();
  }, []);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryChange = (event) => {
    setTaskData((prevData) => ({
      ...prevData,
      category_id: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const createdTask = await createTask(taskData);
      setSuccessMessage('Tarefa criada com sucesso!');
      setError('');

      if (selectedUser) {
        await shareTask(createdTask.id, selectedUser);
      }

      setTimeout(() => navigate('/tasks'), 2000);
    } catch (error) {
      setError('Erro ao criar a tarefa. Tente novamente.');
      setSuccessMessage('');
    }
  };

  const openCategoryModal = () => setIsCategoryModalOpen(true);
  const closeCategoryModal = () => setIsCategoryModalOpen(false);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const newCategory = await createCategory(newCategoryName);
      setCategories([...categories, newCategory]);
      setTaskData((prevData) => ({ ...prevData, category_id: newCategory.id }));
      setNewCategoryName('');
      closeCategoryModal();
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f3f4f6"
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 500,
          width: '100%',
          borderRadius: '12px',
          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Nova Tarefa
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Título"
              name="title"
              variant="filled"
              value={taskData.title}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Descrição"
              name="description"
              variant="filled"
              multiline
              minRows={3}
              value={taskData.description}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl variant="filled" fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                name="category_id"
                value={taskData.category_id}
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
            <Button variant="text" onClick={openCategoryModal} color="primary">
              + Nova Categoria
            </Button>

            {/* Campo para selecionar o usuário com quem compartilhar */}
            <FormControl variant="filled" fullWidth>
              <InputLabel>Compartilhar com</InputLabel>
              <Select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                displayEmpty
              >
                <MenuItem value=""></MenuItem>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.username}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    Nenhum usuário disponível
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={taskData.completed}
                  onChange={handleChange}
                  name="completed"
                  color="primary"
                />
              }
              label="Tarefa concluída"
            />
            {error && (
              <Alert severity="error" sx={{ fontSize: '0.9rem', textAlign: 'center' }}>
                {error}
              </Alert>
            )}
            {successMessage && (
              <Alert severity="success" sx={{ fontSize: '0.9rem', textAlign: 'center' }}>
                {successMessage}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ paddingY: 1.2 }}
              fullWidth
            >
              Criar Tarefa
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/tasks')}
            >
              Cancelar
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* Modal para criar nova categoria */}
      <Modal open={isCategoryModalOpen} onClose={closeCategoryModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Nova Categoria
          </Typography>
          <TextField
            label="Nome da Categoria"
            variant="filled"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            fullWidth
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
            <Button onClick={closeCategoryModal} color="secondary">
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              onClick={handleCreateCategory} 
              color="primary" 
              disabled={!newCategoryName.trim()}
            >
              Criar
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}

export default TaskForm;
