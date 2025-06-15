import express from 'express';

import { profileGet } from '../controllers/profileController.js';



const router = express.Router();

router.get('/', profileGet);

export default router;