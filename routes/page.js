const express = require('express');
const controller = require('../controller/page');
const router = express.Router();

router.get("/", controller.main);
router.get("/start", controller.start);
router.get("/start/login", controller.login);
router.get("/start/signup", controller.signup);
router.get("/start/pwFind", controller.pwFind);
router.get("/start/idFind", controller.idFind);
router.get("/start/google", controller.google);
router.get("/start/kakao", controller.kakao);
router.get("/header", controller.header);
router.get("/header/project", controller.projectheader);
router.get("/project/home", controller.project);
router.get("/mypage", controller.mypage);
router.get("/project/board_write", controller.board_write);
router.get("/footer", controller.footer);
router.get("/project/board_main", controller.board_main);
router.get("/project/issue_main", controller.issue);
router.get("/project/newProject", controller.newProject);
router.get("/project/calender", controller.calender);
router.get("/project/issue_write", controller.issue_write);
router.get("/project/issue_content", controller.issue_content);

module.exports = router;
