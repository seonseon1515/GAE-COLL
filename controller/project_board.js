const { Board } = require("../models");
exports.boardWrite = async (req, res) => {
    try {
        const { project_id, board_title, board_description, user_id, status, deadline } = req.body;

        const boardWriteResult = await Board.create({
            project_id,
            board_title,
            board_description,
            user_id,
            status,
            deadline,
        });
        res.json({ success: true, result });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
exports.getBoardDetail = async (req, res) => {
    //보드 1개 조회시 보드 코멘트도 조회하기
};
exports.getBoardMonth = async (req, res) => {};
