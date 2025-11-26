/**
 * @file app/middlewares/auth/auth.middleware.js
 * @description 인증 및 인가 처리 미들웨어
 * 251126 v1.0.0 jung init
 */

import jwtUtil from "../../utils/jwt/jwt.util.js";
import ROLE_PERMISSIONS from "./configs/role.permissions.js";

// ------------------------
// private
// ------------------------
function authenticate(req) {
  // 토큰 획득
  const token = jwtUtil.
}

function authorize(req) {
  // 요청에 맞는 권한 규칙 조회
  const matchRole = ROLE_PERMISSIONS[req.method].find(item => {
    return item.path.test(req.path);
  });

  // 일치하는 규칙이 있을 시, 인증 및 권한 체크를 실시
  if(matchRole) {
    // 인증 체크 및 인증 정보를 Request 셋
    authenticate(req);

  }

}

// ------------------------
// public
// ------------------------
export default function(req, res, next) {
  try {
    authorize(req);

    return next();
  } catch(error) {
    return next(error);
  }
}