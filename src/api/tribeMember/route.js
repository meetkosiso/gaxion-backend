import express from 'express';
import * as tribeMember from './controller';
import authentication from '../../middleware/authentication';
import tribe from '../../middleware/tribe';

const router = express.Router();

router.use(authentication);

/**
 * @api {post} /tribe/member/create  create new tribe records
 * @apiName create tribe records
 * @apiGroup User
 * @apiParam {String} tribe No
 * @apiParam {String} originaltribeReading
 * @apiParam {String} currenttribeReading
 * @apiParam {String} tribeMark

 * @apiError {Object} 400 Some paratribes may contain invalid values.
 * @apiError 404 user not found.
 */

router.post('/tribe/member/create', tribe, tribeMember.create);

/**
 * @api {post} /tribe/member/response  create response to request
 * @apiName create tribe records
 * @apiGroup User
 * @apiParam {String} tribe No
 * @apiParam {String} originaltribeReading
 * @apiParam {String} currenttribeReading
 * @apiParam {String} tribeMark

 * @apiError {Object} 400 Some paratribes may contain invalid values.
 * @apiError 404 user not found.
 */

router.post('/tribe/member/respond', tribeMember.requestResponse);

/**
 * @api {get} /tribe/member/turn  create response to request
 * @apiName create tribe records
 * @apiGroup User
 * @apiParam {String} tribe No
 * @apiParam {String} originaltribeReading
 * @apiParam {String} currenttribeReading
 * @apiParam {String} tribeMark

 * @apiError {Object} 400 Some paratribes may contain invalid values.
 * @apiError 404 user not found.
 */

router.get('/tribe/member/turn', tribeMember.getHarvestTurn);

/**
  * @api {post} /tribe/member/modify/:id  modify tribeMember records
  * @apiName modify tribe records
  * @apiGroup administrator, supervisor
  * @apiParam {String} tribe No
  * @apiParam {String} originaltribeReading
  * @apiParam {String} currenttribeReading
  * @apiParam {String} tribeMark

  * @apiError {Object} 400 Some paratribes may contain invalid values.
  * @apiError 404 user not found.
  */

router.put('/tribe/member/modify/:id', tribeMember.modify);

/**
   * @api {post} /tribe/member/findAll  find all tribeMember records
   * @apiName find all tribe records
   * @apiGroup administrator, supervisor
   * @apiParam {String} All

   * @apiError {Object} 400 Some paratribes may contain invalid values.
   * @apiError 404 user not found.
   */

router.post('/tribe/member/findAll', tribe, tribeMember.findAll);

/**
   * @api {post} /tribe/member/invitation/list  find all tribeMember records
   * @apiName find all tribe records
   * @apiGroup administrator, supervisor
   * @apiParam {String} All

   * @apiError {Object} 400 Some paratribes may contain invalid values.
   * @apiError 404 user not found.
   */

router.get('/tribe/member/invitation/list', tribe, tribeMember.invitationList);

/**
   * @api {post} /tribe/mytribes  find all tribe records that i belong
   * @apiName find all tribe records
   * @apiGroup administrator, supervisor
   * @apiParam {String} All

   * @apiError {Object} 400 Some paratribes may contain invalid values.
   * @apiError 404 user not found.
   */

router.get('/tribe/member/mytribes', tribeMember.findAllMyTribes);

/**
   * @api {post} /tribe/member/find/:id  find all tribeMember records
   * @apiName find all tribe records
   * @apiGroup administrator, supervisor
   * @apiParam {String} All

   * @apiError {Object} 400 Some paratribes may contain invalid values.
   * @apiError 404 user not found.
   */

router.get('/tribe/member/find/:id', tribeMember.findByID);

/**
   * @api {post} /tribe/member/destroy  find and destroy record by id
   * @apiName find and destroy records
   * @apiGroup supervisor, administrator
   * @apiParam {String} mete No

   * @apiError {Object} 400 Some paratribes may contain invalid values.
   * @apiError 404 user not found.
   */

router.delete('/tribe/member/destroy', tribeMember.destroy);

export default router;
