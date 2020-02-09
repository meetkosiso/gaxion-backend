import firebase from 'firebase-admin';

const serviceAccount = require('../../../public/googleService.json');

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: 'https://gaxion-cloud.firebaseio.com'
});

// fireStore instantiaton
const fireStore = firebase.firestore();

export const pushNoitification = async (payload, options, notificationKey) => {
	// push notification instance
	const pushNotificationInstance = await firebase
		.messaging()
		.sendToDevice(notificationKey, payload, options)
		.catch(err => err);
	// return response to caller
	return pushNotificationInstance;
};

export const add = async data => {
	const added = await fireStore
		.collection('TribeRequest')
		.add(data)
		.catch(err => err);
	// return response to caller
	return added;
};

export const remove = async id => {
	const removed = await fireStore
		.collection('TribeRequest')
		.doc(id)
		.delete();
	// return response to caller
	return removed;
};

export const update = async (id, data) => {
	const updated = await fireStore
		.collection('TribeRequest')
		.doc(id)
		.update(data);
	// return response to caller
	return updated;
};
