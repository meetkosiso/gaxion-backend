import mongoose from 'mongoose';

const harvestSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'the user field is required']
		},
		tribe: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Tribe',
			required: [true, 'the tribe field is required']
		},
		amount: {
			type: String,
			required: [true, 'the amount field is required']
		}
	},
	{
		timestamps: {
			createdAt: 'createdAt',
			updatedAt: 'updatedAt'
		}
	}
);

module.exports = mongoose.model('Harvest', harvestSchema);
