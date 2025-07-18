import Fastify from 'fastify'
import databasePlugin from './plugins/database'
import UserController from './modules/users/user.controller'

const fastify = Fastify({ logger: true })

async function start() {
  try {
    // Registrar plugin do banco
    await fastify.register(databasePlugin)
    
    // Conectar ao banco
    await (fastify as any).dbManager.connect({
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      username: 'postgres',
      password: 'password'
    })
    
    // Criar tabelas
    await (fastify as any).dbManager.createTables()

    const client = (fastify as any).dbManager.getClient()
    
    // Registrar rotas
    const userController = new UserController(client)
    
    fastify.get('/users/:id', userController.getUserByID.bind(userController))
    fastify.post('/users', userController.addUser.bind(userController))
    fastify.put('/users/:id', userController.updateUser.bind(userController))
    fastify.delete('/users/:id', userController.deleteUser.bind(userController))
    
    // Iniciar servidor
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log('Server running on http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()