import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
	type Student {
		# id: String
		# isAdmin: Boolean
		# isActive: Boolean
		# uuid: String
		# registrationDate: String
		# lastLogin: String
		id: String
		isAdmin: Boolean
		isActive: Boolean
		firstName: String
		lastName: String
		email: String
		password: String
		collegeId: String
	}

	type Query {
		""" Get list of all students registered on database """
		listAllStudents: [Student]
	}
`;