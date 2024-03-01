const { Project, ProjectFile, Board, ProjectMemeber } = require('../models');

//프로젝트 생성
exports.createProject = async (req, res) => {
    const { project_name, start_date, end_date, project_img, overview, rule, member_id } = req.body;
    try {
        const result = [];

        //프로젝트 멤버DB에 추가
        const createProjectResult = await Project.create({
            project_name,
            start_date,
            end_date,
            project_img,
            overview,
            rule,
        });
        console.log('createProjectResult', createProjectResult.id);

        //프로젝트 멤버DB에 추가
        for (let i = 0; i < member_id.length; i++) {
            const addProjectMemberResult = await ProjectMemeber.create({
                projectId: Number(createProjectResult.id),
                userId: Number(member_id[i]),
            });
            //실패시 처리해야할 내용
            //console.log('addProjectMemberResult', addProjectMemberResult);
            //result.push(addProjectMemberResult);
        }
        //프로젝트 파일DB에 추가
        const createProjectFileResult = await ProjectMemeber.create({
            projectId: Number(createProjectResult.id),
        });
        res.json({ createProjectResult, result, createProjectFileResult });
    } catch (error) {
        res.json("실패!", error);
    }
};
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
        res.json("실패!", error);
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
        res.json("실패!", error);
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
        res.json("실패!", error);
    }
};
