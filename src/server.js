import mongoose from 'mongoose';
import express from 'express';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { UserInputError } from 'apollo-server-errors';

import { ENVIRONMENT } from './config/environment.js';
import { environmentVariablesConfig } from './config/appConfig.js';
import { logger, endLogger } from './helpers/logger.js';
import { requestDevLogger } from './helpers/requestDevLogger.js';
import { setContext } from './gql/auth/setContext.js';
import { initTypeDefinition } from './gql/types/index.js';
import { resolvers } from './gql/resolvers/index.js';
import { getListOfIPV4Address } from './helpers/getListOfIPV4Address.js';
import routesManager from './routes/routesManager.js';


// if (environmentVariablesConfig.formatConnection === 'DNSseedlist' && environmentVariablesConfig.mongoDNSseedlist !== '') {
// 	console.log("1");
// 	mongoose.connect(environmentVariablesConfig.mongoDNSseedlist);
// } else {
// 	console.log("2");
// 	if (environmentVariablesConfig.mongoUser !== '' && environmentVariablesConfig.mongoPass !== '') {
// 		console.log("21");
// 		mongoose.connect(`mongodb://${environmentVariablesConfig.mongoUser}:${environmentVariablesConfig.mongoPass}@${environmentVariablesConfig.dbHost}:${environmentVariablesConfig.dbPort}/${environmentVariablesConfig.database}`);
// 	} else {
// 		console.log("22");
		mongoose.connect(`mongodb://${environmentVariablesConfig.dbHost}:${environmentVariablesConfig.dbPort}/${environmentVariablesConfig.database}`);
		console.log("3");
// 	}
// }

console.log("4");
const db = mongoose.connection;
db.on('error', (err) => {
	logger.error(`Connection error with database. ${err}`);
});
console.log("5");
db.once('open', () => {
	console.log("6");
	if (environmentVariablesConfig.enviroment !== ENVIRONMENT.DEVELOPMENT) {
		console.log("7");
		logger.info(`Connected with MongoDB service (${ENVIRONMENT.PRODUCTION} mode)`);
	} else {
		console.log("8");
		if (environmentVariablesConfig.formatConnection === 'DNSseedlist' && environmentVariablesConfig.mongoDNSseedlist !== '') {
			console.log("81");
			logger.info(`Connected with MongoDB service at "${environmentVariablesConfig.mongoDNSseedlist}" using database "${environmentVariablesConfig.database}" (${ENVIRONMENT.DEVELOPMENT} mode)`);
		} else {
			console.log("82");
			logger.info(`Connected with MongoDB service at "${environmentVariablesConfig.dbHost}" in port "${environmentVariablesConfig.dbPort}" using database "${environmentVariablesConfig.database}" (${ENVIRONMENT.DEVELOPMENT} mode)`);
		}
	}

	initApplication();
});

const initApplication = async () => {
	const app = express();
	if (environmentVariablesConfig.enviroment === ENVIRONMENT.PRODUCTION) {
		app.use(helmet());
	} else {
		// Allow GraphQL Playground on development environments
		app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
	}
	app.use(cors({ credentials: true }));
	const __dirname = path.dirname(fileURLToPath(import.meta.url));
	app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	app.use('', routesManager);

	const typeDefs = await initTypeDefinition();

	const server = new ApolloServer({ 
		typeDefs,
		resolvers,
		context: setContext,
		introspection: (environmentVariablesConfig.enviroment === ENVIRONMENT.PRODUCTION) ? false : true, // Set to "true" only in development mode
		plugins: (environmentVariablesConfig.enviroment === ENVIRONMENT.PRODUCTION) ? [ApolloServerPluginLandingPageDisabled()] : [requestDevLogger, ApolloServerPluginLandingPageGraphQLPlayground()], // Log all querys and their responses. Show playground (do not use in production)
		formatError (error) {
			if ( !(error.originalError instanceof UserInputError) ) {
				logger.error(error.message);
			}

			return error;
		},
	});

	await server.start();

	server.applyMiddleware({ app });

	app.use((req, res) => {
		res.status(404).send('404'); // eslint-disable-line no-magic-numbers
	});

	app.listen(environmentVariablesConfig.port, () => {
		console.log("request success!!!!");
		getListOfIPV4Address().forEach(ip => {
			logger.info(`Application running on: http://${ip}:${environmentVariablesConfig.port}`);
			if (environmentVariablesConfig.enviroment !== ENVIRONMENT.PRODUCTION) {
				logger.info(`GraphQL Playground running on: http://${ip}:${environmentVariablesConfig.port}${server.graphqlPath}`);
			}
		});
	});

	// Manage application shutdown
	process.on('SIGINT', () => {
		logger.info('Stopping application...');
		endLogger();
		process.exit();
	});
};
