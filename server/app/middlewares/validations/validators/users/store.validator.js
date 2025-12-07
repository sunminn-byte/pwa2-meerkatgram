/**
 * @file app/middlewares/validations/validators/users/store.validator.js
 * @description 회원가입용 유효성 체크
 * 251205 v1.0.0 jung init
 */

import userFields from "../../fields/user.field.js";
const { profile, email, password, passwordChk, nick } = userFields;

export default [profile, email, password, passwordChk, nick];