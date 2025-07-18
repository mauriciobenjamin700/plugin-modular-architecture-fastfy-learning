/**
 * Attributes:
 * - id: string
 * - name: string
 * - email: string
 * - password: string
 * - created_at: Date
 * - updated_at: Date
 */
export default class UserModel {
    id: string
    name: string
    email: string
    password: string
    created_at: Date
    updated_at: Date

  constructor(
    data: {
      id: string
      name: string
      email: string
      password: string
      created_at: Date
      updated_at: Date
    }
  ) {
    this.id = data.id
    this.name = data.name
    this.email = data.email
    this.password = data.password
    this.created_at = data.created_at
    this.updated_at = data.updated_at 
  }

  toJSON() {
    return {
        id: this.id,
        name: this.name,
        email: this.email,
        created_at: this.created_at,
        updated_at: this.updated_at
    }
  }
}