import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import Ajv from 'ajv'
const prisma = new PrismaClient()
const ajv = new Ajv()
ajv.addFormat('timestamp', /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}(\.\d{1,3})?$/)
type liveData = {
	timeStamp: string
	soc: number
	load_kwh: number
	net_load_kwh: number
	pv_notification: boolean
	bio_notification: boolean
	cro_notification: boolean
	createdAt: string | Date
}
export const getLiveUpdatedBySiteId = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ StatusCodes: StatusCodes.BAD_REQUEST, message: 'id not provided.' })
		const existSite = await prisma.site.findUnique({ where: { id: parseInt(id) } })
		if (!existSite) {
			return res.status(StatusCodes.NOT_FOUND).json({ StatusCodes: StatusCodes.NOT_FOUND, message: 'record nor found.' })
		}
		const data = await prisma.historicalData.findMany({ where: { siteId: parseInt(id) } })
		if (data.length != 0) {
			const formatedHistory = {
				timestamps: data.map((item) => item.timeStamp),
				soc: data.map((item) => item.soc),
				load_kwh: data.map((item) => item.load_kwh),
				net_load_kwh: data.map((item) => item.net_load_kwh),
				pv_notification: data.map((item) => item.pv_notification),
				bio_notification: data.map((item) => item.bio_notification),
				cro_notification: data.map((item) => item.cro_notification),
			}
			return res.status(StatusCodes.OK).json({ StatusCodes: StatusCodes.OK, message: `requested logs for site ${id}`, data: formatedHistory })
		}
	} catch (e) {
		return res.status(StatusCodes.BAD_REQUEST).json({ StatusCodes: StatusCodes.BAD_REQUEST, message: 'error', errors: e })
	} finally {
		await prisma.$disconnect()
	}
}
export const pushLiveUpdatedBySiteId = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ StatusCodes: StatusCodes.BAD_REQUEST, message: 'id not provided.' })
		const data: liveData = req.body
		const valid = validate(data)
		if (!valid) {
			return res.status(StatusCodes.BAD_REQUEST).json({ StatusCodes: StatusCodes.BAD_REQUEST, message: 'data invalid.', errors: validate.errors })
		}
		const request = await prisma.historicalData.create({
			data: {
				...data,
				createdAt: new Date(),
				site: {
					connect: {
						id: parseInt(id),
					},
				},
			},
		})
		return res.status(StatusCodes.OK).json({ StatusCodes: StatusCodes.CREATED, message: `updated config with new values for site ${id}`, data: request })
	} catch (e) {
		return res.status(StatusCodes.BAD_REQUEST).json({ StatusCodes: StatusCodes.BAD_REQUEST, message: 'unique constrains.', errors: e })
	} finally {
		await prisma.$disconnect()
	}
}
export const getLatestLiveUpdateBySiteId = async (req: Request, res: Response) => {
	const { id } = req.params
	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ StatusCodes: StatusCodes.BAD_REQUEST, message: 'id not provided.' })
	const existSite = await prisma.site.findUnique({ where: { id: parseInt(id) } })
	if (!existSite) {
		return res.status(StatusCodes.NOT_FOUND).json({ StatusCodes: StatusCodes.NOT_FOUND, message: 'record nor found.' })
	}
	const latestData = await prisma.historicalData.findFirst({ where: { siteId: parseInt(id) }, orderBy: { createdAt: 'desc' } })
	return res.status(StatusCodes.OK).json({ StatusCodes: StatusCodes.OK, message: `requested logs for site ${id}`, data: latestData })
}
const liveDataPulse = {
	type: 'object',
	properties: {
		timeStamp: { type: 'string', format: 'timestamp' },
		soc: { type: 'number', minimum: 0, maximum: 100 },
		load_kwh: { type: 'number', minimum: 0 },
		net_load_kwh: { type: 'number', minimum: 0 },
		pv_notification: { type: 'boolean' },
		bio_notification: { type: 'boolean' },
		cro_notification: { type: 'boolean' },
	},
}
const validate = ajv.compile(liveDataPulse)
