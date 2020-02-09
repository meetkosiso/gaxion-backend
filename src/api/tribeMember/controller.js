import { isEmail } from 'validator';
import _ from 'lodash';
import ejs from 'ejs';
import path from 'path';
import TribeMember from './model';
import User from '../user/model';
import Tribe from '../tribe/model';
import { add, update } from '../../services/fireBase';
import { details } from '../../services/getObject';
import { updateObject } from '../../services/updateObject';
import { nextHarvestTurn } from '../../services/harvestTurn';
import { sortArray } from '../../services/sortArray';
import { sendEmailOptions } from '../../services/sendEmailOptions';

const template = path.join(
	__dirname,
	'../../services/templates/tribeInvite/html.ejs'
);
/*
 * POST /TribeMember/create route to create new TribeMember
 */
export async function create(req, res) {
	// invitee email address
	const inviteeEmail = req.body.email.toLowerCase();
	// Is email valid
	if (!isEmail(inviteeEmail)) {
		return res.jsend.error('Invalid email address');
	}

	// search TribeMembers via email
	const tribeMemberFound = await TribeMember.find({
		email: inviteeEmail
	}).catch(err => err);

	// if error return
	if (tribeMemberFound instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${tribeMemberFound}`
		);
	}

	// check if a member already belong
	const tribesFound = tribeMemberFound.filter(
		tribes => tribes.tribe.toString() === req.body.tribe
	);

	// if a member already belongs to this the tribe
	if (tribesFound.length > 0) {
		// return message to user
		return res.jsend.error(
			`A member with this email address already exist on this tribe`
		);
	}

	// create the TribeMember record
	const tribeMemberCreated = await TribeMember.create(req.body).catch(
		err => err
	);

	// if error return
	if (tribeMemberCreated instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${tribeMemberCreated}`
		);
	}
	// get the tribes details
	const tribesDetails = await details(Tribe, { _id: req.body.tribe });
	// request body
	const requestBody = {
		tribe: tribesDetails.name,
		tribeID: tribesDetails._id.toString(),
		amount: tribesDetails.amount,
		email: inviteeEmail,
		frequency: tribesDetails.frequency,
		readStatus: false,
		invitee: req.user.name,
		requestStatus: false,
		createdDate: new Date().toISOString()
	};

	// add the data to real time Database
	const ref = await add(requestBody);
	// request update delimiter
	const tribeMemberUpdateDelimiter = { _id: tribeMemberCreated._id };
	// request update body
	const tribeMemberUpdateBody = { pushNotificationKey: ref.id };
	// update database with firestorm id
	const tribeMemberResponseUpdated = await TribeMember.findByIdAndUpdate(
		tribeMemberUpdateDelimiter,
		tribeMemberUpdateBody
	).catch(err => err);

	// if Error on update
	if (tribeMemberResponseUpdated instanceof Error) {
		console.log(
			'Push Notification Error',
			`An Error occurred while processing your request: ${tribeMemberResponseUpdated})`
		);
	}

	// get the email templates
	const data = await ejs.renderFile(template, {
		name: req.user.name,
		tribe: tribesDetails.name,
		invitee: req.body.email.substring(0, req.body.email.lastIndexOf('@'))
	});

	// message Body
	const messageBody = {
		from: 'Gaxion',
		to: req.body.email,
		subject: 'Tribe Invite',
		html: data
	};

	// send email options
	sendEmailOptions(messageBody);

	// successful creation
	return res.jsend.success(tribeMemberCreated);
}

/*
 * GET /Tribe/member/harvestTurn
 */
export async function getHarvestTurn(req, res) {
	const harvestTurnFound = await nextHarvestTurn(
		Tribe,
		TribeMember,
		req.query.tribe
	);

	console.log('harvestTurnFound', harvestTurnFound);
	// return result
	return res.jsend.success(harvestTurnFound);
}

/*
 * GET /TribeMembers route to get all TribeMembers from db via a user institution
 */
export async function invitationList(req, res) {
	// tribe member
	const tribeMemberFound = await TribeMember.find({
		tribe: req.query.tribe
	}).catch(err => err);
	// if error
	if (tribeMemberFound instanceof Error) {
		return res.jsend.error(tribeMemberFound);
	}
	// all tribe TribeMembers
	const allUsersFound = await User.find({})
		.select('name email')
		.catch(err => err);

	// if error
	if (allUsersFound instanceof Error) {
		return res.jsend.error(allUsersFound);
	}

	// difference found
	const differenceFound = _.differenceBy(
		allUsersFound,
		tribeMemberFound,
		'email'
	);
	// send requests
	return res.jsend.success(differenceFound);
}

/*
 * GET /TribeMembers route to get all TribeMembers from db via a user institution
 */
export async function findAll(req, res) {
	// get all TribeMembers via user institution
	const tribeMemberFound = await TribeMember.find(req.body)
		.populate({
			path: 'user',
			select: 'name email'
		})
		.populate({
			path: 'tribe',
			select:
				'name amount creator lastHarvestDate lastMemberThatHarvest frequency balance'
		})
		.catch(err => err);

	// if error return
	if (tribeMemberFound instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${tribeMemberFound}`
		);
	}

	// if TribeMembers does not exist
	if (!tribeMemberFound) {
		// return message to user
		return res.jsend.error('No TribeMembers was found');
	}

	// fetch the requested TribeMembers
	return res.jsend.success(tribeMemberFound);
}

/*
 * GET /Tribes route to get all Tribes from db via a user institution
 */
export async function findAllMyTribes(req, res) {
	// get all Tribes via user institution
	const tribesFound = await TribeMember.find({ user: req.user._id })
		.populate({
			path: 'user',
			select: 'name email'
		})
		.populate({
			path: 'tribe',
			select:
				'name amount creator lastHarvestDate lastMemberThatHarvest frequency balance'
		})
		.catch(err => err);

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

export async function requestResponse(req, res) {
	// request delimiter
	const delimiter = { pushNotificationKey: req.body.id };
	// the length of tribe member
	const tribeFound = await Tribe.find({ _id: req.body.tribeID }).catch(
		err => err
	);

	// if an error occurs
	if (tribeFound instanceof Error) {
		return res.jsend.error(
			`An error occurred processing your request ${tribeFound}`
		);
	}

	// Tribe TribeMembers
	const tribeMemberFound = await TribeMember.find({
		tribe: req.body.tribeID,
		requestStatus: true
	}).catch(err => err);

	// if an error occurs
	if (tribeMemberFound instanceof Error) {
		return res.jsend.error(
			`An error occurred processing your request ${tribeMemberFound}`
		);
	}

	// request Body
	const requestBody =
		req.body.response === true
			? {
					requestStatus: true,
					user: req.user._id,
					priority: tribeMemberFound.length + 1
			  }
			: { requestStatus: false };
	// fireStore object
	const requestBodyFireStore =
		req.body.response === true
			? { requestStatus: true, readStatus: true }
			: { requestStatus: false, readStatus: true };
	// get request
	const requestStatusUpdated = await TribeMember.findOneAndUpdate(
		delimiter,
		requestBody
	).catch(err => err);

	// if error return
	if (requestStatusUpdated instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${requestStatusUpdated}`
		);
	}
	// firebase update
	await update(req.body.id, requestBodyFireStore);
	// return response
	return res.jsend.success(requestStatusUpdated);
}

/*
 * GET /TribeMembers route to get all TribeMembers from db via a user institution
 */
export async function findByID(req, res) {
	// get all TribeMembers via user institution
	const tribeMemberFound = await TribeMember.find({
		_id: req.params.id
	}).catch(err => err);

	// if error return
	if (tribeMemberFound instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${tribeMemberFound}`
		);
	}

	// if TribeMembers does not exist
	if (!tribeMemberFound) {
		// return message to user
		return res.jsend.error('No TribeMembers was found');
	}

	// fetch the requested TribeMembers
	return res.jsend.success(tribeMemberFound);
}

export async function modify(req, res) {
	const tribeMemberModified = await TribeMember.findByIdAndUpdate(
		{ _id: req.params.id },
		req.body
	).catch(err => err);

	// if error return
	if (tribeMemberModified instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${tribeMemberModified}`
		);
	}

	// fetch the requested TribeMembers
	return res.jsend.success(tribeMemberModified);
}

/*
 * POST /TribeMember/delete route to create new TribeMember
 */
export async function destroy(req, res) {
	// get the tribes member list
	const tribeMemberFound = await TribeMember.find({
		tribe: req.query.tribe,
		requestStatus: true
	}).catch(err => err);

	// tribeMember sorted
	const tribeMemberSorted = sortArray(tribeMemberFound, 'priority');

	// effect deletion of tribe member
	const tribeMemberDeleted = await TribeMember.findByIdAndRemove({
		_id: req.query.id
	}).catch(err => err);

	// if error return
	if (tribeMemberDeleted instanceof Error) {
		return res.jsend.error(
			`An Error occurred while processing your request: ${tribeMemberDeleted}`
		);
	}
	// rearrang the priority of tribe's members
	for (
		let i = tribeMemberDeleted.priority;
		i < tribeMemberSorted.length;
		i += 1
	) {
		// update the TribeMember list
		updateObject(
			TribeMember,
			{ _id: tribeMemberSorted[i]._id },
			{ priority: tribeMemberSorted[i].priority - 1 }
		);
	}
	// fetch the requested TribeMembers
	return res.jsend.success(tribeMemberDeleted);
}
