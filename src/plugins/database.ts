import fastifyPostgres from '@fastify/postgres'
import type { PostgresDb } from '@fastify/postgres'
import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { PoolClient } from 'pg'

declare module 'fastify' {
    interface FastifyInstance {
        pg: PostgresDb & Record<string, PostgresDb>
        dbManager: DatabaseHandler
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

        // ✅ Usar import ES modules ao invés de require
        await this.fastify.register(fastifyPostgres, {
            connectionString,
        })
    }

    /**
     * Creates the necessary tables in the database.
     * This method should be called after connecting to the database.
     */
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
        } catch (error) {
            throw new Error('Failed to create tables: ' + String(error))
        } finally {
            client.release()
        }
    }

    /**
     * Retrieves a database client for executing queries.
     * @returns A PoolClient instance.
     */
    async getClient(): Promise<PoolClient> {
        return this.fastify.pg.connect()
    }
}

export default fp(async function (fastify: FastifyInstance) {
    const dbManager = new DatabaseHandler(fastify)
    fastify.decorate('dbManager', dbManager)
})
