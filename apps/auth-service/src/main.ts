import express from 'express';
import cors from 'cors';
import { errorHandler } from '../../../packages/error-hunlder/error-middleware.js';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import router from './routes/auth.router.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.config.mjs';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 6001;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API'});
});

// Setup Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/docs-json", (req, res) => {
  res.json(swaggerSpec);
});

app.use('/auth', router);
app.use(errorHandler);

const server = app.listen(port, host, () => {
  console.log(`Auth service is running at http://${host}:${port}/api`);
  console.log(`Swagger docs available at http://${host}:${port}/api-docs`);
});

server.on("error", (err) => {
  console.log("Server Error:", err);
});