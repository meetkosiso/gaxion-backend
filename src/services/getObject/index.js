export const details = async (instance, delimiter) => {
	const objectFound = await instance.findOne(delimiter).catch(err => err);
	// if an error occurs
	if (objectFound instanceof Error) {
		return `An error occurred while processing your request ${objectFound}`;
	}
	// returns success if successful
	return objectFound || null;
};
