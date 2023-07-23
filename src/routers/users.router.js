import { Router } from 'express';
import isAdmin from '../middlewares/admin.middleware.js';
import isLoggedIn from '../middlewares/login.middleware.js';

const router = Router();

import { getAllUsersController, 
        getProfileUsersController, 
        getNewUserTest,
        createNewUserTest ,
        getUserForEditByIdController,
        editUserByIdController,
        deleteUserByIdController
} from '../controllers/user.controller.js';


router.get('/', isAdmin, getAllUsersController) 

router.get('/profile', isLoggedIn, getProfileUsersController)

router.get('/newUser', isAdmin, getNewUserTest) 

router.post('/newUser', isAdmin, createNewUserTest) 

router.get('/edit/:id', isAdmin, getUserForEditByIdController) 

router.post('/edit/:id', isAdmin, editUserByIdController)

router.get('/delete/:id', isAdmin, deleteUserByIdController) 


export default router
