const express = require("express");
const controller = require("../controller/project_issue");
const router = express.Router();
const middleware = require("../middleware/auth");

// //프로젝트 생성
// router.post("/create", controller.createProject);

// 프로젝트 이슈 조회
router.get("/", middleware.auth, controller.getProjectIssues);

// 프로젝트 이슈 작성
router.post("/", middleware.auth, controller.createProjectIssue);

// 프로젝트 이슈 검색
router.get("/search", middleware.auth, controller.searchProjectIssues);

// 프로젝트 이슈 상세 조회 + 수정 + 삭제
router.get("/detail/:id", middleware.auth, controller.getProjectIssueDetail);
router.patch("/detail/:id", middleware.auth, controller.updateProjectIssueDetail);
router.delete("/detail/:id", middleware.auth, controller.deleteProjectIssueDetail);

//댓글 관리 편리하게 하고자 분리함
//프로젝트 이슈 댓글 작성
router.post("/comment", middleware.auth, controller.writeProjectIssueComment);
//프로젝트 이슈 댓글 조회 + 수정 + 삭제
router.get("/comment/:id", middleware.auth, controller.getProjectIssueComment);
router.patch("/comment/:id", middleware.auth, controller.updateProjectIssueComment);
router.delete("/comment/:id", middleware.auth, controller.deleteProjectIssueComment);

module.exports = router;
