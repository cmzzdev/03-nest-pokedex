// Another type of validation ENV VARS diferent than joi.validation.ts
export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    mongo_db: process.env.MONGO_DB,
    port: process.env.PORT || 3001,
    default_limit: process.env.DEFAULT_LIMIT || 10
})