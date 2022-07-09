import { AuthenticationError, ForbiddenError, ValidationError } from 'apollo-server-express';
import models from '../../data/models/index.js';
import { globalVariablesConfig } from '../../config/appConfig.js';

/**
 * Auth validations repository
 * @typedef {Object}
 */
export const authValidations = {
	/**
	 * Check if the maximum limit of students has been reached. If limit is reached, it throws an error.
	 * @param {number} numberOfCurrentlyStudentsRegistered 	- The number of students currently registered in the service
	 */
	ensureLimitOfStudentsIsNotReached: (numberOfCurrentlyStudentsRegistered) => {
		const studentsLimit = globalVariablesConfig.limitOfStudentsRegistered;
		if (studentsLimit === 0) {
			return;
		}

		if (numberOfCurrentlyStudentsRegistered >= studentsLimit) {
			throw new ValidationError('The maximum number of students allowed has been reached. You must contact the administrator of the service in order to register');
		}
	},

	/**
	 * Check if in Apollo Server context contains a logged student. If student is not in context, it throws an error
	 * @param {Object} context 			- The context object of Apollo Server
	 * @param {Object} [context.student]  	- The context object data: student data
	 */
	ensureThatStudentIsLogged: (context) => {
		console.log("ok1");
		console.log("!context.student: ", !context.student);
		if (!context.student) {
			throw new AuthenticationError('You must be logged in to perform this action');
		}
	},

	/**
	 * Check if in Apollo Server context contains an student and is an administrator. If student is not in context or student is not an administrator it throws an error
	 * @param {Object} context 					- The context object of Apollo Server
	 * @param {Object} [context.student]  			- The context object data: student data
	 * @param {boolean} [context.student.isAdmin] 	- The context object data: student data role information
	 */
	ensureThatStudentIsAdministrator: (context) => {
		if (!context.student || !context.student.isAdmin) {
			throw new ForbiddenError('You must be an administrator to perform this action');
		}
	},

	/**
	 * Uses the information in the Apollo Server context to retrieve the student's data from the database. If student does not exist, it throws an error.
	 * @async
	 * @param {Object} context 				- The context object of Apollo Server
	 * @param {Object} [context.student]  		- The context object data: student data
	 * @returns {Student}
	 */
	getStudent: async (context) => {
		console.log("getStudent context: ", context);
		if (!context.student) {
			return null;
		}
	
		const studentUUID = context.student.uuid || null;
		const student = await models.Students.findOne({ uuid: studentUUID });
		if (!student) {
			console.log("ok2");

			throw new AuthenticationError('You must be logged in to perform this action');
		}

		return student;
	},
};