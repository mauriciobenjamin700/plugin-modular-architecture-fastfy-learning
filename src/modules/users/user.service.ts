import UserRepository from './user.repository'
import { UserCreate, UserUpdate, UserResponse } from './user.schema'
import { PoolClient } from 'pg'


/**
 * Methods:
 * - addUser: Adds a new user to the database.
 * - getUserById: Retrieves a user by their ID.
 * - updateUser: Updates an existing user.
 * - deleteUser: Deletes a user by their ID.
 */
export default class UserService {
    private userRepository: UserRepository

    constructor(client: PoolClient) {
    this.userRepository = new UserRepository(client)
    }

    async addUser(data: UserCreate): Promise<UserResponse> {
        try{
            const userModel = this.userRepository.mapUserCreateToModel(data)
            const createdUser = await this.userRepository.addUser(userModel)
            return this.userRepository.mapUserModelToResponse(createdUser)
        }
        catch (error) {
            throw new Error(`Failed to add user in UserService: ${error}`)
        }
    }

    async getUserById(id: string): Promise<UserResponse> {
        try {
            const user = await this.userRepository.getUserById(id)
            if (!user) {
                throw new Error('User not found')
            }
            return this.userRepository.mapUserModelToResponse(user)
        } catch (error) {
            throw new Error(`Failed to get user by ID in UserService: ${error}`)
        }
    }
    async updateUser(id: string, data: UserUpdate): Promise<UserResponse> {
        try {
            const user = await this.userRepository.getUserById(id)
            if (!user) {
                throw new Error('User not found')
            }

            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([value]) => value != null)
            )

            Object.assign(user, { 
                ...filteredData, 
                updated_at: new Date() 
            })

            const updatedUser = await this.userRepository.updateUser(user)

            if (!updatedUser) {
                throw new Error('Failed to update user')
            }

            return this.userRepository.mapUserModelToResponse(updatedUser)
        } catch (error) {
            throw new Error(`Failed to update user in UserService: ${error}`)
        }
    }

    async deleteUser(id: string): Promise<boolean> {
        try {
            const deleted = await this.userRepository.deleteUser(id)
            if (!deleted) {
                throw new Error('Failed to delete user')
            }
            return true
        } catch (error) {
            throw new Error(`Failed to delete user in UserService: ${error}`)
        }
    }

}