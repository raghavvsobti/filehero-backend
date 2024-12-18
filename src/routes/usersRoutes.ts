import express from 'express';
import {
    getUser,
    getUsers
} from '../controllers/usersController';
import isAuthenticated from '../middlewares/isAuthenticated';

const router = express.Router();

router.get('/user/:id', isAuthenticated, getUser);  
router.get('/users', isAuthenticated, getUsers);    

export default router;