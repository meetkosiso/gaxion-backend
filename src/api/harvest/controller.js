import Harvest from './model';
import { payoutCustomer } from '../../services/stripe';
import TribeMember from '../tribeMember/model';
import Tribe from '../tribe/model';
import { nextHarvestTurn } from '../../services/harvestTurn';
import { updateObject } from '../../services/updateObject';
import { details } from '../../services/getObject';

/*
 * POST /harvest/create route to create new harvest
 */
export async function create(req, res) {
	// get the tribe turn for harvest
	const harvestTurnFound = await nextHarvestTurn(
		Tribe,
		TribeMember,
		req.body.tribe
	);

	// is it the callers turn for harvest
	if (harvestTurnFound.user._id.toString() !== req.user._id.toString()) {
		return res.jsend.error('Not your turn for harvest');
	}

	// does the tribe has such amount on thier account
	// get the tribe
	const tribes = await details(Tribe, { _id: req.body.tribe });
	// get the tribe member
	const tribeMember = await TribeMember.find({
		tribe: req.body.tribe,
		requestStatus: true
	});
	// if balance is undefined return not sufficient balance
	if (tribes.balance === undefined) {
		return res.jsend.error(
			`${tribes.name} does not have sufficient balance for this harvest`
		);
	}

	// // update the tribe balance
	// await updateObject(
	// 	Tribe,
	// 	{ _id: req.body.tribe },
	// 	{ balance: tribes.balance - 4500 }
	// );

	// get the sum total the caller is attemting to withdraw
	const harvestAmount = tribes.amount * tribeMember.length;
	// not undefined but not enough balance
	if (harvestAmount > tribes.balance) {
		return res.jsend.error(
			`${tribes.name} does not have sufficient balance for this harvest`
		);
	}

	// if every thing goes well initiate payout
	const payoutCompleted = await payoutCustomer(
		harvestAmount,
		req.user.stipeConnectedCustomerID,
		process.env.STRIPE_SECRET
	);

	console.log('payoutCompleted', payoutCompleted);

	// if payment is not successful
	if (payoutCompleted.amount !== harvestAmount) {
		return res.jsend.error('Harvesting failed');
	}

	// harvest payload
	const harvestPayload = {
		tribe: req.body.tribe,
		user: req.user._id,
		amount: harvestAmount
	};

	// create the harvest record
	const harvestCreated = await Harvest.create(harvestPayload).catch(err => err);
	// if error return
	if (harvestCreated instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${harvestCreated}`
		);
	}
	// update the tribe balance and tribe current index
	await updateObject(
		Tribe,
		{ _id: req.body.tribe },
		{
			balance: tribes.balance - harvestAmount,
			currentIndex: harvestTurnFound.priority
		}
	);
	// successful creation
	return res.jsend.success(harvestCreated);
}

/*
 * GET /harvests route to get all harvests from db via a tribe
 */
export async function findByTribe(req, res) {
	// get all harvests via user institution
	const harvestFound = await Harvest.find({
		tribe: req.query.tribe
	}).catch(err => err);

	// if error return
	if (harvestFound instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${harvestFound}`
		);
	}

	// if harvests does not exist
	if (!harvestFound) {
		// return message to user
		return res.jsend.error('No harvests was found');
	}

	// fetch the requested harvests
	return res.jsend.success(harvestFound);
}

/*
 * GET /harvests route to get all harvests from db via a user
 */
export async function findByUser(req, res) {
	// get all harvests via user institution
	const harvestFound = await Harvest.find({
		user: req.query.user
	}).catch(err => err);

	// if error return
	if (harvestFound instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${harvestFound}`
		);
	}

	// if harvests does not exist
	if (!harvestFound) {
		// return message to user
		return res.jsend.error('No harvests was found');
	}

	// fetch the requested harvests
	return res.jsend.success(harvestFound);
}

/*
 * GET /harvests find Harvest Round
 */
// export async function findHarvestTurn(req, res) {}

/*
 * GET /harvests route to get all harvests from db via a user ID
 */
export async function findByID(req, res) {
	// get all harvests via user institution
	const harvestFound = await Harvest.find({
		_id: req.params.id
	}).catch(err => err);

	// if error return
	if (harvestFound instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${harvestFound}`
		);
	}

	// if harvests does not exist
	if (!harvestFound) {
		// return message to user
		return res.jsend.error('No harvests was found');
	}

	// fetch the requested harvests
	return res.jsend.success(harvestFound);
}

export async function modify(req, res) {
	const harvestModified = await Harvest.findByIdAndUpdate(
		{ _id: req.params.id },
		req.body
	).catch(err => err);

	// if error return
	if (harvestModified instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${harvestModified}`
		);
	}

	// fetch the requested harvests
	return res.jsend.success(harvestModified);
}

/*
 * POST /harvest/delete route to create new harvest
 */
export async function destroy(req, res) {
	const harvestDeleted = await Harvest.findByIdAndRemove({
		_id: req.params.id
	}).catch(err => err);

	// if error return
	if (harvestDeleted instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${harvestDeleted}`
		);
	}

	// fetch the requested harvests
	return res.jsend.success(harvestDeleted);
}
