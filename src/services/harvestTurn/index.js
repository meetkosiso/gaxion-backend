export const nextHarvestTurn = async (
	TribeInstance,
	TribeMemberInstance,
	tribe
) => {
	// priority index
	let priorityIndex = null;

	const tribeDelimiter = { _id: tribe };
	// tribe instance
	const tribeFound = await TribeInstance.findOne(tribeDelimiter).catch(
		err => err
	);
	// if Error
	if (tribeFound instanceof Error) {
		return tribeFound;
	}
	// if tribe current index is undefined
	if (tribeFound.currentIndex === undefined) {
		// priorityIndex equals 1
		priorityIndex = 1;
	} else {
		// get priorityIndex
		priorityIndex = tribeFound.currentIndex + 1;
	}
	// TribeMembers
	const tribeMemberFound = await TribeMemberInstance.find({
		tribe,
		requestStatus: true
	})
		.populate({
			path: 'user',
			select: 'name email'
		})
		.catch(err => err);

	// if the current index has reached the end,
	if (priorityIndex === tribeMemberFound.length) {
		// return from the begining
		priorityIndex = 1;
	}
	// get the user with the priorityIndex
	const nextTribeMember = tribeMemberFound.filter(
		member => member.priority === priorityIndex
	);
	// return TribeMember
	return nextTribeMember[0];
};
