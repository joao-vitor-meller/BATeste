# Use uma imagem oficial do Node.js como base
FROM node:18

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia o arquivo package.json e package-lock.json (se existir)
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todos os arquivos do projeto para o diretório de trabalho no contêiner
COPY . ./

# Compila o projeto AdonisJS (caso use TypeScript)
RUN npm run build

COPY .env ./build

# Expõe a porta que a aplicação irá utilizar
EXPOSE 3333

# Define a variável de ambiente para o ambiente de produção
ENV NODE_ENV=production

# Executa o comando para iniciar o servidor AdonisJS
CMD ["npm", "start"]

