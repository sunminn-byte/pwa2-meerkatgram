/**
 * @file app/services/auth.service.js
 * @description auth Service
 * 251120 v1.0.0 jung init
 */

import bcrypt from 'bcrypt';
import userRepository from "../repositories/user.repository.js";
import myError from '../errors/customs/my.error.js';
import { NOT_REGISTERD_ERROR } from '../../configs/responseCode.config.js';


async function login(body) {
  const { email, password } = body;

  // email로 유저 정보 획득 (db에 접속)
  const result = await userRepository.findByEmail(null, email);

  // 유저 존재 여부 체크 (id(email) 존재 여부)
  if(!result) {
    // throw new Error('유저 없음');
    throw myError('유저 미존재', NOT_REGISTERD_ERROR);
  }

  // 비밀번호 체크
  if(!bcrypt.compareSync(password, result.password)) {
    throw new Error('비밀번호 틀림');
  }

  return result;
}

export default {
  login,
};