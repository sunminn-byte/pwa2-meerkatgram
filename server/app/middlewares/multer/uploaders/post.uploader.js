/**
 * @file app/middlewares/multer/uploaders/post.uploader.js
 * @description 게시글 이미지 업로더
 * 251127 v1.0.0 jung init
 */

import multer from "multer";
import fs from "fs";
import dayjs from "dayjs";
import myError from "../../../errors/customs/my.error.js";
import { BAD_FILE_ERROR } from "../../../../configs/responseCode.config.js";
import pathUtil from '../../../utils/path/path.util.js';

/**
 * 게시글 이미지 업로더 처리 미들웨어
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export default function(req, res, next) {

  // multer 객체 인스턴스
  const upload = multer({

    // storage: 파일을 저장할 위치를 상세하게 제어하는 프로퍼티
    storage: multer.diskStorage({
      // 파일 저장 경로 설정
      destination(req, file, callback) { // file: 유저가 전달한 파일 객체
        const fullPath = pathUtil.getPostsImagePath();

        // 저장 디렉토리 설정
        if(!fs.existsSync(fullPath)) { // 파일시스템의 existsSync로 디렉토리 존재 여부 확인
          // 해당 디렉토리 없으면 생성 처리
          fs.mkdirSync(
            fullPath,
            {
              recursive: true, // 중간(에 없는) 디렉토리까지 모두 생성
              mode: 0o755      // 디렉토리의 권한 설정 rwxr-xr-x ((읽기, 쓰기, 실행)을 8진수로 표현)
            }
          );
        }
        // multer가 자동으로 생성하는 callback함수 (error발생시 아래에서 예외처리)
        callback(null, fullPath);
      },
      // 파일명 설정
      filename(req, file, callback) { // file: 유저가 전달한 파일 객체
        // 저장할 파일명 생성(Unique한 이름이어야 함)
        const uniqueFileName = `${dayjs().format('YYYYMMDD')}_${crypto.randomUUID()}`;
        const fileNameParts = file.originalname.split('.');
        const ext = fileNameParts[fileNameParts.length - 1].toLowerCase();

        callback(null, `${uniqueFileName}.${ext}`);
      }
    }),

    // fileFilter: 파일 필터링 처리를 제어하는 프로퍼티(우리가 허용하는 파일인지 체크)
    fileFilter(req, file, callback) {
      if(!file.mimetype.startsWith('image/')) {
        return callback(myError('이미지 파일 아님', BAD_FILE_ERROR));
      }
      callback(null, true);
    },

    // limits: 파일 사이즈 제한, 파일 개수 제한
    limits: {
      fileSize: parseInt(process.env.FILE_POST_IMAGE_SIZE),
    }

  }).single('image');


  // 예외 처리
  // (multer에서 예외 발생시 errorHandloer로 연결이 안되기 때문)
  upload(req, res, err => {
    if(err instanceof multer.MulterError || err) {
      next(myError(err.message, BAD_FILE_ERROR));
    }
    next();
  });
}