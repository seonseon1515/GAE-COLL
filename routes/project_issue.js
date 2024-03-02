const express = require("express");
const controller = require("../controller/project_issue");
const router = express.Router();
const middleware = require("../middleware/auth");

// //프로젝트 생성
// router.post("/create", controller.createProject);

// 프로젝트 이슈 조회
router.get("/get", middleware.auth, controller.getProjectIssues);

// 프로젝트 이슈 검색
router.get("/search", middleware.auth, controller.searchProjectIssues);

// 프로젝트 이슈 상세 조회
router.get("/detail/:id", middleware.auth, controller.getProjectIssueDetail);

// 프로젝트 이슈 작성
router.post("/write", middleware.auth, controller.createProjectIssue);

module.exports = router;
