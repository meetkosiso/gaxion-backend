import express from 'express';
import passport from 'passport';

import * as users from './controller';
import localStrategy from '../../passport/passport.local';
import googleStrategy from '../../passport/passport.google';
import authentication from '../../middleware/authentication';

passport.use(localStrategy);
passport.use(googleStrategy);
const router = express.Router();

/**
 * @api {post} /users/signin signin user
 * @apiName Users
 * @apiGroup User
 * @apiParam {String} email
 * @apiParam {String} password


 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 record not found.
 */

router.post('/auth/login', users.login);

/**
 * @api {post} /auth/resetPassword/token get reset password token
 * @apiName Users
 * @apiGroup User
 * @apiParam {String} email
 * @apiParam {String} password


 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 record not found.
 */

router.post('/auth/resetPassword/token', users.getResetPasswordToken);

/**
 * @api {post} /auth/resetPassword  reset users password
 * @apiName Users
 * @apiGroup User
 * @apiParam {String} email
 * @apiParam {String} password


 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 record not found.
 */

router.post('/auth/resetPassword', users.resetPassword);

/**
 * @api {post} /auth/google/signin signin user
 * @apiName Users
 * @apiGroup User
 * @apiParam {String} email
 * @apiParam {String} password


 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 record not found.
 */

router.get('/auth/google/login', users.loginWithGoogle);

/**
  * @api {post} /users/create register new  user
  * @apiName Users
  * @apiGroup User
  * @apiParam {String} email
  * @apiParam {String} password
  * @apiParam {String} role
  * @apiParam {ObjectId} institution


  * @apiError {Object} 400 Some parameters may contain invalid values.
  * @apiError 404 record not found.
  */

router.post('/auth/create', users.create);

/**
  * @api {post} /users/create register new  user
  * @apiName Users
  * @apiGroup User
  * @apiParam {String} email
  * @apiParam {String} password
  * @apiParam {String} role
  * @apiParam {ObjectId} institution


  * @apiError {Object} 400 Some parameters may contain invalid values.
  * @apiError 404 record not found.
  */

router.post('/auth/create', users.create);

/**
  * @api {post} /pushNoitification/register register new pushNoitification key
  * @apiName Users
  * @apiGroup User
  * @apiParam {String} email
  * @apiParam {String} password
  * @apiParam {String} role
  * @apiParam {ObjectId} institution


  * @apiError {Object} 400 Some parameters may contain invalid values.
  * @apiError 404 record not found.
  */

router.post(
	'/auth/notification/register',
	authentication,
	users.registerPushNotificatioKey
);

/**
  * @api {post} /pushNoitification/create send pushNoitification
  * @apiName Users
  * @apiGroup User
  * @apiParam {String} email
  * @apiParam {String} password
  * @apiParam {String} role
  * @apiParam {ObjectId} institution


  * @apiError {Object} 400 Some parameters may contain invalid values.
  * @apiError 404 record not found.
  */

router.post('/auth/notification', authentication, users.notify);

/**
  * @api {post} /stripe/connected/account/create
  * @apiName Users
  * @apiGroup User
  * @apiParam {String} email
  * @apiParam {String} password
  * @apiParam {String} role
  * @apiParam {ObjectId} institution


  * @apiError {Object} 400 Some parameters may contain invalid values.
  * @apiError 404 record not found.
  */

router.post(
	'/auth/stripe/connected/account/create',
	authentication,
	users.onCreateConnectedAccount
);

/**
  * @api {get} /findAll/ get all registered users
  * @apiName Users
  * @apiGroup User
  * @apiParam {String} email
  * @apiParam {String} password
  * @apiParam {String} role
  * @apiParam {ObjectId} institution


  * @apiError {Object} 400 Some parameters may contain invalid values.
  * @apiError 404 record not found.
  */

router.get('/auth/findAll', authentication, users.findAll);

/**
   * @api {post} /auth/destroy  find and destroy record by id
   * @apiName find and destroy records
   * @apiGroup supervisor, administrator
   * @apiParam {String} mete No

   * @apiError {Object} 400 Some paraauths may contain invalid values.
   * @apiError 404 user not found.
   */

router.delete('/auth/destroy/:id', users.destroy);

// export
export default router;
