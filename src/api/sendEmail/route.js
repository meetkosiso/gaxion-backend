import express from 'express';
import * as email from './controller';
import authentication from '../../middleware/authentication';

const router = express.Router();

router.use(authentication);

/**
 * @api {post} /email/create  create new email records
 * @apiName create email records
 * @apiGroup User
 * @apiParam {String} email No
 * @apiParam {String} originalemailReading
 * @apiParam {String} currentemailReading
 * @apiParam {String} emailMark

 * @apiError {Object} 400 Some paraemails may contain invalid values.
 * @apiError 404 user not found.
 */
router.post('/email/send', email.sendEmail);

export default router;
