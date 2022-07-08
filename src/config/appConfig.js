import dotenv from 'dotenv';
dotenv.config();

import { ENVIRONMENT } from './environment.js';


/* Home doc */
/**
 * @file Environment variables configuration for the application
 * @see module:appConfig
 */

/* Module doc */
/**
 * Environment variables configuration for the application
 * @module appConfig
 */

const serverPortByDefault = 4001;
const limitOfStudentsRegistered = 0; /* Set the value to 0 to not use the limit. Remember put the same value on the enviroment variables */

/**
 * Environment variables configuration
 * @typedef {Object}
 */
export const environmentVariablesConfig = Object.freeze({
	formatConnection: process.env.MONGO_FORMAT_CONNECTION || 'standard',
	mongoDNSseedlist: process.env.MONGO_DNS_SEEDLIST_CONNECTION || '',
	dbHost: process.env.MONGO_HOST || 'localhost',
	dbPort: process.env.MONGO_PORT || '27017',
	database: process.env.MONGO_DB || 'students',
	mongoUser: process.env.MONGO_USER || '',
	mongoPass: process.env.MONGO_PASS || '',
	enviroment: (process.env.ENVIROMENT === ENVIRONMENT.DEVELOPMENT) ? ENVIRONMENT.DEVELOPMENT : ENVIRONMENT.PRODUCTION,
	port: Number(process.env.PORT) || serverPortByDefault
});

/**
 * Security variables configuration
 * @typedef {Object}
 */
export const securityVariablesConfig = Object.freeze({
	secret: process.env.SECRET || 'yoursecret',
	timeExpiration: process.env.DURATION || '1000h'
});

/**
 * Global variables configuration
 * @typedef {Object}
 */
export const globalVariablesConfig = Object.freeze({
	limitOfStudentsRegistered: Number(process.env.LIMIT_STUDENTS_REGISTERED) || limitOfStudentsRegistered
});
