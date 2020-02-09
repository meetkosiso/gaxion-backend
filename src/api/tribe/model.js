import mongoose from 'mongoose';

const tribeSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'the tribe name field is required']
		},
		amount: {
			type: Number,
			required: [true, 'the amount field is required']
		},
		privacy: {
			type: String,
			required: [true, 'the privacy field is required']
		},
		frequency: {
			type: String,
			required: [true, 'the frequency field is required']
		},
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'the creator field is required']
		},
		currentIndex: Number,
		lastHarvestDate: String,
		latestTransactionDate: String,
		firstSeedingDate: String,
		balance: Number,
		lastMemberThatHarvest: String
	},
	{
		timestamps: {
			createdAt: 'createdAt',
			updatedAt: 'updatedAt'
		}
	}
);

module.exports = mongoose.model('Tribe', tribeSchema);
