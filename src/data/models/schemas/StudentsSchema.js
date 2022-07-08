import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const Schema = mongoose.Schema;

/**
 * Students schema
 * @constructor Students model constructor
 * @classdesc Student have interesting properties. Some of them are isAdmin (false by default), isActive (true by default. Useful for removing login permission to the registered students), uuid (random and unique token. Created to provided a random identifier token for every student different than _id native MongoDB value)
 */
const StudentsSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true
	},
	isAdmin: {
		type: Boolean,
		required: true,
		default: false
	},
	isActive: {
		type: Boolean,
		required: true,
		default: true
	},
	uuid: {
		type: String,
		required: true,
		unique: true,
		default: randomUUID
	},
	registrationDate: {
		type: Date,
		required: true,
		default: Date.now
	},
	lastLogin: {
		type: Date,
		required: true,
		default: Date.now
	}
});

/**
 * Hash the password of student before save on database
 */
 StudentsSchema.pre('save', function (next) {
	if (!this.isModified('password')) {
		return next();
	}
	bcrypt.genSalt((err, salt) => {
		if (err) {
			return next(err);
		}
		bcrypt.hash(this.password, salt, (err, hash) => {
			if (err) {
				return next(err);
			}
			this.password = hash;
			next();
		});
	});
});

export { StudentsSchema };
