import merge from 'lodash.merge';

import students from './students.js';
import auth from './auth.js';

export const resolvers = merge(
	students,
	auth
);
