import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { Pool, PoolClient } from 'pg'

// Extend FastifyInstance to include 'pg'
declare module 'fastify' {
    interface FastifyInstance {
        pg: Pool & {
        connect(): Promise<PoolClient>
        }
    }
}

export interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
}

export class DatabaseHandler {
    private fastify: FastifyInstance

    constructor(fastify: FastifyInstance) {
        this.fastify = fastify
    }

  async connect(config: DatabaseConfig): Promise<void> {
    const connectionString = `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`
    
    await this.fastify.register(require('@fastify/postgres'), {
      connectionString
    })
  }

  async createTables(): Promise<void> {
    const client: PoolClient = await this.fastify.pg.connect()
    
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      console.log('Tables created successfully')
    } catch (error) {
      console.error('Error creating tables:', error)
      throw error
    } finally {
      client.release()
    }
  }

    async getConnection() : Promise<PoolClient> {
    return this.fastify.pg.connect()
  }
}

export default fp(async function (fastify: FastifyInstance) {
  const dbManager = new DatabaseHandler(fastify)
  fastify.decorate('dbManager', dbManager)
})