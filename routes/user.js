const express = require('express');
const controller = require('../controller/user');
const router = express.Router();
const middleware = require('../middleware/auth');

//회원가입
router.post('/signup', controller.signup);

//로그인
router.post('/login/email', controller.loginEmail);

//아이디 찾기
//비밀번호 찾기
//유저프로필 조회
router.post('/info', middleware.auth, controller.getUserInfo);
//유저 프로필 수정
//유저 프로필,비밀번호 수정
//회원탈퇴
//유저조회
router.post('/find', controller.findUser);

module.exports = router;
