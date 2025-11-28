/**
 * @file app/utils/path/path.util.js
 * @description path 유틸리티
 * 251128 v1.0.0 jung init
 */

import path from 'path';

function getViewDirPath() {
  // 예약어가 아님을 인식 시키기 위해 __ 붙임
  const __dirname = process.env.APP_MODE !== 'dev' ? process.env.APP_DIST_PATH : path.resolve(process.env.APP_DIST_PATH);

  return path.join(__dirname, 'index.html');
}

export default {
  getViewDirPath,
}