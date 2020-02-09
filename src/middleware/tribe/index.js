import Tribe from '../../api/tribe/model';

module.exports = async (req, res, next) => {
	const tribeFound = await Tribe.findOne({ creator: req.user._id }).catch(
		err => err
	);
	// probe for errors
	if (tribeFound instanceof Error) {
		return res.jsend.error(`An error occurred: ${tribeFound}`);
	}
	// inject the tribe Object
	req.tribe = tribeFound;
	// next
	next();
	// return nothing
	return 'nothing';
};
