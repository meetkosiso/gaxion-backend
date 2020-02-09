import jwt from 'jsonwebtoken';
import User from '../../api/user/model';

module.exports = (req, res, next) => {
	// get request header
	const header = req.headers.authorization;
	let token;
	// header
	if (header) token = header.split(' ')[1];
	// if token exist
	if (token) {
		// verify token
		jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
			// on error
			if (err) {
				// message
				return res.jsend.error('invalid token');
			}
			// find user
			const user = await User.findOne({ email: decoded.email });
			// merge user instance to req
			req.user = user;
			//
			return next();
		});
	} else {
		// error message
		res.jsend.error('no token found');
	}
};
