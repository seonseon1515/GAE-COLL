const express = require("express");
const controller = require("../controller/user");
const router = express.Router();
const middleware = require("../middleware/auth");

//회원가입
router.post("/signup", controller.signup);

//이메일 확인
router.post("/emailAuth", controller.emailAuth);
//로그인
router.post("/login/email", controller.loginEmail);
// router.post('/login/google', controller.loginGoogle);

//아이디 찾기
router.post("/findID", controller.findID);
//비밀번호 찾기
router.post("/findPW", controller.findPW);
//유저프로필 조회
router.post("/info", middleware.auth, controller.getUserInfo);

//유저 프로필 수정
router.patch("/update/info", middleware.auth, controller.updateUser);

//유저 비밀번호 수정
router.patch("/update/pw", middleware.auth, controller.updatePassword);

//유저 이미지(경로만) 수정
router.patch("/update/profileimg", middleware.auth, controller.updateUserImage);

//회원탈퇴
router.delete("/drop", middleware.auth, controller.userDrop);

//유저조회
router.post("/find", controller.findUser);

module.exports = router;
