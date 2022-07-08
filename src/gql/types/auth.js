import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
	type Token {
		token: String
	}

	type Mutation {
		""" It allows students to register """
		registerStudent(email: String!, password: String!, isAdmin: Boolean): Token

		""" It allows students to authenticate """
		authStudent(email: String!, password: String!): Token

		""" It allows to student to delete their account permanently """
		deleteMyStudentAccount: DeleteResult
	}
`;