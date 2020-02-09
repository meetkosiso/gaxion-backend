export const updateObject = async (instance, delimiter, value) => {
	const objectUpdated = await instance
		.findOneAndUpdate(delimiter, value)
		.catch(err => err);
	// if an error occurs
	if (objectUpdated instanceof Error) {
		return `An error occurred while processing your request ${objectUpdated}`;
	}
	// return response
	return objectUpdated;
};
