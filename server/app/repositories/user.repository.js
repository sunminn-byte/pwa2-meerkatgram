/**
 * @file app/repositories/user.repository.js
 * @description User Repository
 * 251120 v1.0.0 jung init
 */

import db from '../models/index.js';
const { User } = db;

// 아래에서 transacion을 t로 표시
async function findByEmail(t = null, email) {
  // 아래에서 User는 models의 User파일이 아닌, index.js에서 만든 User
  // SELECT * FROM users WHERE email = ? AND deleted_at IS NULL;
  return await User.findOne(
    {
      where: {
        email: email
      }
    },
    {
      transacion: t
    }
  );
}

export default {
  findByEmail,
}