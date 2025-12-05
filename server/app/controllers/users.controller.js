/**
 * @file app/controllers/users.controller.js
 * @description user 관련 컨트롤러
 * 251205 v1.0.0 jung init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import usersService from "../services/users.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

// ------------------------------
// ----------- public -----------
// ------------------------------
/**
 * 회원가입 작성
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체 
 * @returns
 */
async function store(req, res, next) {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
      nick: req.body.nick,
      profile: req.body.profile
    };

    await usersService.store(data); // 서비스에 전달

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS));
  } catch(error) {
    return next(error);
  }
}


// ------------------------------
// export
// ------------------------------
export const authController = {
  store,
};