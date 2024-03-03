const { Board, BoardComment } = require("../models");
const { Op } = require("sequelize");

//보드 전체 조회
exports.getBoardAll = async (req, res) => {
    try {
        const { project_id: projectId } = req.query;
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
    my_id = req.userId;
    console.log(my_id);
    try {
        const { project_id: projectId, title, description, user_id: userId, status, deadline } = req.body;
        let is_mine = false;

        //userId.include(my_id) ? (is_mine = true) : (is_mine = false);
        userId == my_id ? (is_mine = true) : (is_mine = false);

        const boardWriteResult = await Board.create({
            projectId: Number(projectId),
            title,
            description,
            userId: Number(userId),
            status,
            deadline,
            is_mine,
        });
        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//보드 1개조회
exports.getBoardDetail = async (req, res) => {
    try {
        const { board_id: id } = req.query;
        const getBoardDatail = await Board.findOne({
            order: [["id", "DESC"]],
            where: { id: Number(id) },
        });
        res.json({ success: true, result: getBoardDatail });
    } catch (error) {
        console.log(error);
        res.json({ success: false, result: error });
    }
};
//보드 월별조회
exports.getBoardMonth = async (req, res) => {
    try {
        const { project_id: projectId, YYYYMM } = req.query;

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
    my_id = req.userId;
    try {
        const { title, description, user_id: userId, status, deadline, board_id: id } = req.body;
        let is_mine = false;

        //userId.include(my_id) ? (is_mine = true) : (is_mine = false);
        userId == my_id ? (is_mine = true) : (is_mine = false);

        const boardWriteResult = await Board.update(
            {
                title,
                description,
                userId: Number(userId),
                status,
                deadline,
                is_mine,
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
        my_id = req.userId;
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
        my_id = req.userId;
        console.log("myId", my_id);
        const { comment, board_id: boardId } = req.body;
        const createCommentResult = await BoardComment.create({
            boardId: Number(boardId),
            userId: Number(my_id),
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
        my_id = req.userId;
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
