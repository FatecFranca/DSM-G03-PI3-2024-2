import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'

const app = express()

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', indexRouter)
app.use('/users', usersRouter)

/*************** ROTAS *******************/

import usuariosRouter from './routes/usuarios.js'
app.use('/usuarios', usuariosRouter)

import oficinasRouter from './routes/oficinas.js'
app.use('/oficinas', oficinasRouter)

import veiculosRouter from './routes/veiculos.js'
app.use('/veiculos', veiculosRouter)

export default app
