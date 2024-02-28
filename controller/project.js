const { Project, ProjectFile, Board } = require('../models');
//프로젝트 생성
exports.createProject = async (req, res) => {
    const { project_name, start_date, end_date, project_img, overview, rule, member_id } = req.body;
    try {
        const createProjectResult = await Project.create({
            project_name,
            start_date,
            end_date,
            project_img,
            overview,
            rule,
            member_id,
        });
        res.json(createProjectResult);
    } catch (error) {
        res.json('실패!', error);
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
        res.json('실패!', error);
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
        res.json('실패!', error);
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
        res.json('실패!', error);
    }
};
