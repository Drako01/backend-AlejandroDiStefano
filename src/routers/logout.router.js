import { Router } from 'express';
import {getLogoutController} from '../controllers/sessions.controller.js';


const router = Router();

router.get('/', getLogoutController);

export default router;

