import GeneratorHandler from '../../utils/generator.js'
import UserModel from './user.model.js'
import { UserCreate, UserResponse } from './user.schema.js'
import { PoolClient } from 'pg'

/**
 * UserRepository class for managing user data in the database.
 * Methods:
 * - addUser: Adds a new user to the database.
 * - getUserById: Retrieves a user by their ID.
 * - getUserByEmail: Retrieves a user by their email.
 * - updateUser: Updates an existing user.
 * - deleteUser: Deletes a user by their ID.
 * - mapUserCreateToModel: Maps UserCreate data to UserModel.
 * - mapRowToUserModel: Maps a database row to UserModel.
 * - mapUserModelToResponse: Maps UserModel to UserResponse.
 */
export default class UserRepository {
  private client: PoolClient

  constructor(client: PoolClient) {
    this.client = client
  }


  /**
   * Adds a new user to the database.
   * @param model - The UserModel instance containing user data.
   * @returns The created UserModel instance.
   * @throws Error if the user already exists.
   */
  async addUser(model: UserModel): Promise<UserModel> {

    const userExistsQuery = `
      SELECT * FROM users WHERE email = $1
    `
    const userExistsResult = await this.client.query(userExistsQuery, [model.email])
    if (userExistsResult.rows.length > 0) {
      throw new Error('User already exists')
    }

    const query = `
      INSERT INTO users (id, name, email, password, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, name, email, password, created_at, updated_at
    `
    const values = [model.id, model.name, model.email, model.password]
    const result = await this.client.query(query, values)
    
    return this.mapRowToUserModel(result.rows[0])
  }

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns The UserModel instance if found, otherwise null.
   */
  async getUserById(id: string): Promise<UserModel | null> {
    const query = `
      SELECT * FROM users WHERE id = $1
    `
    const result = await this.client.query(query, [id])
    
    if (result.rows.length === 0) {
      return null
    }
    
    return this.mapRowToUserModel(result.rows[0])
  }

  /**
   * Retrieves a user by their email.
   * @param email - The email of the user to retrieve.
   * @returns The UserModel instance if found, otherwise null.
   */
  async getUserByEmail(email: string): Promise<UserModel | null> {    const query = `
      SELECT * FROM users WHERE email = $1
    `
    const result = await this.client.query(query, [email])
    
    if (result.rows.length === 0) {
      return null
    }
    
    return this.mapRowToUserModel(result.rows[0])
  }

  /**
   * Updates an existing user in the database.
   * @param model - The UserModel instance containing updated user data.
   * @returns The updated UserModel instance if successful, otherwise null.
   */
  async updateUser(model: UserModel): Promise<UserModel> {
    const query = `
      UPDATE users
      SET name = $1, email = $2, password = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING id, name, email, password, created_at, updated_at
    `
    const values = [model.name, model.email, model.password, model.id]
    const result = await this.client.query(query, values)
    
    return this.mapRowToUserModel(result.rows[0])
  }

  /**
   * Deletes a user by their ID.
   * @param id - The ID of the user to delete.
   * @returns True if the user was deleted, otherwise false.
   */
  async deleteUser(id: string): Promise<boolean> {
    const query = `
      DELETE FROM users WHERE id = $1
    `
    const result = await this.client.query(query, [id])
    
    return (result.rowCount ?? 0) > 0
  }

  /**
   * Maps UserCreate data to UserModel.
   * @param data - The UserCreate data to map.
   * @returns A new UserModel instance with the mapped data.
   */
  mapUserCreateToModel(data: UserCreate): UserModel {
    return new UserModel({
      id: GeneratorHandler.generateId('user'),
      name: data.name,
      email: data.email,
      password: data.password,
      created_at: new Date(),
      updated_at: new Date()
    })
  }

  /**
   * Maps a database row to UserModel.
   * @param row - The database row to map.
   * @returns A new UserModel instance with the mapped data.
   */
  mapRowToUserModel(row: any): UserModel {
    return new UserModel({
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      created_at: row.created_at,
      updated_at: row.updated_at
    })
  }

  /**
   * Maps UserModel to UserResponse.
   * @param model - The UserModel instance to map.
   * @returns A UserResponse object with the mapped data.
   */
  mapUserModelToResponse(model: UserModel): UserResponse {
    return {
      id: model.id,
      name: model.name,
      email: model.email,
      created_at: model.created_at,
      updated_at: model.updated_at
    }
  }
}