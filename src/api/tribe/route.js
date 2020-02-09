import express from 'express';
import * as tribe from './controller';
import authentication from '../../middleware/authentication';

const router = express.Router();

router.use(authentication);

/**
 * @api {post} /tribe/create  create new tribe records
 * @apiName create tribe records
 * @apiGroup User
 * @apiParam {String} tribe No
 * @apiParam {String} originaltribeReading
 * @apiParam {String} currenttribeReading
 * @apiParam {String} tribeMark

 * @apiError {Object} 400 Some paratribes may contain invalid values.
 * @apiError 404 user not found.
 */

router.post('/tribe/create', tribe.create);

/**
  * @api {post} /tribe/modify/:id  modify tribe records
  * @apiName modify tribe records
  * @apiGroup administrator, supervisor
  * @apiParam {String} tribe No
  * @apiParam {String} originaltribeReading
  * @apiParam {String} currenttribeReading
  * @apiParam {String} tribeMark

  * @apiError {Object} 400 Some paratribes may contain invalid values.
  * @apiError 404 user not found.
  */

router.put('/tribe/modify/:id', tribe.modify);

/**
   * @api {post} /tribe/findAll  find all tribe records
   * @apiName find all tribe records
   * @apiGroup administrator, supervisor
   * @apiParam {String} All

   * @apiError {Object} 400 Some paratribes may contain invalid values.
   * @apiError 404 user not found.
   */

router.get('/tribe/findAll', tribe.findAll);

/**
   * @api {post} /tribe/find/:id  find all tribe records
   * @apiName find all tribe records
   * @apiGroup administrator, supervisor
   * @apiParam {String} All

   * @apiError {Object} 400 Some paratribes may contain invalid values.
   * @apiError 404 user not found.
   */

router.get('/tribe/find/:id', tribe.findByID);

/**
   * @api {post} /tribe/destroy  find and destroy record by id
   * @apiName find and destroy records
   * @apiGroup supervisor, administrator
   * @apiParam {String} mete No

   * @apiError {Object} 400 Some paratribes may contain invalid values.
   * @apiError 404 user not found.
   */

router.delete('/tribe/destroy/:id', tribe.destroy);

export default router;
