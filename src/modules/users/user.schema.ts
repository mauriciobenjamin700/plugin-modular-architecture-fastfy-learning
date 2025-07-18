/**
 * Attributes:
 * - name: string
 * - email: string
 * - password: string
 */
export interface UserCreate{
    name: string
    email: string
    password: string
}

/**
 * Attributes:
 * - name?: string
 * - email?: string
 * - password?: string
 */
export interface UserUpdate {
    name?: string
    email?: string
    password?: string
}

/**
 * Attributes:
 * - id: string
 * - name: string
 * - email: string
 * - created_at: Date
 * - updated_at: Date
 */
export interface UserResponse {
    id: string
    name: string
    email: string
    created_at: Date
    updated_at: Date
}