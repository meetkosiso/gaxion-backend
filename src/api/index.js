import express from 'express';

import user from './user';
import transactions from './transactions';
import tribe from './tribe';
import tribeMember from './tribeMember';
import harvest from './harvest';
import sendEmail from './sendEmail';

const router = express.Router();

// use Routes
router.use(user);
router.use(tribeMember);
router.use(transactions);
router.use(tribe);
router.use(harvest);
router.use(sendEmail);

export default router;
