import ejs from 'ejs';
import path from 'path';
import { sendEmailOptions } from '../../services/sendEmailOptions';

const template = path.join(
	__dirname,
	'../../services/templates/resetPassword/html.ejs'
);

// send email via node Mailer
export async function sendEmail(req, res) {
	// const messageBody = {
	// 	from: 'Gaxion',
	// 	to: req.body.recipeint,
	// 	subject: req.body.subject,
	// 	text: req.body.text
	// };
	const data = await ejs.renderFile(template, {
		name: 'Stranger Okafor',
		token: 'kforoirieirieiriei'
	});

	const messageBody = {
		from: 'Gaxion',
		to: 'kosiso.gaxion@gmail.com',
		subject: 'Testing Testing 1',
		html: data
	};

	sendEmailOptions(messageBody);
	// return message
	return res.jsend.success('');
}
