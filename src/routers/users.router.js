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
        setPhotoProfileUsersController,
        setDocumentsUsersController,
        getDocumentsByUserController,
        setPremiumUserController,
        deleteUserByUserController
} from '../controllers/user.controller.js';
import configureMulter from '../helpers/multer.helpers.js';
const uploadProfilePhoto = configureMulter('img/profile');
const uploadDocuments = configureMulter('documents');

router.get('/', isAdmin, getAllUsersController) 
router.get('/profile', isLoggedIn, getProfileUsersController)
router.post('/profile/documents/:id', isLoggedIn, uploadDocuments.single('document'), setDocumentsUsersController)
router.get('/profile/set-profile-photo/:id', isLoggedIn, setProfileUsersController)
router.post('/profile/set-profile-photo/:id', isLoggedIn, uploadProfilePhoto.single('photo'), setPhotoProfileUsersController)
router.get('/newUser', isAdmin, getNewUserTest) 
router.post('/newUser', isAdmin, createNewUserTest) 
router.get('/edit/:id', isAdmin, getUserForEditByIdController) 
router.post('/edit/:id', isAdmin, editUserByIdController)
router.get('/delete/:id', isAdmin, deleteUserByIdController) 
router.get('/my-documents', isLoggedIn, getDocumentsByUserController) 
router.get('/premium/:id', setPremiumUserController) 
router.get('/delete-for-my-self/:id', deleteUserByUserController) 


export default router
