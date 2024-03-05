import * as Joi from 'joi';
// Validation Schema ENV VARS
// Another type of validation ENV VARS diferent than app.config.ts
// JoiValidationSchema has priority front app.config.ts
export const JoiValidationSchema = Joi.object({
    MONGO_DB: Joi.required(),
    PORT: Joi.number().default(3000),
    DEFAULT_LIMIT: Joi.number().default(10)
})