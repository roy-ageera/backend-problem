import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
const prisma = new PrismaClient()

export const getSites = async (req: Request, res: Response) => {
	const sites = await prisma.site.findMany()
	if (sites.length != 0) return res.status(StatusCodes.OK).json({ StatusCodes: StatusCodes.OK, message: 'sites', data: sites })
	return res.status(StatusCodes.NOT_FOUND).json({ StatusCodes: StatusCodes.NOT_FOUND, message: 'no sites found.' })
}
export const getSiteById = async (req: Request, res: Response) => {
	const { id } = req.params
	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ StatusCodes: StatusCodes.BAD_REQUEST, message: 'id not provided.' })
	const site = await prisma.site.findUnique({
		where: {
			id: parseInt(id),
		},
	})
	if (!site) return res.status(StatusCodes.NOT_FOUND).json({ StatusCodes: StatusCodes.NOT_FOUND, message: 'no site found with that id.' })
	return res.status(StatusCodes.OK).json({ StatusCodes: StatusCodes.OK, message: `data for ${id}`, data: site })
}
export const createNewSite = async (req: Request, res: Response) => {
	try {
		const { name, location } = req.body
		if (!name) return res.status(StatusCodes.BAD_REQUEST).json({ StatusCodes: StatusCodes.BAD_REQUEST, message: 'please provide name.' })
		if (!location) return res.status(StatusCodes.BAD_REQUEST).json({ StatusCodes: StatusCodes.BAD_REQUEST, message: 'please provide location.' })
		const data = await prisma.site.create({
			data: {
				name: name,
				location: location,
			},
		})
		return res.status(StatusCodes.CREATED).json({ StatusCodes: StatusCodes.CREATED, message: 'record has been created.', data: data })
	} catch (e) {
		return res.status(StatusCodes.NOT_ACCEPTABLE).json({ StatusCodes: StatusCodes.NOT_ACCEPTABLE, message: 'unique constrain.', errors: e })
	} finally {
		await prisma.$disconnect()
	}
}
