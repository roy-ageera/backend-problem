const Joi = require('joi');

const siteSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  id: Joi.number().required(),
});

const batterySchema = Joi.object({
  vendor: Joi.string().valid('Tesla', 'KATL').required(),
  capacity_kwh: Joi.number().min(0).required(),
  max_power_kw: Joi.number().min(0).required(),
}).required();

const pvSchema = Joi.object({
  units: Joi.number().min(0).required(),
  kilowatt_peak: Joi.number().min(0).required(),
}).required();

const bioSchema = Joi.object({
  units: Joi.number().min(0).required(),
}).required();

const croSchema = Joi.object({
  units: Joi.number().min(0).required(),
  kilowatt_peak: Joi.number().min(0).required(),
}).required();

const productionSchema = Joi.object({
  pv: pvSchema,
  bio: bioSchema,
  cro: croSchema,
}).required();

const configSchema = Joi.object({
  id: Joi.number().required(),
  battery: batterySchema,
  production: productionSchema,
});

const liveDataSchema = Joi.object({
  timestamp: Joi.date().required(),
  soc: Joi.number().min(0).max(100).required(),
  load_kwh: Joi.number().min(0).required(),
  net_load_kwh: Joi.number().min(0).required(),
  pv_notification: Joi.boolean().required(),
  bio_notification: Joi.boolean().required(),
  cro_notification: Joi.boolean().required(),
});

const validateSchema = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateSite = validateSchema(siteSchema);
const validateConfig = validateSchema(configSchema);
const validateLiveData = validateSchema(liveDataSchema);

module.exports = {
  validateSite,
  validateConfig,
  validateLiveData,
};
