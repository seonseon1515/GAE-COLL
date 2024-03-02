const { Project, Issue, IssueComment, ProjectMember } = require("../models");
const { Op } = require("sequelize");

// 프로젝트 이슈 조회 (모든 프로젝트 이슈)
exports.getProjectIssues = async (req, res) => {
    try {
        const { project_id: projectId } = req.body; // 프로젝트 ID
        const userId = req.userId; // 작성자 ID
        console.log(projectId, userId);
        const projectIssues = await Issue.findAll({ where: { projectId } });
        res.json({ success: true, result: projectIssues });
    } catch (error) {
        console.error("이슈 조회 오류:", error);
        res.json({ success: false, result: error });
    }
};

// 프로젝트 이슈 검색
exports.searchProjectIssues = async (req, res) => {
    try {
        const { keyword } = req.query;
        const projectIssues = await Issue.findAll({ where: { title: { [Op.like]: `%${keyword}%` } } });
        res.json({ success: true, result: projectIssues });
    } catch (error) {
        console.error("이슈 검색 오류:", error);
        res.json({ success: false, result: error });
    }
};

// 프로젝트 이슈 상세 조회 (글 1개 + 모든 파일)
exports.getProjectIssueDetail = async (req, res) => {
    try {
        const { id } = req.params;
        //findByPk() 안에는 반드시 primaryKey여야 함
        const projectIssue = await Issue.findByPk(id);
        if (projectIssue) {
            console.log(projectIssue);
            res.json({ success: true, result: projectIssue });
        } else {
            res.json({ success: false, result: "해당 프로젝트 이슈를 찾을 수 없습니다." });
        }
    } catch (error) {
        console.error("이슈 상세 조회 오류:", error);
        res.json({ success: false, result: error });
    }
};

// 프로젝트 이슈 작성 (글 + 파일)
exports.createProjectIssue = async (req, res) => {
    try {
        const { title, content, project_id: projectId, files } = req.body;
        const userId = req.userId;
        const newProjectIssue = await Issue.create({ title, content, projectId, files });

        //파일이 있으면 파일 업로드 (이건 미들웨어로 처리한다는 것 같은데 확인하기)

        console.log("issue id:", newProjectIssue.id);
        res.json({ success: true, result: newProjectIssue.id });
    } catch (error) {
        console.error("이슈 작성 오류:", error);
        res.json({ success: false, result: error });
    }
};

// 프로젝트 이슈 수정
exports.updateProjectIssueDetail = async (req, res) => {
    try {
        //작성자 본인인지 확인
        //id(이슈id), user_id(작성자), req.userId(현재 사용자)
        const { id } = req.params;
        const userId = req.userId;
        const { title, content, files } = req.body;

        const issue = await Issue.findOne({ where: { id } });
        if (issue.userId !== userId) {
            return res.json({ sucess: false, result: "작성자만 수정할 수 있습니다." });
        }

        const updateResult = await Issue.update({ title, content, files }, { where: { id } });

        // 파일 수정

        res.json({ success: true, result: updateResult });
    } catch (error) {
        console.error("이슈 수정 오류:", error);
        res.json({ success: false, result: error });
    }
};

// 프로젝트 이슈 삭제
exports.deleteProjectIssueDetail = async (req, res) => {
    //작성자 본인인지 확인
    try {
        const { id: issueId } = req.params;
        const userId = req.userId;

        const issue = await Issue.findOne({ where: { id } });
        if (issue.userId !== userId) {
            return res.json({ sucess: false, result: "작성자만 삭제할 수 있습니다." });
        }

        await Issue.destroy({ where: { issueId } });

        // 이슈가 삭제되면 해당 이슈 댓글들도 삭제?
        // await IssueComment.destroy({ where: { issueId } });

        // 파일 수정

        res.json({ success: true, result: "이슈가 삭제되었습니다." });
    } catch (error) {
        console.error("이슈 삭제 오류:", error);
        res.json({ success: false, result: error });
    }
};

//프로젝트 이슈 댓글 작성
exports.writeProjectIssueComment = async (req, res) => {
    try {
        const { id: issueId } = req.params;
        const userId = req.userId;
        const { comment } = req.body;

        const createNewComment = await IssueComment.create({ userId, issueId, comment });
        res.json({ success: true, result: createNewComment.id });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};

//프로젝트 이슈 댓글 조회
exports.getProjectIssueComment = async (req, res) => {
    try {
        const { id: issueId } = req.params;
        const getAllComment = await IssueComment.findAll(issueId);
        res.json({ success: true, result: getAllComment });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};

//프로젝트 이슈 댓글 수정
exports.updateProjectIssueComment = async (req, res) => {
    try {
        //작성자 본인인지 확인
        const { id } = req.body;
        const userId = req.userId;

        const issueComment = await IssueComment.findOne(id);
        if (issueComment.userId !== userId) {
            return res.json({ success: false, result: "작성자만 수정할 수 있습니다." });
        }

        const updateCommentResult = await IssueComment.update({ comment }, { where: { id } });
        res.json({ success: true, result: updateCommentResult });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};

//프로젝트 이슈 댓글 삭제
exports.deleteProjectIssueComment = async (req, res) => {
    //작성자 본인인지 확인
    try {
        const { id } = req.body;
        const userId = req.userId;

        const issueComment = await IssueComment.findByPk(id);
        if (issueComment.userId !== userId) {
            return res.json({ success: false, result: "작성자만 수정할 수 있습니다." });
        }

        await IssueComment.destroy({ where: { id } });
        res.json({ success: true, result: "댓글이 삭제되었습니다." });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
