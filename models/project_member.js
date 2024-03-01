const { DataTypes } = require("sequelize");

const ProjectMemberModel = (sequelize) => {
    return sequelize.define("project_member", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "projects", // 참조할 모델명
                key: "id", // 참조할 모델의 기본 키
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users", // 참조할 모델명
                key: "id", // 참조할 모델의 기본 키
            },
        },
    });
};

module.exports = ProjectMemberModel;
