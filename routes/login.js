import express from 'express';
import { logginGet, logginPost } from '../controllers/loginController.js';


const router = express.Router();

router.get('/', logginGet);

router.post('/', logginPost);

export default router;



