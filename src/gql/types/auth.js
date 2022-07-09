import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
	type Token {
		token: String
	}

	type Mutation {
		""" It allows students to register """
		registerStudent(id: String!, firstName: String!, lastName: String!, email: String!, password: String!, collegeId: String!): Token

		""" It allows students to authenticate """
		authStudent(email: String!, password: String!): Token

		""" It allows to student to delete their account permanently """
		deleteMyStudentAccount: DeleteResult
	}
`;