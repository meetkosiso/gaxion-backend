import express from 'express';
import * as transaction from './controller';
import authentication from '../../middleware/authentication';

const router = express.Router();

router.use(authentication);

/**
 * @api {post} /transaction/create  create new transaction records
 * @apiName create transaction records
 * @apiGroup User
 * @apiParam {String} transaction No
 * @apiParam {String} originaltransactionReading
 * @apiParam {String} currenttransactionReading
 * @apiParam {String} transactionMark

 * @apiError {Object} 400 Some paratransactions may contain invalid values.
 * @apiError 404 user not found.
 */

router.post('/transaction/create', transaction.create);

/**
  * @api {post} /transaction/modify/:id  modify transaction records
  * @apiName modify transaction records
  * @apiGroup administrator, supervisor
  * @apiParam {String} transaction No
  * @apiParam {String} originaltransactionReading
  * @apiParam {String} currenttransactionReading
  * @apiParam {String} transactionMark

  * @apiError {Object} 400 Some paratransactions may contain invalid values.
  * @apiError 404 user not found.
  */

router.put('/transaction/modify/:id', transaction.modify);

/**
   * @api {post} /transaction/findByUser  find all transaction records by user
   * @apiName find all transaction records
   * @apiGroup administrator, supervisor
   * @apiParam {String} All

   * @apiError {Object} 400 Some paratransactions may contain invalid values.
   * @apiError 404 user not found.
   */

router.get('/transaction/findByUser', transaction.findByUser);

/**
   * @api {post} /transaction/findAll  find all transaction records by user
   * @apiName find all transaction records
   * @apiGroup administrator, supervisor
   * @apiParam {String} All

   * @apiError {Object} 400 Some paratransactions may contain invalid values.
   * @apiError 404 user not found.
   */

router.get('/transaction/findAll', transaction.findAll);

/**
   * @api {post} /transaction/findByTribe  find all transaction records
   * @apiName find all transaction records
   * @apiGroup administrator, supervisor
   * @apiParam {String} All

   * @apiError {Object} 400 Some paratransactions may contain invalid values.
   * @apiError 404 user not found.
   */

router.get('/transaction/findByTribe', transaction.findByTribe);

/**
   * @api {post} /transaction/find/:id  find all transaction records
   * @apiName find all transaction records
   * @apiGroup administrator, supervisor
   * @apiParam {String} All

   * @apiError {Object} 400 Some paratransactions may contain invalid values.
   * @apiError 404 user not found.
   */

router.get('/transaction/find/:id', transaction.findByID);

/**
   * @api {post} /transaction/destroy  find and destroy record by id
   * @apiName find and destroy records
   * @apiGroup supervisor, administrator
   * @apiParam {String} mete No

   * @apiError {Object} 400 Some paratransactions may contain invalid values.
   * @apiError 404 user not found.
   */

router.delete('/transaction/destroy/:id', transaction.destroy);

export default router;
