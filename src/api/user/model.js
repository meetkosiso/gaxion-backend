import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// user schema definition
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'the name field is required']
		},
		email: {
			type: String,
			trim: true,
			required: [true, 'the email field is required ']
		},
		role: {
			type: String,
			enum: ['user', 'administrator'],
			default: 'user'
		},
		pushNotificationKey: String,
		stripeCustomerID: String,
		stipeConnectedCustomerID: String,
		stripePublishableKey: String,
		password: {
			type: String,
			required: [true, 'the password field is required']
		}
	},
	{
		timestamps: {
			createdAt: 'createdAt',
			updatedAt: 'updatedAt'
		}
	}
);

// encrypt, salt and generate user password
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// verify valid password
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

// authentication payload
userSchema.methods.authJSON = function authJSON() {
	return {
		token: this.getJWT(),
		id: this._id,
		stripeCardConnected:
			this.stripeCustomerID !== undefined && this.stripeCustomerID !== null,
		stripeAccountConnected:
			this.stipeConnectedCustomerID !== undefined &&
			this.stipeConnectedCustomerID !== null
	};
};

// JWT
userSchema.methods.getJWT = function getJWT() {
	return jwt.sign(
		{
			email: this.email,
			role: this.role,
			id: this._id,
			stripeCardConnected:
				this.stripeCustomerID !== undefined && this.stripeCustomerID !== null,
			stripeAccountConnected:
				this.stipeConnectedCustomerID !== undefined &&
				this.stipeConnectedCustomerID !== null
		},
		process.env.JWT_SECRET
	);
};

// JWT FORGOT PASSWORD TOKEN
userSchema.methods.getForgotPasswordToken = function getForgotPasswordToken() {
	return jwt.sign(
		{
			_id: this._id
		},
		process.env.JWT_SECRET,
		{ expiresIn: '1h' }
	);
};

module.exports = mongoose.model('User', userSchema);
