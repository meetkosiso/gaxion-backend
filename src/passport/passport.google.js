import GoogleStrategy from 'passport-google-oauth';

module.exports = new GoogleStrategy.OAuth2Strategy(
	{
		clientID:
			'409513653583-mrtnttunmkbis3gioe07dbfat8vca9fn.apps.googleusercontent.com',
		clientSecret: '5ne5s4JJKaOii5hG9qxpa-21',
		callbackURL: 'http://localhost:3009/auth/google/callback'
	},
	(token, refreshToken, profile, done) => {
		return done(null, {
			profile,
			token
		});
	}
);
