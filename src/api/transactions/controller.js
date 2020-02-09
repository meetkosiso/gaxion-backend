// import { isSameWeek } from 'date-fns';
import transactions from './model';
import { updateObject } from '../../services/updateObject';
import { details } from '../../services/getObject';
import User from '../user/model';
import Tribe from '../tribe/model';
import { createCustomer, chargeCustomer } from '../../services/stripe';

/*
 * POST /transactions/create route to create new transactions
 */
export async function create(req, res) {
	// initialise customer instance
	// let customerInstance = null;
	let chargeCustomerInstance = null;
	// tribe delimiter
	const tribeDelimiter = { _id: req.body.tribe };

	// get the tribe objects
	const tribeFound = await details(Tribe, tribeDelimiter);
	const currentDate = new Date().toISOString();

	// if an user already has a stripe id
	if (
		req.user.stripeCustomerID !== undefined &&
		req.user.stripeCustomerID !== null
	) {
		// effect charge on the customers account
		chargeCustomerInstance = await chargeCustomer(
			req.body.amount,
			req.user.stripeCustomerID,
			process.env.STRIPE_SECRET
		);

		// if payment is not successful
		if (chargeCustomerInstance.status !== 'succeeded') {
			return res.jsend.error('Seeding failed');
		}
	} else {
		// create and new stripe record
		const createCustomerInstance = await createCustomer(
			req.user.email,
			req.body.tokenID,
			process.env.STRIPE_SECRET
		);
		// effect charge on the customers account
		chargeCustomerInstance = await chargeCustomer(
			req.body.amount,
			createCustomerInstance.id,
			process.env.STRIPE_SECRET
		);

		// if payment is not successful
		if (chargeCustomerInstance.status !== 'succeeded') {
			return res.jsend.error('Seeding failed');
		}

		// save the customers stripe ID for later reference
		await updateObject(
			User,
			{ email: req.user.email },
			{ stripeCustomerID: createCustomerInstance.id }
		);
	}

	// create the transactions record
	const transactionsCreated = await transactions
		.create(req.body)
		.catch(err => err);

	// if error return
	if (transactionsCreated instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${transactionsCreated}`
		);
	}
	// add money to tribe's balance
	let currentBalance = req.body.amount;
	// if balance is available
	if (tribeFound.balance !== undefined) {
		// currentBalance
		currentBalance = tribeFound.balance + req.body.amount;
	}
	// update tribe's balance
	updateObject(Tribe, tribeDelimiter, {
		balance: currentBalance,
		latestTransactionDate: currentDate
	});

	// // is the firstSeedingDate updated
	// if (
	// 	tribeFound.frequency === 'Weekly' &&
	// 	tribeFound.firstSeedingDate === 'undefined'
	// ) {
	// 	// update the tribes firstSeedingDate
	// 	updateObject(Tribe, tribeDelimiter, {
	// 		firstSeedingDate: currentDate
	// 	});
	// }

	// // if updated is it within range
	// if (
	// 	tribeFound.frequency === 'Weekly' &&
	// 	tribeFound.firstSeedingDate !== 'undefined'
	// ) {
	// 	// check if is within range of the same week
	// 	if (!isSameWeek(tribeFound.firstSeedingDate, currentDate)) {
	// 		// update the tribes firstSeedingDate
	// 		updateObject(Tribe, tribeDelimiter, {
	// 			firstSeedingDate: currentDate
	// 		});
	// 	}
	// }

	// successful creation
	return res.jsend.success(transactionsCreated);
}
/*
 * GET /transactionss route to get all transactionss from db via a tribe
 */
export async function findByTribe(req, res) {
	// get all transactionss via user institution
	const transactionsFound = await transactions
		.find({
			tribe: req.query.tribe
		})
		.populate({
			path: 'user',
			select: 'fullName email'
		})
		.populate({
			path: 'tribe',
			select:
				'name amount creator lastHarvestDate lastMemberThatHarvest frequency'
		})
		.catch(err => err);

	// if error return
	if (transactionsFound instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${transactionsFound}`
		);
	}

	// if transactionss does not exist
	if (!transactionsFound) {
		// return message to user
		return res.jsend.error('No transactionss was found');
	}

	// fetch the requested transactionss
	return res.jsend.success(transactionsFound);
}

/*
 * GET /transactionss route to get all transactionss from db via a tribe
 */
export async function findAll(req, res) {
	// get all transactionss via user institution
	const transactionsFound = await transactions
		.find({})
		.populate({
			path: 'user',
			select: 'fullName email'
		})
		.populate({
			path: 'tribe',
			select:
				'name amount creator lastHarvestDate lastMemberThatHarvest frequency'
		})
		.catch(err => err);

	// if error return
	if (transactionsFound instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${transactionsFound}`
		);
	}

	// if transactionss does not exist
	if (!transactionsFound) {
		// return message to user
		return res.jsend.error('No transactionss was found');
	}

	// fetch the requested transactionss
	return res.jsend.success(transactionsFound);
}

/*
 * GET /transactionss route to get all transactionss from db via a user
 */
export async function findByUser(req, res) {
	// get all transactionss via user institution
	const transactionsFound = await transactions
		.find({
			user: req.user._id
		})
		.populate({
			path: 'user',
			select: 'fullName email'
		})
		.populate({
			path: 'tribe',
			select:
				'name amount creator lastHarvestDate lastMemberThatHarvest frequency'
		})
		.catch(err => err);

	// if error return
	if (transactionsFound instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${transactionsFound}`
		);
	}

	// if transactionss does not exist
	if (!transactionsFound) {
		// return message to user
		return res.jsend.error('No transactionss was found');
	}

	// fetch the requested transactionss
	return res.jsend.success(transactionsFound);
}

/*
 * GET /transactionss route to get all transactionss from db via a user ID
 */
export async function findByID(req, res) {
	// get all transactionss via user institution
	const transactionsFound = await transactions
		.find({
			_id: req.params.id
		})
		.catch(err => err);

	// if error return
	if (transactionsFound instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${transactionsFound}`
		);
	}

	// if transactionss does not exist
	if (!transactionsFound) {
		// return message to user
		return res.jsend.error('No transactionss was found');
	}

	// fetch the requested transactionss
	return res.jsend.success(transactionsFound);
}

export async function modify(req, res) {
	const transactionsModified = await transactions
		.findByIdAndUpdate({ _id: req.params.id }, req.body)
		.catch(err => err);

	// if error return
	if (transactionsModified instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${transactionsModified}`
		);
	}

	// fetch the requested transactionss
	return res.jsend.success(transactionsModified);
}

/*
 * POST /transactions/delete route to create new transactions
 */
export async function destroy(req, res) {
	const transactionsDeleted = await transactions
		.findByIdAndRemove({
			_id: req.params.id
		})
		.catch(err => err);

	// if error return
	if (transactionsDeleted instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${transactionsDeleted}`
		);
	}

	// fetch the requested transactionss
	return res.jsend.success(transactionsDeleted);
}
