import pg from 'pg'
import { logger } from '../utils/logger.utils'
const connectDB = async () => {
	try {
		const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
		await client.connect()
		const res = await client.query('SELECT $1::text as connected', ['Connection to postgres successful!'])
		logger.info(res.rows[0].connected)
		await client.end()
	} catch (e) {
		logger.error(e)
	}
}
export default connectDB

// PG_URL = postgres://admin:admin@postgres:5432/postgres_db
