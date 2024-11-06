# Teste Prático Frontend

Este repositório contém o frontend de uma aplicação de gerenciamento de tarefas desenvolvida em React. 

## Tecnologias Utilizadas

- React
- Material-UI (MUI)
- Axios
- React Router

## Pré-requisitos

- Node.js >= 18
- Docker

## Configuração do Projeto

1. **Clone o repositório**:

   ```bash
    git clone https://github.com/luciano-coelho/testePraticoFront.git
    cd testePraticoFront

2. **Crie a imagem Docker**:
    ```bash
    docker build -t task-manager-frontend .

3. **Execute o container Docker**:
    ```bash
    docker run -p 3000:3000 task-manager-frontend

4. **A aplicação estará disponível em**:
    ```bash
    http://localhost:3000

## Scripts Disponíveis

- npm start
- npm run build

## Funcionalidades

**Login e Registro de Usuário**:
- Os usuários podem se registrar e fazer login na aplicação.
- O sistema usa tokens JWT para autenticação. Após o login, o token é armazenado no localStorage.

**CRUD de Tarefas**:
- **Criar Tarefa:** Adicione uma nova tarefa, incluindo título, descrição, e categoria.
- **Editar Tarefa:** Atualize as informações da tarefa, como título, descrição, status de conclusão, e compartilhe com outros usuários.
- **Excluir Tarefa:** Confirme a exclusão de uma tarefa através de um modal.
- **Compartilhar Tarefa:** Atribua a tarefa para outro usuário na aplicação.

**Paginação**:
- A lista de tarefas é paginada.

## Observações

- **API Backend**: Certifique-se de que o backend esteja em execução
- **Conexão com o Banco de Dados:** Este frontend depende da conexão com um backend para funcionar corretamente. Verifique as instruções do backend para configuração.
    ```bash
    https://github.com/luciano-coelho/testePratico/blob/main/README.md

## Decisões de Design

- **Estrutura em Componentes**: A aplicação foi dividida em componentes para que cada funcionalidade principal (ex.: login, criação de tarefas, lista de tarefas) fosse encapsulada em um componente próprio. Isso facilita a manutenção e a reusabilidade.

- **Material-UI para Consistência Visual**: A biblioteca Material-UI foi escolhida para fornecer uma interface amigável e responsiva, além de simplificar o uso de elementos complexos, como diálogos de confirmação e formulários de entrada.

- **Axios para Consumo da API**: Axios foi selecionado para lidar com as requisições HTTP devido à sua simplicidade e flexibilidade. As funções de API foram centralizadas em um único arquivo (api.js) para facilitar a manutenção e isolar as chamadas de rede do restante da lógica do aplicativo.

- **Gerenciamento de Autenticação com Token**: O token de autenticação é armazenado no localStorage, e as rotas privadas são protegidas através da validação de token no frontend. Esse token é incluído no cabeçalho de cada requisição, e a navegação é controlada por componentes de rota privados.

- **Modularização de Estilos e Layout**: O uso de Material-UI permite definir estilos específicos e centralizar o controle de layout, como nos modais de login e edição de tarefa. Isso torna a interface mais responsiva e consistente.