import express from 'express'
import { createNewSite, getSiteById, getSites } from '../controllers/sites.controller'
import { getConfigBySiteId, createConfigBySiteId, updateConfigBySiteId } from '../controllers/configuration.controller'
import { pushLiveUpdatedBySiteId, getLiveUpdatedBySiteId, getLatestLiveUpdateBySiteId } from '../controllers/live.controller'
const router = express.Router()

router.route('/').get(getSites)

router.route('/:id').get(getSiteById)

router.route('/').post(createNewSite)

router.route('/:id/configuration').get(getConfigBySiteId)

router.route('/:id/configuration').post(createConfigBySiteId)

router.route('/:id/configuration').put(updateConfigBySiteId)

router.route('/:id/live').post(pushLiveUpdatedBySiteId)

router.route('/:id/live').get(getLiveUpdatedBySiteId)

router.route('/:id/live/latest').get(getLatestLiveUpdateBySiteId)

export default router
