import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import cors from 'cors';

const app = express()

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', indexRouter)
app.use('/users', usersRouter)

app.use(cors({
    origin: 'http://127.0.0.1:5500', // Altere para a origem correta do seu front-end
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
/*************** ROTAS *******************/

import usuariosRouter from './routes/usuarios.js'
app.use('/usuarios', usuariosRouter)

import oficinasRouter from './routes/oficinas.js'
app.use('/oficinas', oficinasRouter)

import tipoServicosRouter from './routes/tipoServicos.js'
app.use('/tipoServicos', tipoServicosRouter)

import veiculosRouter from './routes/veiculos.js'
app.use('/veiculos', veiculosRouter)

export default app;
