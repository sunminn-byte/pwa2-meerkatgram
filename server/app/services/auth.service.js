/**
 * @file app/services/auth.service.js
 * @description auth Service
 * 251120 v1.0.0 jung init
 */

import bcrypt from 'bcrypt';
import userRepository from "../repositories/user.repository.js";
import myError from '../errors/customs/my.error.js';
import { NOT_REGISTERED_ERROR } from '../../configs/responseCode.config.js';
import jwtUtil from '../utils/jwt/jwt.util.js';
import db from '../models/index.js';

async function login(body) {
  // 트랜잭션 처리가 필요하다면 아래 틀 안에 넣으면 됨.
  // 모르겠으면 외우기
  // service레이어가 이렇게 생겼다고 생각하면 됨
  // return await db.sequelize.transaction(async t => {
	// 	// 비지니스 로직 작성...
  // });

  // 트랜잭션 처리 (`t`가 있는 처리 중 하나라도 실패시 rollback함)
  return await db.sequelize.transaction(async t => { // t에 transaction 객체 생성됨

    const { email, password } = body;
  
    // email로 유저 정보 획득 (db에 접속)
    const user = await userRepository.findByEmail(t, email);
  
    // 유저 존재 여부 체크 (id(email) 존재 여부)
    if(!user) {
      // throw new Error('유저 없음');
      throw myError('유저 미존재', NOT_REGISTERED_ERROR);
    }
  
    // 비밀번호 체크
    if(!bcrypt.compareSync(password, user.password)) {
      throw myError('비밀번호 틀림', NOT_REGISTERED_ERROR);
    }
  
    // JWT 생성(accessToken, refreshToken)
    const accessToken = jwtUtil.generateAccessToken(user);
    const refreshToken = jwtUtil.generateRefreshToken(user);
  
    // refreshToken 저장
    user.refreshToken = refreshToken;
    await userRepository.save(t, user);
  
    return {
      accessToken,
      refreshToken,
      user
    }

  });

}

export default {
  login,
};