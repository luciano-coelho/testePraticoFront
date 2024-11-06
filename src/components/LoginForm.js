import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Modal,
  Stack,
} from '@mui/material';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerData, setRegisterData] = useState({ username: '', password: '', email: '' });
  const [registerError, setRegisterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await loginUser(username, password);
      setError('');
      navigate('/tasks');
    } catch (error) {
      setError(error?.response?.data?.message || 'Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      await registerUser(registerData.username, registerData.password, registerData.email);
      setRegisterError('');
      setIsRegisterModalOpen(false);
    } catch (error) {
      setRegisterError('Erro ao registrar. Verifique os dados e tente novamente.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    handleLogin();
  };

  const handleOpenRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
    setRegisterError('');
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
          maxWidth: 360,
          width: '100%',
          borderRadius: '12px',
          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Bem-vindo(a)!
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Usuário"
              variant="filled"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Senha"
              variant="filled"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            {error && (
              <Alert severity="error" sx={{ fontSize: '0.9rem', textAlign: 'center' }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading}
              sx={{ paddingY: 1.2 }}
              fullWidth
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            <Typography align="center" variant="body2">
              Ainda não tem uma conta?{' '}
              <Link onClick={handleOpenRegisterModal} color="primary" underline="hover" sx={{ cursor: 'pointer' }}>
                Cadastre-se
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>

      <Modal open={isRegisterModalOpen} onClose={handleCloseRegisterModal}>
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: 4,
            width: 400,
            borderRadius: '12px',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Cadastre-se
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Usuário"
              variant="filled"
              value={registerData.username}
              onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Senha"
              variant="filled"
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Email"
              variant="filled"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            {registerError && (
              <Alert severity="error" sx={{ fontSize: '0.9rem', textAlign: 'center' }}>
                {registerError}
              </Alert>
            )}
            <Stack direction="row" justifyContent="space-between">
              <Button onClick={handleCloseRegisterModal} color="secondary">
                Cancelar
              </Button>
              <Button onClick={handleRegister} variant="contained" color="primary">
                Cadastrar
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Modal>
    </Box>
  );
}

export default LoginForm;
