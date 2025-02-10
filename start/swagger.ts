import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

// Definindo a documentação do Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API AdonisJS',
    version: '1.0.0',
    description: 'Documentação da API usando Swagger',
  },
  servers: [
    {
      url: 'http://localhost:3333', // Endereço da sua API
      description: 'Servidor local',
    },
  ],
}

const options = {
  swaggerDefinition,
  apis: ['app/controllers/*.ts'], // Caminho correto para os controladores
}

const swaggerSpec = swaggerJSDoc(options)

swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
})

export { swaggerSpec, swaggerUi }
