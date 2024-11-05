# Usa uma imagem do Node para ambiente de desenvolvimento
FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração do npm
COPY package.json ./
COPY package-lock.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta 3000 para acessar o servidor de desenvolvimento do React
EXPOSE 3001

# Comando para iniciar o servidor de desenvolvimento
CMD ["npm", "start"]
