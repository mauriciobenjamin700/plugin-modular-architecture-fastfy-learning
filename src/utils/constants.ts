import 'dotenv/config'

const POSTGRES_USER = process.env.POSTGRES_USER || 'store_user'
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'store_password'
const POSTGRES_DB = process.env.POSTGRES_DB || 'store_db'
const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost'
const POSTGRES_PORT = process.env.POSTGRES_PORT
    ? parseInt(process.env.POSTGRES_PORT, 10)
    : 5432
const API_PORT = process.env.API_PORT
    ? parseInt(process.env.API_PORT, 10)
    : 3000
const constants = {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_HOST,
    POSTGRES_PORT,

    API_PORT,
}

export default constants
