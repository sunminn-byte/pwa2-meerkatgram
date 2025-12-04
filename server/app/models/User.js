/**
 * @file app/models/User.js
 * @description user model
 * 251120 v1.0.0 jung init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'User'; // 모델명(JS(프로그래밍단) 내부에서 사용)

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '유저 PK',
  },
  email: {
    field: 'email',
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true, // 중복 금지
    comment: '이메일(로그인ID)',
  },
  password: {
    field: 'password',
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '비밀번호',
  },
  nick: {
    field: 'nick',
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: '닉네임',
  },
  provider: { // 소셜로그인시 다른 소셜로 중복 가입되지 않도록 하는 처리
    field: 'provider',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '로그인 제공자(NONE, KAKAO, GOOGLE...)',
  },
  role: { // 회원관리 등급
    field: 'role',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '유저 권한(NORMAL, SUPER...)',
  },
  profile: {
    field: 'profile',
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '유저 프로필',
  },
  refreshToken: {
    field: 'refresh_token',
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '리프레쉬 토큰',
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    allowNull: true,
    get() {
      const val = this.getDataValue('createdAt');
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
      const val = this.getDataValue('updatedAt');
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
  tableName: 'users', // 실제 DB 테이블명
  timestamps: true,   // createdAt, updatedAt를 자동 관리
  paranoid: true,     // soft delete 설정 (deletedAt 자동 관리)
}

const User = {
  init: (sequelize) => { // sequelize객체가 옴(이름은 상관없음)
    const define = sequelize.define(modelName, attributes, options);

    // JSON으로 serialize시, 제외할 컬럼을 지정
    // define의 부모객체가 가진 prototype중에서 toJSON 함수를 아래에 재정의하여 사용
    define.prototype.toJSON = function() {
      const attributes = this.get(); // 내가 가진 column정보 다 가져오기
      delete attributes.password;    // 필요없는 정보 지우기
      delete attributes.refreshToken;

      return attributes;
    }

    return define;
  },
  associate: (db) => {
    db.User.hasMany(db.Post, { sourceKey: 'id', foreignKey: 'userId', as: 'posts' });
    db.User.hasMany(db.Like, { sourceKey: 'id', foreignKey: 'userId', as: 'likes' });
    db.User.hasMany(db.Comment, { sourceKey: 'id', foreignKey: 'userId', as: 'comments' });
    db.User.hasMany(db.PushSubscription, { sourceKey: 'id', foreignKey: 'userId', as: 'pushSubscriptions' });
    db.User.hasMany(db.Notification, { sourceKey: 'id', foreignKey: 'userId', as: 'notifications' });
  },
}

export default User;