import LocalStrategy from 'passport-local';
import User from '../api/user/model';

module.exports = new LocalStrategy.Strategy(
	{ usernameField: 'email' },
	async (email, password, done) => {
		// get the user
		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user) {
			return done('No user was found');
		}
		const authenticated = await user.validPassword(password);
		if (!authenticated) {
			return done('Password is invalid');
		}
		return done(null, user);
	}
);
