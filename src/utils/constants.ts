export const BASE_URL = `${process.env.APP_PROTOCOL}://${process.env.APP_DOMAIN}:${process.env.APP_PORT}`
export const ACCESS_TOKEN_EXPIRY = 10 * 60 // 10 min in seconds
export const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds
