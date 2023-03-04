import express, { Express, Response, Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import dotenv from 'dotenv'
import apiRouter from './routes/sites.route'
import { requestResponseLogger } from './middlewares/logger.middleware'
import { logger } from './utils/logger.utils'
import connectDB from './db/config'
import swaggerUi from 'swagger-ui-express'
import * as swaggerDoc from './utils/swagger.json'
dotenv.config()

const app: Express = express()
const PORT = Number(process.env.PORT || 3000)

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(requestResponseLogger)
app.use('/api/v1/sites', apiRouter)
app.use((req: Request, res: Response) => {
	res.status(StatusCodes.NOT_FOUND).json({ status: StatusCodes.NOT_FOUND, message: 'page not found.' })
})

app.listen(PORT, async () => {
	logger.info(`server running on http://localhost:${PORT}`)
	await connectDB()
})
