const express = require('express');
const controller = require('../controller/user');
const router = express.Router();

//회원가입
router.post('/signup', controller.signup);

//로그인
// router.post('/login/email', controller.loginEmail);
// router.post('/login/kakao', controller.loginKakao);
// router.post('/login/google', controller.loginGoogle);

//아이디 찾기
//비밀번호 찾기
//유저프로필 조회
//유저 프로필 수정
//유저 프로필,비밀번호 수정
//회원탈퇴
//유저조회
module.exports = router;
