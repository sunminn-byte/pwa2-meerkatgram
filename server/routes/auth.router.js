/**
 * @file routes/auth.router.js
 * @description 인증 관련 라우터
 * 251119 v1.0.0 jung init
 */

import express from 'express';
import { authController } from '../app/controllers/auth.controller.js';
import loginValidator from '../app/middlewares/validations/validators/auth/login.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import socialValidator from '../app/middlewares/validations/validators/auth/social.validator.js'

const authRouter = express.Router();

// 유저의 인증정보를 생성하는 거라서 post 사용
// authRouter.post('/login', (req, res, next) => { 
//   return res.status(200).send('로그인 성공');
// });
// auth.controller.js에서 만들어서 아래와 같이 적용
authRouter.post('/login', loginValidator, validationHandler, authController.login);
// authRouter.post('/reissue', authMiddleware, (req, res, next) => {
//   return res.send('reissue test');
// });
authRouter.post('/logout', authMiddleware, authController.logout);
authRouter.post('/reissue', authController.reissue);
authRouter.get('/social/:provider', socialValidator, validationHandler, authController.social);
authRouter.get('/callback/:provider', authController.socialCallback);

export default authRouter;