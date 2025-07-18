import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import UserService from './user.service'
import { PoolClient } from 'pg'
import { UserCreate } from './user.schema'

interface UserParams {
  id: string
}

export default class UserController {
  private userService: UserService

  constructor(client: PoolClient) {
    this.userService = new UserService(client)
  }

  async getUserByID(request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) {
    try {
      const userId = request.params.id
      const user = await this.userService.getUserById(userId)
      
      if (!user) {
        return reply.status(404).send({ error: 'User not found' })
      }
      
      return reply.send(JSON.stringify(user))
    } catch (error) {
      return reply.status(500).send({ error: 'Internal server error' })
    }
  }


  async addUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userData = request.body as UserCreate
      const user = await this.userService.addUser(userData)
      return reply.status(201).send(JSON.stringify(user))
    } catch (error) {
      return reply.status(500).send({ error: 'Internal server error' })
    }
  }

  async updateUser(request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) {
    try {
      const userId = request.params.id
      const userData = request.body as Partial<UserCreate>
      const updatedUser = await this.userService.updateUser(userId, userData)
      
      if (!updatedUser) {
        return reply.status(404).send({ error: 'User not found' })
      }
      
      return reply.send(JSON.stringify(updatedUser))
    } catch (error) {
      return reply.status(500).send({ error: 'Internal server error' })
    }
  }

  async deleteUser(request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) {
    try {
      const userId = request.params.id
      const deleted = await this.userService.deleteUser(userId)
      
      if (!deleted) {
        return reply.status(404).send({ error: 'User not found' })
      }
      
      return reply.status(204).send()
    } catch (error) {
      return reply.status(500).send({ error: 'Internal server error' })
    }
  }
}