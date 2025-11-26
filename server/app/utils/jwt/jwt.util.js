/**
 * @file /app/utils/jwt/jwt.util.js
 * @description jwt 유틸리티
 * 251125 v1.0.0 jung init
 */

import jwt from 'jsonwebtoken';

// ---------------------
// private
// ---------------------
/**
 * JWT 생성
 * @param {{}} payload 
 * @param {number} ttl 
 * @returns {string} JWT 문자열
 */
function generateToken(payload, ttl) { // ttl: time to live (유효시간 설정)
  // 옵션 설정
  const options = {
    algorithm: process.env.JWT_ALGORITHM,
    noTimestamp: false, // payload.iat 설정 (iat: issued date(토큰 발급 시간))
    expiresIn: ttl, // payload.exp 설정 (토큰 만료 시간) 밀리초단위
    issuer: process.env.JWT_ISSUER, // payload.iss 설정 (토큰 발급자)
  }

  // 토큰 생성
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

// ---------------------
// public
// ---------------------
/**
 * 엑세스 토큰 생성
 * @param {import("../../models/index.js").User} user 
 * @returns {string} JWT
 */
function generateAccessToken(user) {
  // payload 설정
  const payload = {
    sub: user.id, // payload.sub set (value: user pk)
    role: user.role, // payload.role set (value: user role)
  }

  // 엑세스 토큰 생성
  return generateToken(payload, parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRY));
}

/**
 * 리프레쉬 토큰 생성
 * @param {import("../../models/index.js").User} user 
 * @returns {string} JWT
 */
function generateRefreshToken(user) {
  // payload 설정
  const payload = {
    sub: user.id, // payload.sub set (value: user pk)
  }

  // 리프레쉬 토큰 생성
  return generateToken(payload, parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRY));
}

/**
 * 
 * @param {import("express".Request)} req 
 * @returns {string} token
 */
function getBearerToken(req) {

}

// 내보내기 (private한 generateToken은 내보내기 안함)
export default {
  generateAccessToken,
  generateRefreshToken,
}