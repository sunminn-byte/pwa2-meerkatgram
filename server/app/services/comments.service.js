/**
 * @file app/services/comments.service.js
 * @description comment Service
 * 251203 v1.0.0 jung init
 */

import webpush from '../../configs/webpush.config.js';
import commentRepository from "../repositories/comment.repository.js"
import postRepository from '../repositories/post.repository.js';
import userRepository from '../repositories/user.repository.js';
import pushSubscriptionRepository from "../repositories/pushSubscription.repository.js";
import db from '../models/index.js';

/**
 * 코멘트 작성 처리
 * @param {{postId: string, userId: string, content: string}} data 
 */
async function store(data) {
  // 코멘트 작성
  // null해서 transaction 안에 넣어도 되지만 다른 작업이 필요해서 밖으로 뺌
  const comment = await commentRepository.create(null, data);

  // 게시글 조회
  const post = await postRepository.findByPk(null, data.postId);

  // 타인 게시글에 코멘트할 경우만, 푸시 보내기
  // (`다른` 사람이 `내` 게시글에 코멘트할 경우만 푸시 받기)
  if(post.userId !== data.userId) {
    await db.sequelize.transaction(async t => {
      // 댓글 작성자 정보 획득
      const user = await userRepository.findByPk(t, data.userId);

      // 푸시 데이터 작성
      const payload = JSON.stringify({
        title: '새로운 댓글', // 푸시 제목
        message: `${user.nick}님께서 당신의 게시글에 댓글을 작성하셨습니다.`, // 푸시 내용
        data: { // 푸시 화면에는 출력하지 않지만, 전달할 필요가 있는 data
          targetUrl: `${process.env.APP_URL}${process.env.WEB_PUSH_FRONT_URL_POST_SHOW}/${data.postId}` // front가 이동하는 주소
        }
      });
      
      // 게시글 작성자의 푸시 정보 획득
      const pushSubscriptions = await pushSubscriptionRepository.findByUserId(t, post.userId);
  
      // 해당 푸시 발송
      // 동기처리시 시간이 오래 걸리기 때문에, 비동기 병렬처리
      const pushList = pushSubscriptions.map(async pushSubscription => {
        // subscription 구조
        const subscription = {
          endpoint: pushSubscription.endpoint,
          expirationTime: null,
          keys: {
            p256dh: pushSubscription.p256dh,
            auth: pushSubscription.auth
          }
        };

        try {
          await webpush.sendNotification(subscription, payload);
        } catch(error) {
          // expired(폐기된) 푸시는 제거
          if(error.statusCode === 410) {
            await pushSubscriptionRepository.hardDestroy(t, pushSubscription.id);
          }
        }
      });

      // 병렬처리 완료 확인
      const result = await Promise.allSettled(pushList);
    });
  }

  return comment;
}

export default {
  store,
}