// Another type of validation ENV VARS diferent than joi.validation.ts
export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.MONGODB,
    port: process.env.PORT || 3000,
    default_limit: process.env.DEFAULT_LIMIT || 10
})