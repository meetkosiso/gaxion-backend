import stripe from 'stripe';

export const createCustomer = async (email, tokenID, secretKey) => {
	const stripeResponse = await stripe(secretKey)
		.customers.create({ email, source: tokenID })
		.catch(err => err);
	// return stripeResponse
	return stripeResponse;
};

export const updateCustomer = async (stripeCustomerID, tokenID, secretKey) => {
	// create customers source
	const stripeSource = await stripe(secretKey)
		.customers.createSource(stripeCustomerID, { source: tokenID })
		.catch(err => err);
	// create customers source object
	const stripeSourceObject = await stripe(secretKey)
		.customers.update(stripeCustomerID, { default_source: stripeSource.id })
		.catch(err => err);
	// return stripeSourceObject
	return stripeSourceObject;
};

export const chargeCustomer = async (amount, stripeCustomerID, secretKey) => {
	// effect charges on customers account
	const stripeResponse = await stripe(secretKey)
		.charges.create({
			amount,
			currency: 'USD',
			customer: stripeCustomerID,
			description: 'Seeded to tribe'
		})
		.catch(err => err);
	// return response
	return stripeResponse;
};

export const createConnectedAccount = async (authorizationCode, secretKey) => {
	const stripeCustomerID = await stripe(secretKey)
		.oauth.token({
			grant_type: 'authorization_code',
			code: authorizationCode
		})
		.catch(err => err);
	// return the connected stripe customer ID
	return stripeCustomerID;
};

export const payoutCustomer = async (
	amount,
	stripeConnectedCustomerID,
	secretKey
) => {
	const payoutFound = await stripe(secretKey)
		.transfers.create({
			amount,
			currency: 'usd',
			destination: stripeConnectedCustomerID
		})
		.catch(err => err);
	// return objects
	return payoutFound;
};
