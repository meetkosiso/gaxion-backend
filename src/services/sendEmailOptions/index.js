import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
// 	service: 'gmail',
// 	host: 'smtp.gmail.com',
// 	secure: true,
// 	auth: {
// 		user: process.env.MAIL_USERNAME,
// 		pass: process.env.MAIL_PASSWORD
// 	}
// });

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'praise.evarest@gmail.com',
		pass: 'SAIL2WATER'
	}
});

export const sendEmailOptions = mailOptions => {
	transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			// log the error messages
			console.log(err);
			return process.exit(1);
		}
		// log info
		console.log(info);
		// return nothing
		return 'nothing';
	});
};
