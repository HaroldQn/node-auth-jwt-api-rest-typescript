import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import authRoutes from './routes/authRoutes'
import userRouters from './routes/userRouters'

const app = express();
app.use(express.json());

// Routes
app.use('/auth', authRoutes)
app.use('/users', userRouters)

// Autenticacion

// TODO FALTA HACER UNA API REST DE USUARIO
// User 

export default app