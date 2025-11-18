/**
 * @file databases/seeders/dummy-users.seeder.js
 * @description users table dummy data create
 * 251118 v1.0.0 jung init
 */
import bcrypt from 'bcrypt';


// 테이블명
const tableName = 'users';


/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    // 레코드 정보
    const records = [
      {
        email: 'admin@admin.com',
        password: await bcrypt.hash('qwe12312', 10), // 단방향 암호화 (비동기처리)
        // password: bcrypt.hashSync('qwe12312', 10), // await사용 안하려면 hash 대신에 hashSync 사용, hashSync 사용시 export 밖에 작성 가능
        nick: '미어캣관리자',
        provider: 'NONE',
        role: 'SUPER',
        profile: '',
        // 모델이 없어서 자동 관리가 안되기 때문에 created_at, updated_at 작성해줘야 함
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'admin2@admin.com',
        password: await bcrypt.hash('qwe12312', 10),
        nick: '미어캣관리자2',
        provider: 'KAKAO',
        role: 'NORMAL',
        profile: '',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ];

    // 데이터 생성 : queryInterface.bulkInsert(tableName, records, options) // 마지막에 options 없으면 안 적거나 {} 
    await queryInterface.bulkInsert(tableName, records, {});
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tableName, records, options)
    await queryInterface.bulkDelete(tableName, null, {});
  }
};
