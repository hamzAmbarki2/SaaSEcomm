// swagger.config.js
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth Service API',
      version: '1.0.0',
      description: 'Authentication service API documentation',
    },
    servers: [
      {
        url: 'http://localhost:6001',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controller/*.ts'], // paths to files containing OpenAPI definitions
};

export const swaggerSpec = swaggerJSDoc(options);
