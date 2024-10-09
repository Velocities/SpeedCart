// src/constants/config/config.ts
import config from './config.json';

const API_DOMAIN = config.API_DOMAIN;
const API_PORT = config.API_PORT;

// This can be reused for all backend interactions
export const BASE_URL: string = `https://${API_DOMAIN}:${API_PORT}`;
