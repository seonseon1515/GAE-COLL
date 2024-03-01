const express = require("express");
const controller = require("../controller/project");
const router = express.Router();

//프로젝트 생성
router.post("/create", controller.createProject);
//내 작업 조회
router.post("/board/mine", controller.getMyBoard);

//내 프로젝트 조회
router.post("/mine", controller.getMyProject);
//프로젝트 정보 조회
router.post("/get/info", controller.getProjectInfo);
//프로젝트 파일 조회
router.post("/get/file", controller.getProjectFile);
//프로젝트 로그 조회
router.post("/get/log", controller.projectLog);

module.exports = router;
