import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
	type Student {
		id: String
		firstName: String
		lastName: String
		email: String
		password: String
		collegeId: String
		uuid: String
		registrationDate: String
		lastLogin: String
	}

	type Query {
		""" Get list of all students registered on database """
		listAllStudents: [Student]
	}
`;