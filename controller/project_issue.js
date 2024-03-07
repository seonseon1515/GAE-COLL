const { Issue, IssueComment, User } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const { project } = require("./page");

// 프로젝트 이슈 작성 (글 + 파일)
exports.createProjectIssue = async (req, res) => {
    const files = req.files;
    console.log("file", files);
    const { title, content, projectId, issue_date } = req.body;
    const userId = req.userId;

    try {
        //각 파일들 이름 변경
        let fileNames = null;
        if (files) {
            fileNames = files.map((file) => file.filename).join(", ");
            console.log("파일 이름:", fileNames);
        }

        const newProjectIssue = await Issue.create({ title, content, projectId, userId, issue_date, files: fileNames });

        console.log("issue id:", newProjectIssue.id);
        res.json({ success: true, result: newProjectIssue.id });
    } catch (error) {
        console.error("이슈 작성 오류:", error);
        res.json({ success: false, result: error });
    }
};

// 프로젝트 이슈 검색
exports.searchProjectIssues = async (req, res) => {
    try {
        const { keyword, type } = req.query;
        const projectId = req.params.id;

        //제목이면 type = 0, 작성자면 type = 1
        if (type !== "0" && type !== "1") {
            return res.json({ success: false, result: "올바른 검색 유형을 지정하세요." });
        }

        let projectIssues;
        if (type === "0") {
            projectIssues = await Issue.findAll({ where: { projectId, title: { [Op.like]: `%${keyword}%` } } });
            return res.json({ success: true, result: projectIssues });
        }

        if (type === "1") {
            const user = await User.findOne({ where: { user_name: { [Op.like]: `%${keyword}%` } } });
            if (user) {
                projectIssues = await Issue.findAll({ where: { projectId, userId: user.id } });
                return res.json({ success: true, result: projectIssues });
            } else {
                return res.json({ success: false, result: "존재하지 않는 회원입니다." });
            }
        }
        console.log("projectIssues결과 출력", projectIssues);
        res.json({ success: true, result: projectIssues });
    } catch (error) {
        console.error("이슈 검색 오류:", error);
        res.json({ success: false, result: error });
    }
};

// 프로젝트 이슈 조회 (모든 프로젝트 이슈)
exports.getProjectIssues = async (req, res) => {
    try {
        const { id: projectId } = req.params; // 프로젝트 ID
        console.log(req.params);
        const userId = req.userId; // 작성자 ID
        console.log(projectId, userId);
        const projectIssues = await Issue.findAll({ where: { projectId } });
        res.json({ success: true, result: projectIssues });
    } catch (error) {
        console.log("이슈 조회 오류:", error);
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

// 프로젝트 이슈 수정
exports.updateProjectIssueDetail = async (req, res) => {
    const files = req.files;
    console.log(files);
    //id(이슈id), user_id(작성자), req.userId(현재 사용자)
    const { id } = req.params;
    const userId = req.userId;
    const { title, content } = req.body;

    //작성자 본인인지 확인
    const issue = await Issue.findOne({ where: { id } });
    console.log(issue.userId, userId, id);
    if (issue.userId !== userId) {
        return res.json({ success: false, result: "작성자만 수정할 수 있습니다." });
    }

    try {
        console.log(files);
        let issueFiles = issue.files;
        //파일 편집할 수도 있고 안 할 수도 있고
        //첨부한 파일이 있다면
        if (files.length > 0) {
            const updatedFileNames = files.map((file) => file.filename).join(", ");
            console.log("업데이트 한 파일명", updatedFileNames);
            //기존에 파일이 있다면 이어서 추가, 없다면 새로 추가
            issueFiles += issueFiles ? `, ${updatedFileNames}` : updatedFileNames;
        }
        const updateResult = await Issue.update({ title, content, files: issueFiles }, { where: { id } });

        res.json({ success: true, result: updateResult });
    } catch (error) {
        console.error("이슈 수정 오류:", error);
        res.json({ success: false, result: error });
    }
};

exports.deleteProjectIssueFile = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { fileName } = req.body; // 삭제할 파일의 이름
        console.log("이슈아이디:", id);
        console.log("유저아이디:", userId);
        console.log("파일이름:", fileName);
        // 작성자 본인인지 확인
        const issue = await Issue.findOne({ where: { id } });
        if (issue.userId !== userId) {
            return res.json({ success: false, result: "작성자만 삭제할 수 있습니다." });
        }

        // 실제 파일 삭제
        const filePath = "./public/uploads/issue/" + fileName;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("파일 삭제 성공");
        } else {
            console.log("파일이 이미 삭제되었거나 존재하지 않습니다.");
        }

        let updatedFiles = issue.files
            .split(", ")
            .filter((file) => file.trim() !== fileName.trim())
            .join(", ");

        // DB 업데이트
        const updatedFilesResult = await Issue.update({ files: updatedFiles }, { where: { id } });

        res.json({ success: true, result: updatedFilesResult });
    } catch (error) {
        console.error("파일 삭제 오류:", error);
        res.json({ success: false, result: error });
    }
};

// 프로젝트 이슈 삭제
exports.deleteProjectIssueDetail = async (req, res) => {
    //작성자 본인인지 확인
    try {
        const { id } = req.params; //이슈Id
        const userId = req.userId;

        const issue = await Issue.findByPk(id);
        if (issue.userId !== userId) {
            return res.json({ sucess: false, result: "작성자만 삭제할 수 있습니다." });
        }

        //댓글 삭제
        await IssueComment.destroy({ where: { issueId: issue.id } });

        let issueFilesName = issue.files.split(", ");
        console.log(issueFilesName[0] === "");

        //파일이 존재하면
        if (issueFilesName.length === 1 && issueFilesName[0] === "") {
        } else {
            // 실제 파일 삭제
            for (let i = 0; i < issueFilesName.length; i++) {
                let filePath = "./public/uploads/issue/" + issueFilesName[i];
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log("파일 삭제 성공");
                } else {
                    console.log("파일이 이미 삭제되었거나 존재하지 않습니다.");
                }
            }
        }

        //마지막으로 이슈글 삭제
        await Issue.destroy({ where: { id } });

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
        const getAllComment = await IssueComment.findAll({ where: { issueId } });
        res.json({ success: true, result: getAllComment });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};

//프로젝트 이슈 댓글 수정
exports.updateProjectIssueComment = async (req, res) => {
    try {
        const { id, comment } = req.body; //댓글Id
        const userId = req.userId;

        //작성자 본인인지 확인
        const issueComment = await IssueComment.findByPk(id);
        if (issueComment.userId !== userId) {
            return res.json({ success: false, result: "작성자만 수정할 수 있습니다." });
        }

        // 댓글 업데이트
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
            return res.json({ success: false, result: "작성자만 삭제할 수 있습니다." });
        }

        await IssueComment.destroy({ where: { id } });
        res.json({ success: true, result: "댓글이 삭제되었습니다." });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
