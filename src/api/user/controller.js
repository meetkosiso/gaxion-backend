import passport from 'passport';
import { isEmail } from 'validator';
import jwt from 'jsonwebtoken';
import ejs from 'ejs';
import path from 'path';
import User from './model';
import { pushNoitification } from '../../services/fireBase';
import { properCase } from '../../services/properCase';
import { createConnectedAccount } from '../../services/stripe';
import { sendEmailOptions } from '../../services/sendEmailOptions';

const template = path.join(
	__dirname,
	'../../services/templates/resetPassword/html.ejs'
);

/*
 * POST /user/create route to create new user
 */
export async function create(req, res) {
	// Is email valid
	if (!isEmail(req.body.email)) {
		return res.jsend.error('Invalid email address');
	}

	// search for user
	const userFound = await User.findOne({
		email: req.body.email.toLowerCase()
	}).catch(err => err);

	// if error return
	if (userFound instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${userFound}`
		);
	}

	// Is user created already
	if (userFound) {
		// return on user exist
		return res.jsend.error(
			`user with the email address ${req.body.email} already exist`
		);
	}

	const newUser = new User();
	// user attributes
	newUser.email = req.body.email.toLowerCase();
	newUser.name = properCase(req.body.name);
	newUser.role = req.body.role;
	newUser.password = newUser.generateHash(req.body.password);

	// create User
	const userCreated = await newUser.save().catch(err => err);

	// if error return
	if (userCreated instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${userCreated}`
		);
	}

	// On successful user creation
	return res.jsend.success(userCreated);
}

/*
 * POST /user/create route to create new user
 */
export async function onCreateConnectedAccount(req, res) {
	// delimiter
	const delimiter = { _id: req.user._id };
	// get the customer connected stripe ID
	const stripeConnectedCustomerID = await createConnectedAccount(
		req.body.authorizationCode,
		process.env.STRIPE_SECRET
	);
	// update
	const userUpdated = await User.findByIdAndUpdate(delimiter, {
		stipeConnectedCustomerID: stripeConnectedCustomerID.stripe_user_id,
		stripePublishableKey: stripeConnectedCustomerID.stripe_publishable_key
	}).catch(err => err);

	// on error
	if (userUpdated instanceof Error) {
		return res.jsend.error(
			`An error occurred while processing your request ${userUpdated}`
		);
	}
	// success
	return res.jsend.success(userUpdated);
}

// POST REQUEST: send token link
export async function getResetPasswordToken(req, res) {
	// find user
	const passwordResetted = await User.findOne({
		email: req.body.email.toLowerCase()
	}).catch(err => err);

	// if no error
	if (passwordResetted instanceof Error) {
		// return the instance of the error
		return res.jsend.error(
			`An error occurred while processing your request: ${passwordResetted}`
		);
	}

	// if not data exist
	if (!passwordResetted) {
		// return an error
		return res.jsend.error('Your email does not exist');
	}

	// get the email templates
	const data = await ejs.renderFile(template, {
		name: passwordResetted.name,
		token: passwordResetted.getForgotPasswordToken()
	});

	// message Body
	const messageBody = {
		from: 'Gaxion',
		to: passwordResetted.email,
		subject: 'Reset Password',
		html: data
	};

	// send email options
	sendEmailOptions(messageBody);

	// return the the generated passowrd reset token
	return res.jsend.success(passwordResetted.getForgotPasswordToken());
}

// POST REQUEST: reset setPassword
export async function resetPassword(req, res) {
	// JWT verify
	jwt.verify(req.body.token, process.env.JWT_SECRET, async (error, decoded) => {
		if (error) {
			return res.jsend.fail('Invalid token');
		}

		// find user
		const passwordResetted = await User.findOne({
			_id: decoded._id
		}).catch(err => err);

		// if no error
		if (passwordResetted instanceof Error) {
			// return the instance of the error
			return res.jsend.error(
				`An error occurred while processing your request: ${passwordResetted}`
			);
		}

		// if not data exist
		if (!passwordResetted) {
			// return an error
			return res.jsend.error('Your email does not exist');
		}
		// set the password
		passwordResetted.password = passwordResetted.generateHash(
			req.body.password
		);
		// persist
		const passwordPersisted = await passwordResetted.save().catch(err => err);
		// an error occurred
		if (passwordPersisted instanceof Error) {
			// return an error instance
			return res.jsend.error(
				`An error occurred while processing your request: ${passwordPersisted}`
			);
		}

		// return persisted objects
		return res.jsend.success(passwordPersisted);
	});
}

export async function findAll(req, res) {
	const userFound = await User.find({}).catch(err => err);
	// probe for errors
	if (userFound instanceof Error) {
		return res.jsend.error(
			`An error occurred while processing your request: ${userFound}`
		);
	}
	// show the response
	return res.jsend.success(userFound);
}

export async function registerPushNotificatioKey(req, res) {
	// body of the request
	const pushNotificationBody = {
		pushNotificationKey: req.body.pushNotificationKey
	};
	const pushNotificationCreated = await User.findByIdAndUpdate(
		{ _id: req.body.userID },
		pushNotificationBody
	).catch(err => err);

	if (pushNotificationCreated instanceof Error) {
		return res.jsend.error(
			`An error occurred while processing your request ${pushNotificationCreated}`
		);
	}

	// on success
	return res.jsend.success(pushNotificationCreated);
}

export async function notify(req, res) {
	const payload = {
		notification: {
			title: req.body.title,
			body: req.body.body
		}
	};
	const options = {
		priority: 'high',
		timeToLive: 60 * 60 * 24,
		sound: 'enabled'
	};

	// push notification instance
	const pushNotificationInstance = await pushNoitification(
		payload,
		options,
		req.body.notificationKey
	);
	// on error;
	if (pushNotificationInstance instanceof Error) {
		res.jsend.error(
			`An error occurred while processing your request ${pushNotificationInstance}`
		);
	}

	// successful instance
	res.jsend.success(pushNotificationInstance);
}

// POST REQUEST: allow a user to login
export function login(req, res, next) {
	// authenticate user
	passport.authenticate('local', (error, user) => {
		if (error) {
			return res.jsend.error(error);
		}
		// On Successful login
		return res.jsend.success(user.authJSON());
	})(req, res, next);
}

/* GET Google Authentication API. */
export function loginWithGoogle(req, res, next) {
	passport.authenticate(
		'google',
		{ scope: ['profile', 'email'] },
		(error, user) => {
			if (error) {
				return res.jsend.error(error);
			}
			// On Successful login
			return res.jsend.success(user.authJSON());
		}
	)(req, res, next);
}

/*
 * POST /Tribe/delete route to create new Tribe
 */
export async function destroy(req, res) {
	const userDeleted = await User.findByIdAndRemove({
		_id: req.params.id
	}).catch(err => err);

	// if error return
	if (userDeleted instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${userDeleted}`
		);
	}

	// fetch the requested Tribes
	return res.jsend.success(userDeleted);
}
