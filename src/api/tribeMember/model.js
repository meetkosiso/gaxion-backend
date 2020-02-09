import mongoose from 'mongoose';

const tribeMemberSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		tribe: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Tribe',
			required: [true, 'the tribe field is required']
		},
		email: {
			type: String,
			required: [true, 'the user email field is required']
		},
		requestStatus: {
			type: Boolean,
			enum: [true, false],
			default: false
		},
		pushNotificationKey: String,
		priority: {
			type: Number
		}
	},
	{
		timestamps: {
			createdAt: 'createdAt',
			updatedAt: 'updatedAt'
		}
	}
);

module.exports = mongoose.model('TribeMember', tribeMemberSchema);
