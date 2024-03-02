const { Project, ProjectFile, Board, ProjectMember } = require("../models");
//프로젝트 생성
exports.createProject = async (req, res) => {
    const file = req.file;

    const { project_name, start_date, end_date, overview, rule, member_id } = req.body;
    let userId;

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

        //프로젝트 멤버DB에 추가
        for (let i = 0; i < userId.length; i++) {
            console.log(userId, userId.length);
            const addProjectMemberResult = await ProjectMember.create({
                projectId: Number(createProjectResult.id),
                userId: Number(userId[i]),
            });

            result.push(addProjectMemberResult);
        }
        res.json({ createProjectResult, result });
    } catch (error) {
        res.json("실패!", error);
    }
};

//내 보드 조회
exports.getMyBoard = async (req, res) => {};

//내 프로젝트 조회
exports.getMyProject = async (req, res) => {};
//프로젝트 정보 조회
exports.getProjectInfo = async (req, res) => {
    const { project_id: id } = req.body;
    try {
        const getProjectInfotResult = await Project.findOne({
            where: { id },
        });
        res.json(getProjectInfotResult);
    } catch (error) {
        res.json(error);
    }
};
//프로젝트 파일 조회
exports.getProjectFile = async (req, res) => {
    const { project_id: id } = req.body;
    try {
        const getProjectFileResult = await ProjectFile.findOne({
            where: { id },
        });
        res.json(getProjectFileResult);
    } catch (error) {
        res.json(error);
    }
};
//프로젝트 로그 조회
exports.projectLog = async (req, res) => {
    const { project_id: id } = req.body;
    try {
        const getBoardLogResult = await Board.findOne({
            where: { id },
        });
        res.json(getBoardLogResult);
    } catch (error) {
        res.json(error);
    }
};

//프로젝트 이름 수정
exports.updateProjectName = async (req, res) => {
    const { project_id: id, project_name } = req.body;
    try {
        const updateProjectResult = await Project.update({ project_name }, { where: { id } });
        res.json(updateProjectResult);
    } catch (error) {
        res.json(error);
    }
};
//프로젝트 이미지 수정
exports.updateProjectImg = async (req, res) => {
    //이전에 올렸던 이미지 삭제?
    const file = req.file;
    const { project_id: id } = req.body;
    try {
        const updateProjectResult = await Project.update({ project_img: file.filename }, { where: { id } });
        res.json(updateProjectResult);
    } catch (error) {
        res.json(error);
    }
};
//프로젝트 상태 수정
exports.updateProjectStatus = async (req, res) => {
    const { project_id: id, status } = req.body;
    try {
        const updateProjectResult = await Project.update({ status }, { where: { id } });
        res.json(updateProjectResult);
    } catch (error) {
        res.json(error);
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
        res.json(updateProjectResult);
    } catch (error) {
        res.json(error);
    }
};
//프로젝트 overview 수정
exports.updateProjectOverview = async (req, res) => {
    const { project_id: id, overview } = req.body;
    try {
        const updateProjectResult = await Project.update({ overview }, { where: { id } });
        res.json(updateProjectResult);
    } catch (error) {
        res.json(error);
    }
};
//프로젝트 규칙 수정
exports.updateProjectRule = async (req, res) => {
    const { project_id: id, rule } = req.body;
    console.log(req.body);
    try {
        const updateProjectResult = await Project.update({ rule: JSON.stringify(rule) }, { where: { id } });
        res.json(updateProjectResult);
    } catch (error) {
        res.json(error);
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
        res.json({ createProjectResult, result });
    } catch (error) {
        res.json(error);
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
        res.json(addProjectMemberResult);
    } catch (error) {
        res.json(error);
    }
};
// exports.updateProjectFile = async (req, res) => {
//     const files = req.files;
//     const { project_id: id, plan, erd, api } = req.body;
//     let fileName = [];
//     try {
//         if (files !== undefined) {
//             for (let i = 0; i < files.length; i++) {
//                 fileName.push(files[i].filename);
//             }
//         }
//         //JSON.stringify(fileName)

//         // const updateProjectResult = await ProjectFile.update({ erd, plan, api }, { where: { id } });
//         // res.json(updateProjectResult);
//     } catch (error) {
//         res.json(error);
//     }
// };

//프로젝트 깃허브 수정
exports.updateProjectGithub = async (req, res) => {
    const { project_id: id, github } = req.body;
    try {
        const updateProjectResult = await Project.update({ github }, { where: { id } });
        res.json(updateProjectResult);
    } catch (error) {
        res.json(error);
    }
};
