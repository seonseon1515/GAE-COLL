const { Board, BoardComment } = require("../models");

//보드 전체 조회
exports.getBoardAll = async (req, res) => {
    try {
        const { project_id } = req.params;

        const getBoardAllResult = await Board.findAll({
            order: [["id", "DESC"]],
            where: { project_id },
        });
        res.json({ success: true, result: getBoardAllResult.data });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};

//보드작성
exports.boardWrite = async (req, res) => {
    my_id = req.userId;
    try {
        const { project_id, board_title, board_description, user_id, status, deadline } = req.body;
        let is_mine = false;

        user_id.include(is_mine) ? (is_mine = true) : (is_mine = false);

        const boardWriteResult = await Board.create({
            project_id,
            board_title,
            board_description,
            user_id,
            status,
            deadline,
            is_mine,
        });
        res.json({ success: true, result });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//보드 1개조회
exports.getBoardDetail = async (req, res) => {
    try {
        const { project_id, board_id: id } = req.params;
        const getBoardDatail = await Board.findOne({
            order: [["id", "DESC"]],
            where: { id, project_id },
        });
        res.json({ success: true, result: getBoardDatail.data });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//보드 월별조회
exports.getBoardMonth = async (req, res) => {
    try {
        const { project_id, YYYYMM } = req.params;

        const getBoardAllResult = await Board.findAll({
            order: [["id", "DESC"]],
            where: { project_id, deadline: { [Op.like]: `${YYYYMM}%` } },
        });
        res.json({ success: true, result: getBoardAllResult.data });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//보드 수정
exports.updateBoard = async (req, res) => {};
//보드 삭제
exports.deleteBoard = async (req, res) => {
    try {
        my_id = req.userId;
        const { board_id: boardId } = req.body;
        const deleteBoardResult = await Board.delete({
            where: {
                boardId,
            },
        });
        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//보드에 해당하는 댓글 가져오기
exports.getComment = async (req, res) => {
    try {
        const { project_id: projectId, board_id: id } = req.params;

        const getCommentAllResult = await BoardComment.findAll({
            order: [["id", "DESC"]],
            where: { projectId, id },
        });
        res.json({ success: true, result: getCommentAllResult.data });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//댓글 작성
exports.writeCommnet = async (req, res) => {
    try {
        my_id = req.userId;
        const { project_id: projectId, comment, board_id: boardId } = req.body;
        const createCommentResult = await BoardComment.create({
            projectId,
            boardId,
            comment,
            user_id: my_id,
        });
        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//댓글 삭제
exports.deleteComment = async (req, res) => {
    try {
        my_id = req.userId;
        const { board_id: boardId } = req.body;
        const deleteCommentResult = await BoardComment.delete({
            where: {
                boardId,
            },
        });
        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
