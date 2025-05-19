// src/constants/config/config.ts
import config from './config.json';

const API_DOMAIN = config.API_DOMAIN;

// Protocol depends on if we're using dev or production
const API_PROTOCOL = API_DOMAIN === 'localhost' ? 'http' : 'https';

// This can be reused for all backend interactions
export const BASE_URL: string = `${API_PROTOCOL}://${API_DOMAIN}`;
export const TESTING_MODE: boolean = config.TESTING_MODE === 'true';