const { Board, BoardComment } = require("../models");
const { Op } = require("sequelize");

//보드 전체 조회
exports.getBoardAll = async (req, res) => {
    try {
        const projectId = req.projectId;
        console.log(projectId);

        const getBoardAllResult = await Board.findAll({
            order: [["id", "DESC"]],
            where: { projectId: Number(projectId) },
        });

        res.json({ success: true, result: getBoardAllResult });
    } catch (error) {
        console.log(error);
        res.json({ success: false, result: error });
    }
};

//보드작성
exports.boardWrite = async (req, res) => {
    userId = req.userId;
    const projectId = req.projectId;

    try {
        const { title, description, status, deadline } = req.body;

        const boardWriteResult = await Board.create({
            projectId: Number(projectId),
            title,
            description,
            userId: Number(userId),
            status,
            deadline,
        });
        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//보드 1개조회
exports.getBoardDetail = async (req, res) => {
    try {
        userId = req.userId;

        const { board_id: id } = req.query;

        const getBoardDatail = await Board.findOne({
            order: [["id", "DESC"]],
            where: { id: Number(id) },
        });

        let is_mine = false;

        getBoardDatail.userId == userId ? (is_mine = true) : (is_mine = false);

        res.json({ success: true, result: { data: getBoardDatail, is_mine } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, result: error });
    }
};
//보드 월별조회
exports.getBoardMonth = async (req, res) => {
    try {
        const projectId = req.projectId;
        const { YYYYMM } = req.query;

        const getBoardAllResult = await Board.findAll({
            order: [["id", "DESC"]],
            where: { projectId, deadline: { [Op.like]: `${YYYYMM}%` } },
        });
        res.json({ success: true, result: getBoardAllResult });
    } catch (error) {
        console.log(error);
        res.json({ success: false, result: error });
    }
};
//보드 수정
exports.updateBoard = async (req, res) => {
    userId = req.userId;
    try {
        const { title, description, status, deadline, board_id: id } = req.body;

        const boardWriteResult = await Board.update(
            {
                title,
                description,
                userId: Number(userId),
                status,
                deadline,
            },
            {
                where: {
                    id,
                },
            }
        );

        res.json({ success: true, result: "" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, result: error });
    }
};
//보드 삭제
exports.deleteBoard = async (req, res) => {
    try {
        const { board_id: id } = req.body;
        const deleteBoardResult = await Board.destroy({
            where: {
                id,
            },
        });
        res.json({ success: true, result: "" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, result: error });
    }
};
//보드에 해당하는 댓글 가져오기
exports.getComment = async (req, res) => {
    try {
        const { board_id: id } = req.params;

        const getCommentAllResult = await BoardComment.findAll({
            order: [["id", "DESC"]],
            where: { id },
        });
        res.json({ success: true, result: getCommentAllResult.data });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//댓글 작성
exports.writeCommnet = async (req, res) => {
    try {
        userId = req.userId;

        const { comment, board_id: boardId } = req.body;
        const createCommentResult = await BoardComment.create({
            boardId: Number(boardId),
            userId: Number(userId),
            comment,
        });
        res.json({ success: true, result: "" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, result: error });
    }
};
//댓글 삭제
exports.deleteComment = async (req, res) => {
    try {
        const { comment_id: id } = req.body;
        const deleteCommentResult = await BoardComment.destroy({
            where: {
                id: Number(id),
            },
        });
        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
