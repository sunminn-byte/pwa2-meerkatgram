/**
 * @file app/middlewares/loggers/winston.logger.js
 * @description winston Logger
 * 251124 v1.0.0 jung init
 */

import winston from "winston";
import dayjs from "dayjs";

// ------------------
// private
// ------------------
// 커스텀 포맷 작성
const customFormat = winston.format.printf(({message, level}) => {
  // 출력예) [2025-11-24 10:12:50] error - message
  const now = dayjs().locale(process.env.APP_TZ).format('YYYY-MM-DD HH:mm:ss');
  return `[${now}] ${level} - ${message}`;
});

// ------------------
// public
// ------------------
// 범용 로거 인스턴스
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL, // 로그 레벨 제한
  format: winston.format.combine(customFormat),
  transports: [ // 로그를 출력하는 관리 설정( 파일로 출력할래? 콘솔로 출력할래? )
    new winston.transports.File({
      filename: `${process.env.LOG_BASE_PATH}/${dayjs().locale(process.env.APP_TZ).format('YYYYMMDD')}_${process.env.LOG_FILE_NAME}`, // 파일명
      // level: 'error' // 파일 작성 로그 레벨 제한
    }),
    // new winston.transports.Console(), // File은 파일생성, Console은 콘솔에 찍힘
    // new winston.transports.File({
    //   filename: `${dayjs().locale(process.env.APP_TZ).format('YYYYMMDD')}_log.log`, // 파일명
    //   level: 'debug' // 파일 작성 로그 레벨 제한
    // }),
  ],
});
