/**
 * @file app/models/Comment.js
 * @description comment model
 * 251120 v1.0.0 jung init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'Comment'; // 모델명(JS(프로그래밍단) 내부에서 사용)
const tableName = 'comments';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '코멘트 PK',
  },
  userId: {
    field: 'user_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '유저 PK',
  },
  postId: {
    field: 'post_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '게시글 PK',
  },
  content: {
    field: 'content',
    type: DataTypes.STRING(1000),
    allowNull: false,
    comment: '내용',
  },
  replyId: {
    field: 'reply_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '대댓글 PK',
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    allowNull: true,
    get() {
      const val = this.getDataValue('deletedAt');
      if(!val) {
        return null;
      }
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    allowNull: true,
    get() {
      const val = this.getDataValue('deletedAt');
      if(!val) {
        return null;
      }
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  deletedAt: {
    field: 'deleted_at',
    type: DataTypes.DATE,
    allowNull: true,
    get() {
      const val = this.getDataValue('deletedAt');
      if(!val) {
        return null;
      }
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }
  },
};

const options = {
  tableName: 'comments', // 실제 DB 테이블명
  timestamps: true,   // createdAt, updatedAt를 자동 관리
  paranoid: true,     // soft delete 설정 (deletedAt 자동 관리)
}

const Comment = {
  init: (sequelize) => { // sequelize객체가 옴(이름은 상관없음)
    const define = sequelize.define(modelName, attributes, options);

    return define;
  },
  associate: (db) => {
    db.Comment.belongsTo(db.User, { sourceKey: 'id', foreignKey: 'userId', as: 'author' });
    db.Comment.belongsTo(db.Post, { sourceKey: 'id', foreignKey: 'postId', as: 'post' });  },
}

export default Comment;