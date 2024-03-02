const { Project, Issue, IssueComment, ProjectMember } = require("../models");
const { Op } = require("sequelize");

// 사용자가 프로젝트의 멤버인지 확인하는 로직 추가

// 프로젝트 이슈 조회
exports.getProjectIssues = async (req, res) => {
    try {
        const { project_id: projectId } = req.body; // 프로젝트 ID
        const userId = req.userId; // 작성자 ID
        console.log(projectId, userId);
        const isMember = await ProjectMember.findOne({ where: { userId, projectId } });
        // 프로젝트 멤버 여부 확인
        if (isMember) {
            const projectIssues = await Issue.findAll({ where: { projectId } });
            res.json({ success: true, result: projectIssues });
        } else {
            res.json({ success: false, result: "프로젝트 멤버만 접근할 수 있습니다." });
        }
    } catch (error) {
        console.error("프로젝트 이슈 조회 오류:", error);
        res.json({ success: false, result: error });
    }
};

// 프로젝트 이슈 검색
exports.searchProjectIssues = async (req, res) => {
    const { keyword } = req.query;

    try {
        if (isMemeber) {
            const projectIssues = await Issue.findAll({ where: { title: { [Op.like]: `%${keyword}%` } } });
            res.json({ success: true, result: projectIssues });
        } else {
            res.json({ success: true, result: "검색 권한이 없습니다." });
        }
    } catch (error) {
        console.error("프로젝트 이슈 검색 오류:", error);
        res.json({ success: false, result: error });
    }
};

// 프로젝트 이슈 상세 조회
exports.getProjectIssueDetail = async (req, res) => {
    const { id, project_id } = req.params;

    try {
        if (isMemeber) {
            const projectIssue = await Issue.findByPk(id);
            if (projectIssue) {
                console.log(projectIssue);
                res.json({ success: true, result: projectIssue });
            } else {
                res.json({ success: false, result: "해당 프로젝트 이슈를 찾을 수 없습니다." });
            }
        } else {
            res.json({ success: false, result: "상제 조회 권한이 없습니다." });
        }
    } catch (error) {
        console.error("프로젝트 이슈 상세 조회 오류:", error);
        res.json({ success: false, result: error });
    }
};

// 프로젝트 이슈 작성
exports.createProjectIssue = async (req, res) => {
    const { issue_title, issue_content, project_id: projectId, files } = req.body;
    const userId = req.userId;
    try {
        // 프로젝트 멤버 여부 확인
        if (isMember) {
            // 현재 사용자가 프로젝트의 멤버일 경우에만 이슈 작성
            const newProjectIssue = await Issue.create({ issue_title, issue_content, projectId });
            res.json({ success: true, result: newProjectIssue });
        } else {
            // 현재 사용자가 프로젝트의 멤버가 아닌 경우 에러 반환
            res.json({ success: false, result: "프로젝트 멤버만 작성할 수 있습니다" });
        }
    } catch (error) {
        console.error("프로젝트 이슈 작성 오류:", error);
        res.json({ success: false, result: error });
    }
};
