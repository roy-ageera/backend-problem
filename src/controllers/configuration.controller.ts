import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import Ajv from 'ajv'
const prisma = new PrismaClient()
const ajv = new Ajv()

export const getConfigBySiteId = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ StatusCodes: StatusCodes.BAD_REQUEST, message: 'id not provided.' })
		const data = await prisma.configuration.findUnique({ where: { id: parseInt(id) } })
		return res.status(StatusCodes.OK).json({ StatusCodes: StatusCodes.OK, message: `requested config for site ${id}`, data: data })
	} catch (e) {
		return res.status(StatusCodes.BAD_REQUEST).json({ StatusCodes: StatusCodes.BAD_REQUEST, message: 'id not provided.' })
	} finally {
		await prisma.$disconnect()
	}
}
export const createConfigBySiteId = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const config: configurationData = req.body
		const valid = validate(config)
		if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ StatusCodes: StatusCodes.BAD_REQUEST, message: 'id not provided.' })
		if (!valid) {
			return res.status(StatusCodes.BAD_REQUEST).json({ StatusCodes: StatusCodes.BAD_REQUEST, message: 'data invalid.', errors: validate.errors })
		}
		const data = await prisma.site.update({
			where: {
				id: parseInt(id),
			},
			data: {
				configuration: {
					create: {
						battery: config.battery,
						production: config.production,
					},
				},
			},
			select: {
				id: true,
				configuration: true,
			},
		})
		return res.status(StatusCodes.OK).json({ StatusCodes: StatusCodes.CREATED, message: `created new config for site ${id}`, data: data })
	} catch (e) {
		return res.status(StatusCodes.BAD_REQUEST).json({ StatusCodes: StatusCodes.BAD_REQUEST, message: 'unique constrains.', errors: e })
	} finally {
		await prisma.$disconnect()
	}
}
export const updateConfigBySiteId = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const config: configurationData = req.body
		const valid = validate(config)
		if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ StatusCodes: StatusCodes.BAD_REQUEST, message: 'id not provided.' })
		if (!valid) {
			return res.status(StatusCodes.BAD_REQUEST).json({ StatusCodes: StatusCodes.BAD_REQUEST, message: 'data invalid.', errors: validate.errors })
		}
		const data = await prisma.site.update({
			where: {
				id: parseInt(id),
			},
			data: {
				configuration: {
					update: {
						battery: config.battery,
						production: config.production,
					},
				},
			},
			select: {
				id: true,
				configuration: true,
			},
		})
		return res.status(StatusCodes.OK).json({ StatusCodes: StatusCodes.CREATED, message: `updated config with new values for site ${id}`, data: data })
	} catch (e) {
		return res.status(StatusCodes.BAD_REQUEST).json({ StatusCodes: StatusCodes.BAD_REQUEST, message: 'unique constrains.', errors: e })
	} finally {
		await prisma.$disconnect()
	}
}

const configuration_schema = {
	type: 'object',
	properties: {
		battery: {
			type: 'object',
			properties: {
				vendor: { type: 'string', enum: ['Tesla', 'KATL'] },
				capacity_kwh: { type: 'number', minimum: 0 },
				max_power_kw: { type: 'number', minimum: 0 },
			},
		},
		production: {
			type: 'object',
			properties: {
				pv: {
					type: 'object',
					properties: {
						kwp: { type: 'number', minimum: 0 },
						units: { type: 'number', minimum: 0 },
					},
				},
				bio: {
					type: 'object',
					properties: {
						units: { type: 'number', minimum: 0 },
					},
				},
				cro: {
					type: 'object',
					properties: {
						kwp: { type: 'number', minimum: 0 },
						units: { type: 'number', minimum: 0 },
					},
				},
			},
		},
	},
}
type configurationData = {
	battery: {
		vendor: string
		capacity_kwh: number
		max_power_kw: number
	}
	production: {
		pv: {
			units: number
			kwp: number
		}
		bio: {
			units: number
		}
		cro: {
			units: number
			kwp: number
		}
	}
}
const validate = ajv.compile(configuration_schema)
