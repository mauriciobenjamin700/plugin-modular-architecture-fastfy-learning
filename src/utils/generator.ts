import { randomUUID } from 'crypto'

/**
 * GeneratorHandler class for generating unique identifiers.
 * Methods:
 * - generateId: Generates a unique identifier with an optional prefix.
 */
export default class GeneratorHandler {
    static generateId(prefix: string = ''): string {
        const id = randomUUID()
        return prefix ? `${prefix}_${id}` : id
    }
}
