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
        deleteUserByIdController,
        setProfileUsersController,
        setPhotoProfileUsersController
} from '../controllers/user.controller.js';
import configureMulter from '../helpers/profile.multer.helpers.js';
const upload = await configureMulter();

router.get('/', isAdmin, getAllUsersController) 
router.get('/profile', isLoggedIn, getProfileUsersController)
router.get('/profile/set-profile-photo/:id', isLoggedIn, setProfileUsersController)
router.post('/profile/set-profile-photo/:id', isLoggedIn, upload.single('photo'), setPhotoProfileUsersController)
router.get('/newUser', isAdmin, getNewUserTest) 
router.post('/newUser', isAdmin, createNewUserTest) 
router.get('/edit/:id', isAdmin, getUserForEditByIdController) 
router.post('/edit/:id', isAdmin, editUserByIdController)
router.get('/delete/:id', isAdmin, deleteUserByIdController) 



export default router
