import Tribe from './model';
import TribeMember from '../tribeMember/model';
/*
 * POST /Tribe/create route to create new Tribe
 */
export async function create(req, res) {
	// search Tribes via isbn
	const tribeFound = await Tribe.findOne({ name: req.body.name }).catch(
		err => err
	);
	// if error return
	if (tribeFound instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${tribeFound}`
		);
	}

	if (tribeFound) {
		// return message to user
		return res.jsend.error(
			`A Tribe with this name ${tribeFound.name} already exist`
		);
	}

	const tribeObject = { ...req.body, creator: req.user._id };
	// create the Tribe record
	const tribeCreated = await Tribe.create(tribeObject).catch(err => err);

	// if error return
	if (tribeCreated instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${tribeCreated}`
		);
	}

	// tribe creator payload
	const creatorPayload = {
		email: req.user.email,
		tribe: tribeCreated._id,
		requestStatus: true,
		user: req.user._id,
		priority: 1
	};

	// add the tribe creator to tribe by default
	const tribeCreatorAdded = await TribeMember.create(creatorPayload).catch(
		err => err
	);

	// if error
	if (tribeCreatorAdded instanceof Error) {
		return res.jsend.error(
			`Tribe created successfully but we could not add you to the tribe. Please invite your self to the tribe to become a member of the tribe: ${tribeCreatorAdded}`
		);
	}

	// successful creation
	return res.jsend.success(tribeCreated);
}

/*
 * GET /Tribes route to get all Tribes from db via a user institution
 */
export async function findAll(req, res) {
	// get all Tribes via user institution
	const tribesFound = await Tribe.find({}).catch(err => err);

	// if error return
	if (tribesFound instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${tribesFound}`
		);
	}

	// if Tribes does not exist
	if (!tribesFound) {
		// return message to user
		return res.jsend.error('No Tribes was found');
	}

	// fetch the requested Tribes
	return res.jsend.success(tribesFound);
}

/*
 * GET /Tribes route to get all Tribes from db via a user institution
 */
export async function findByID(req, res) {
	// get all Tribes via user institution
	const tribesFound = await Tribe.find({ _id: req.params.id }).catch(
		err => err
	);

	// if error return
	if (tribesFound instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${tribesFound}`
		);
	}

	// if Tribes does not exist
	if (!tribesFound) {
		// return message to user
		return res.jsend.error('No Tribes was found');
	}

	// fetch the requested Tribes
	return res.jsend.success(tribesFound);
}

export async function modify(req, res) {
	const tribeModified = await Tribe.findByIdAndUpdate(
		{ _id: req.params.id },
		req.body
	).catch(err => err);

	// if error return
	if (tribeModified instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${tribeModified}`
		);
	}

	// fetch the requested Tribes
	return res.jsend.success(tribeModified);
}

/*
 * POST /Tribe/delete route to create new Tribe
 */
export async function destroy(req, res) {
	const tribeDeleted = await Tribe.findByIdAndRemove({
		_id: req.params.id
	}).catch(err => err);

	// if error return
	if (tribeDeleted instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${tribeDeleted}`
		);
	}

	// fetch the requested Tribes
	return res.jsend.success(tribeDeleted);
}
