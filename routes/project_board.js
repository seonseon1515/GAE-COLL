const express = require("express");
const controller = require("../controller/project_board");
const router = express.Router();
const { auth } = require("../middleware/auth");

//보드 조회
router.post("/board/get", auth);
//보드 작성
router.post("/write", auth);
//보드 1개 조회
router.post("/detail", auth);
//보드 월별 조회
router.post("/month/get", auth);

module.exports = router;
