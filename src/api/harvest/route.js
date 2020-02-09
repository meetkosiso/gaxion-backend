import express from 'express';
import * as harvest from './controller';
import authentication from '../../middleware/authentication';

const router = express.Router();

router.use(authentication);

/**
 * @api {post} /harvest/create  create new harvest records
 * @apiName create harvest records
 * @apiGroup User
 * @apiParam {String} harvest No
 * @apiParam {String} originalharvestReading
 * @apiParam {String} currentharvestReading
 * @apiParam {String} harvestMark

 * @apiError {Object} 400 Some paraharvest may contain invalid values.
 * @apiError 404 user not found.
 */

router.post('/harvest/create', harvest.create);

/**
  * @api {post} /harvest/modify/:id  modify harvest records
  * @apiName modify harvest records
  * @apiGroup administrator, supervisor
  * @apiParam {String} harvest No
  * @apiParam {String} originalharvestReading
  * @apiParam {String} currentharvestReading
  * @apiParam {String} harvestMark

  * @apiError {Object} 400 Some paraharvest may contain invalid values.
  * @apiError 404 user not found.
  */

router.put('/harvest/modify/:id', harvest.modify);

/**
   * @api {post} /harvest/findByUser  find all harvest records by user
   * @apiName find all harvest records
   * @apiGroup administrator, supervisor
   * @apiParam {String} All

   * @apiError {Object} 400 Some paraharvest may contain invalid values.
   * @apiError 404 user not found.
   */

router.get('/harvest/findByUser', harvest.findByUser);

/**
   * @api {post} /harvest/findByTribe  find all harvest records
   * @apiName find all harvest records
   * @apiGroup administrator, supervisor
   * @apiParam {String} All

   * @apiError {Object} 400 Some paraharvest may contain invalid values.
   * @apiError 404 user not found.
   */

router.get('/harvest/findByTribe', harvest.findByTribe);

/**
   * @api {post} /harvest/find/:id  find all harvest records
   * @apiName find all harvest records
   * @apiGroup administrator, supervisor
   * @apiParam {String} All

   * @apiError {Object} 400 Some paraharvest may contain invalid values.
   * @apiError 404 user not found.
   */

router.get('/harvest/find/:id', harvest.findByID);

/**
   * @api {post} /harvest/destroy  find and destroy record by id
   * @apiName find and destroy records
   * @apiGroup supervisor, administrator
   * @apiParam {String} mete No

   * @apiError {Object} 400 Some paraharvest may contain invalid values.
   * @apiError 404 user not found.
   */

router.delete('/harvest/destroy/:id', harvest.destroy);

export default router;
