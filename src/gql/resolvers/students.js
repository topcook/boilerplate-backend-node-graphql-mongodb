/**
 * All resolvers related to students
 * @typedef {Object}
 */
export default {
	Query: {
		/**
		 * It allows to administrators students to list all students registered
		 */
		listAllStudents:  async (parent, args, context) => {
			console.log("listAllStudents context:  ", context);
			context.di.authValidation.listAllStudents(context);

			// context.di.authValidation.ensureThatStudentIsAdministrator(context);

			return context.di.model.Students.find({});
		}
	},
	Mutation: {
	}
};
