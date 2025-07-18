import Fastify from 'fastify'
import databasePlugin from './plugins/database.js'
import UserController from './modules/users/user.controller.js'
import constants from './utils/constants.js'

const fastify = Fastify({ logger: true })

async function start() {
  try {
    // Registrar plugin do banco
    await fastify.register(databasePlugin)
    
    // Conectar ao banco usando variáveis de ambiente
    await fastify.dbManager.connect({
      host: constants.POSTGRES_HOST,
      port: constants.POSTGRES_PORT,
      database: constants.POSTGRES_DB,
      username: constants.POSTGRES_USER,
      password: constants.POSTGRES_PASSWORD
    })
    
    // Criar tabelas
    await fastify.dbManager.createTables()

    const client = await fastify.dbManager.getClient()
    
    // Registrar rotas
    const userController = new UserController(client)
    
    fastify.get('/users/:id', userController.getUserByID.bind(userController))
    fastify.post('/users', userController.addUser.bind(userController))
    fastify.put('/users/:id', userController.updateUser.bind(userController))
    fastify.delete('/users/:id', userController.deleteUser.bind(userController))
    
    const port = constants.API_PORT
    await fastify.listen({ port, host: '0.0.0.0' })
    console.log(`Server running on http://localhost:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()