const { Project, ProjectFile, Board, ProjectMember, User } = require("../models");
var fs = require("fs");
//프로젝트 생성
exports.createProject = async (req, res) => {
    //파일이 null이면 데이터 안보냈을수도있는건데 ㅇㅂㅇ ... ? 어쩌지 ㅇㅂㅇ ....

    const file = req.file;

    const { project_name, start_date, end_date, overview, rule, member_id, send_img } = req.body;
    let userId;

    //사진을 보냈는데 이미지 파일이 아니면 보드 생성 실패

    if (send_img && file === undefined) {
        res.json({ success: false, result: { message: "파일업로드에 실패하였습니다." } });
        return;
    }

    //멤버가 object타입인지 string타입인지 구별 -> 포스트맨 테스트로 인해 처리
    if (typeof member_id === "object") {
        userId = member_id;
        console.log(userId.length);
    } else if (typeof member_id === "string") {
        userId = JSON.parse(member_id);
    }

    try {
        const result = [];
        let project_img;

        if (file !== undefined) {
            project_img = file.filename;
        }
        //프로젝트 생성
        const createProjectResult = await Project.create({
            project_name,
            start_date,
            end_date,
            project_img,
            overview,
            rule: JSON.stringify(rule),
        });
        const createProjectFileResult = await ProjectFile.create({
            projectId: Number(createProjectResult.id),
        });

        //프로젝트 멤버DB에 추가
        for (let i = 0; i < userId.length; i++) {
            console.log(userId, userId.length);
            const addProjectMemberResult = await ProjectMember.create({
                projectId: Number(createProjectResult.id),
                userId: Number(userId[i]),
            });

            result.push(addProjectMemberResult);
        }
        res.json({ success: true, result });
    } catch (error) {
        res.json({ success: true, result: error });
    }
};

exports.getMyBoard = async (req, res) => {
    try {
        const userId = req.userId;

        // 사용자가 참여 중인 프로젝트 조회
        const project_Id = await ProjectMember.findAll({
            where: { userId },
            attributes: ["projectId"],
            order: [["projectId", "ASC"]],
        });
        // console.log("project_Id콘솔 찍기", project_Id[0].dataValues);

        // 프로젝트 id에 매칭되는 프로젝트 이름이 있음
        // let projectName = [];
        // for (let i = 0; i < project_Id.length; i++) {
        //     let id = project_Id[i].projectId;
        //     // console.log("get프로젝트 이름 출력해보기:", getProjectName);
        //     projectName.push([id, name]);
        //     // console.log("프로젝트 이름 콘솔 찍어보기:", projectName);
        // }

        // console.log("projectName콘솔 찍기", projectName[0].dataValues);
        // 각 프로젝트에서 보드 가져오기
        // let myBoards = [];
        // // 프로젝트 별로 보드 가져오기
        // // 2차 배열 형태로 각 보드 정보 담기 (보드 타이틀, 상태, deadline)
        // for (let i = 0; i < project_Id.length; i++) {
        //     let id = project_Id[i].projectId;
        //     // console.log("id:", id);
        //     const getBoardResult = await Board.findByPk(id);
        //     // console.log("get 보드 인포", getBoardResult);
        //     let borad_title = getBoardResult.dataValues.title;
        //     let board_staus = getBoardResult.dataValues.status;
        //     let borad_deadline = getBoardResult.dataValues.deadline;
        //     myBoards.push([id, borad_title, board_staus, borad_deadline]);
        //     console.log("myBoards 콘솔 찍어보기", myBoards);
        // }

        // 프로젝트 별로 보드 가져오기 (프로젝트Name과 보드 정보 합치기)
        let projectMap = new Map();
        let myBoards = [];
        for (let i = 0; i < project_Id.length; i++) {
            let projectId = project_Id[i].projectId;
            let getProjectName = await Project.findByPk(projectId);
            let projectName = getProjectName.dataValues.project_name;

            let boards = await Board.findAll({
                where: { projectId },
                attributes: ["id", "title", "status", "deadline"],
            });

            if (!projectMap.has(projectId)) {
                projectMap.set(projectId, {
                    projectName,
                    boards,
                });
            }
        }
        const result = Array.from(projectMap.values());
        console.log("result값 출력해보기:", result);
        res.json({ success: true, result });
    } catch (error) {
        console.error("내 보드 조회 실패:", error);
        res.json({ success: false, result: "내 보드 조회 실패" });
    }
};

//사용자가 참여 중인 모든 프로젝트 조회
exports.getMyProject = async (req, res) => {
    try {
        const id = req.userId;
        const user = await User.findByPk(id);
        const { user_name, github, blog } = user;
        const projectId = await ProjectMember.findAll({
            where: { userId: user.id },
            attributes: ["projectId"],
            order: [["projectId", "ASC"]],
        });

        const project_ids = projectId.map((project_member) => project_member.dataValues.projectId);
        // console.log("proejct_ids 배열 찍어보기", project_ids);

        let projectReuslt = [];
        //2차 배열 형태로 각 프로젝트 정보 담기 (프로젝트 이름, 상태, 프로젝트 이미지)
        for (let i = 0; i < project_ids.length; i++) {
            let id = project_ids[i];
            // console.log("id:", id);
            const getProjectInfotResult = await Project.findOne({
                where: { id },
            });
            // console.log("get프로젝트 인포", getProjectInfotResult);
            let project_name = getProjectInfotResult.dataValues.project_name;
            let status = getProjectInfotResult.dataValues.status;
            let project_img = getProjectInfotResult.dataValues.project_img;

            projectReuslt.push([id, project_name, status, project_img]);
            // console.log("getProjectInfotResult 콘솔 찍어보기", projectReuslt);
        }
        res.json({ success: true, result: { user_name, github, blog, projectReuslt } });
    } catch (error) {
        res.json({ success: false, result: "프로젝트 조회 실패" });
    }
};

//팀원 보드 조회 (사용자가 참여 중인 모든 프로젝트 멤버들의 보드)
exports.getMyTeamBoard = async (req, res) => {};

//프로젝트 정보 조회
exports.getProjectInfo = async (req, res) => {
    const { project_id: id } = req.body;
    try {
        const getProjectInfotResult = await Project.findOne({
            where: { id },
        });
        res.json({ success: true, result: getProjectInfotResult });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//프로젝트 파일 조회
exports.getProjectFile = async (req, res) => {
    const { project_id: id } = req.body;
    try {
        const getProjectFileResult = await ProjectFile.findOne({
            where: { id },
        });
        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//프로젝트 로그 조회
exports.projectLog = async (req, res) => {
    const { project_id: id } = req.body;
    try {
        const getBoardLogResult = await Board.findOne({
            where: { id },
        });
        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: true, result: error });
    }
};

//프로젝트 이름 수정
exports.updateProjectName = async (req, res) => {
    const { project_id: id, project_name } = req.body;
    try {
        const updateProjectResult = await Project.update({ project_name }, { where: { id } });
        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//프로젝트 이미지 수정
exports.updateProjectImg = async (req, res) => {
    const { project_id: id } = req.body;

    //이전에 올렸던 이미지 삭제
    deleteImg(id);

    const file = req.file;
    console.log(file);
    if (file === undefined) {
        res.json({ success: false, result: { message: "파일업로드에 실패하였습니다." } });
    }
    console.log(file);
    try {
        const updateProjectResult = await Project.update({ project_img: file.filename }, { where: { id } });
        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//프로젝트 상태 수정
exports.updateProjectStatus = async (req, res) => {
    const { project_id: id, status } = req.body;
    try {
        const updateProjectResult = await Project.update({ status }, { where: { id } });
        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//프로젝트 기간 수정
exports.updateProjectperiod = async (req, res) => {
    const { project_id: id, start_date, end_date } = req.body;
    try {
        const updateProjectResult = await Project.update(
            { start_date: String(start_date), end_date: String(end_date) },
            { where: { id } }
        );
        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//프로젝트 overview 수정
exports.updateProjectOverview = async (req, res) => {
    const { project_id: id, overview } = req.body;
    try {
        const updateProjectResult = await Project.update({ overview }, { where: { id } });
        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//프로젝트 규칙 수정
exports.updateProjectRule = async (req, res) => {
    const { project_id: id, rule } = req.body;
    console.log(req.body);
    try {
        const updateProjectResult = await Project.update({ rule: JSON.stringify(rule) }, { where: { id } });
        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//프로젝트 멤버 추가
exports.addProjectMember = async (req, res) => {
    const { project_id: id, member_id } = req.body;
    let userId;
    let result = [];

    if (typeof member_id === "object") {
        userId = member_id;
    } else if (typeof member_id === "string") {
        userId = JSON.parse(member_id);
    }

    try {
        //프로젝트 멤버DB에 없으면 추가
        for (let i = 0; i < userId.length; i++) {
            console.log(id, userId[i]);
            const findProjectMemberResult = await ProjectMember.findAll({
                where: {
                    projectId: Number(id),
                    userId: Number(userId[i]),
                },
            });

            if (findProjectMemberResult.length === 0) {
                const addProjectMemberResult = await ProjectMember.create({
                    projectId: Number(id),
                    userId: Number(userId[i]),
                });
                result.push(addProjectMemberResult);
                console.log("result");
            }
        }
        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//프로젝트 멤버 삭제
exports.deleteProjectMember = async (req, res) => {
    const { project_id: id, member_id } = req.body;
    try {
        const addProjectMemberResult = await ProjectMember.destroy({
            where: {
                projectId: Number(id),
                userId: Number(member_id),
            },
        });
        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
exports.updateProjectFile = async (req, res) => {
    const files = req.files;
    const { project_id: id, type } = req.body;
    let fileName = [];
    try {
        if (files !== undefined) {
            for (let i = 0; i < files.length; i++) {
                console.log(files[i].filename);
                fileName.push(files[i].filename);
            }
        }
        console.log("fileName", fileName);
        console.log("1111", JSON.stringify(fileName));

        let updateProjectFileResult;
        if (type === "erd") {
            updateProjectFileResult = await ProjectFile.update(
                { erd: JSON.stringify(fileName) },
                {
                    where: { projectId: Number(id) },
                }
            );
        } else if (type === "plan") {
            updateProjectFileResult = await ProjectFile.update(
                { plan: JSON.stringify(fileName) },
                {
                    where: { projectId: Number(id) },
                }
            );
        } else if (type === "api") {
            updateProjectFileResult = await ProjectFile.update(
                { api: JSON.stringify(fileName) },
                {
                    where: { projectId: Number(id) },
                }
            );
        }

        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};

//프로젝트 깃허브 수정
exports.updateProjectGithub = async (req, res) => {
    const { project_id: id, github } = req.body;
    try {
        const updateProjectResult = await Project.update({ github }, { where: { id } });
        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};

exports.deleteFile = async (req, res) => {
    const { project_id: id, type, project_file } = req.body;

    try {
        //디비에서 file배열가져오기
        const getProjectFiletResult = await ProjectFile.findOne({
            where: { projectId: id },
        });

        //가져온 데이터 중 type에 해당하는거 data에 저장 및 배열로 파싱
        let data = getProjectFiletResult[String(type)];
        data = JSON.parse(data);
        //파일이 존재하면 삭제
        if (fs.existsSync("./public/uploads/project_file/" + data[Number(project_file)].trim())) {
            fs.unlinkSync("./public/uploads/project_file/" + data[Number(project_file)].trim());
            console.log("삭제");
        } else {
            console.log("노삭제");
        }
        //삭제한 파일 배열에서 삭제하고 다시 디비에 저장
        data.splice(Number(project_file), 1);

        data = JSON.stringify(data);

        if (type === "api") {
            const updateProjectFileResult = await ProjectFile.update(
                { api: data },
                {
                    where: { projectId: id },
                }
            );
        } else if (type === "erd") {
            const updateProjectFileResult = await ProjectFile.update(
                { erd: data },
                {
                    where: { projectId: id },
                }
            );
        } else if (type === "plan") {
            const updateProjectFileResult = await ProjectFile.update(
                { plan: data },
                {
                    where: { projectId: id },
                }
            );
        }
        res.json({ success: true, result: "성공" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, result: error });
    }
};

async function deleteImg(projectId) {
    try {
        const getProjectInfotResult = await Project.findOne({
            where: { id: projectId },
        });
        if (fs.existsSync("./public/uploads/project/" + getProjectInfotResult.project_img)) {
            // 파일이 존재한다면 true 그렇지 않은 경우 false 반환
            fs.unlinkSync("./public/uploads/project/" + getProjectInfotResult.project_img);
        }
    } catch (error) {
        console.log(error);
    }
}

//내 모든 작업 조회

//
