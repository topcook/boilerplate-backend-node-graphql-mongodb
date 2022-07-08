import { UserInputError } from 'apollo-server-express';
import bcrypt from 'bcrypt';

import { isValidEmail, isStrongPassword } from '../../helpers/validations.js';

/**
 * All resolvers related to auth
 * @typedef {Object}
 */
export default {
	Query: {
	},
	Mutation: {
		/**
		 * It allows to students to register as long as the limit of allowed students has not been reached
		 */
		registerStudent: async (parent, { email, password, isAdmin }, context) => {
			if (!email || !password) {
				throw new UserInputError('Data provided is not valid');
			}

			if (!isValidEmail(email)) {
				throw new UserInputError('The email is not valid');
			}

			if (!isStrongPassword(password)) {
				throw new UserInputError('The password is not secure enough');
			}

			const registeredStudentsCount = await context.di.model.Students.find().estimatedDocumentCount();

			context.di.authValidation.ensureLimitOfStudentsIsNotReached(registeredStudentsCount);

			const isAnEmailAlreadyRegistered = await context.di.model.Students.findOne({ email });

			if (isAnEmailAlreadyRegistered) {
				throw new UserInputError('Data provided is not valid');
			}

			await new context.di.model.Students({ email, password, isAdmin }).save();

			const student = await context.di.model.Students.findOne({ email });

			return {
				token: context.di.jwt.createAuthToken(student.email, student.isAdmin, student.isActive, student.uuid)
			};
		},
		/**
		 * It allows students to authenticate. Students with property isActive with value false are not allowed to authenticate. When an student authenticates the value of lastLogin will be updated
		 */
		authStudent: async (parent, { email, password }, context) => {
			if (!email || !password) {
				throw new UserInputError('Invalid credentials');
			}

			const student = await context.di.model.Students.findOne({ email, isActive: true });

			if (!student) {
				throw new UserInputError('Student not found or login not allowed');
			}

			const isCorrectPassword = await bcrypt.compare(password, student.password);

			if (!isCorrectPassword) {
				throw new UserInputError('Invalid credentials');
			}

			await context.di.model.Students.findOneAndUpdate({ email }, { lastLogin: new Date().toISOString() }, { new: true });

			return {
				token: context.di.jwt.createAuthToken(student.email, student.isAdmin, student.isActive, student.uuid)
			};
		},
		/**
		 * It allows to student to delete their account permanently (this action does not delete the records associated with the student, it only deletes their student account)
		 */
		deleteMyStudentAccount:  async (parent, args, context) => {
			context.di.authValidation.ensureThatStudentIsLogged(context);

			const student = await context.di.authValidation.getStudent(context);

			return context.di.model.Students.deleteOne({ uuid: student.uuid });
		}
	}
};
