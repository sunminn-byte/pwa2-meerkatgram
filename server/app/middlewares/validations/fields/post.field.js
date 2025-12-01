/**
 * @file app/middlewares/validations/fields/post.field.js
 * @description 게시글 유효성 검사 필드
 * 251128 v1.0.0 jung init
 */

import { body, param, query } from "express-validator";
import fs from 'fs';
import pathUtil from "../../../utils/path/path.util.js";
import path from "path";

// 페이지 필드
export const page = query('page')
  .trim()
  .optional()
  .isNumeric()
  .withMessage('숫자만 허용합니다.')
  .toInt();

// 게시글 PK 필드
export const id = param('id')
  .trim()
  .notEmpty()
  .withMessage('필수 항목입니다.')
  .bail()
  .isNumeric()
  .withMessage('숫자만 허용합니다.')
  .toInt();

// 게시글 내용
export const content = body('content')
  .trim()
  .notEmpty()
  .withMessage('내용은 필수 항목입니다.');

// 게시글 이미지
export const image = body('image')
  .trim()
  .notEmpty()
  .withMessage('이미지는 필수 항목입니다.')
  .bail()
  .custom(val => {
    // 우리 앱의 게시글 이미지에 접근하는 `도메인 + path`가 맞는지 확인
    if(!val.startsWith(`${process.env.APP_URL}${process.env.ACCESS_FILE_POST_IMAGE_PATH}`)) {
      return false; // 아니면 false가 되어 withMessage 실행
    }

    return true; // 맞으면 통과
  })
  .withMessage('허용하지 않는 이미지 경로입니다.') // 앞의 처리가 false일 때 실행
  .bail()
  .custom(val => {
    // 실제 이미지 파일이 있는지 검증 처리
    const splitPath = val.split('/'); // 받은 값(val)을 '/' 기준으로 쪼개기
    const fullPath = path.join(pathUtil.getPostsImagePath(), splitPath[splitPath.length - 1]);
    
    if(!fs.existsSync(fullPath)) {
      return false;
    }

    return true;
  })
  .withMessage('존재하지 않는 이미지 경로입니다.');