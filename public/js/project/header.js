(async function loadProjectInfo() {
    const projectId = localStorage.getItem("projectId");
    const token = localStorage.getItem("token");
    const project_name = localStorage.getItem("projectName");
    const projectStatus = localStorage.getItem("projectStatus");
    console.log(`Project ID: ${projectId}, Project Name: ${project_name}`);

    try {
        const response = await axios({
            method: "POST",
            url: "/api/project/get/info",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                project_id: projectId,
            },
        });
        const { success, result } = response.data;
        console.log(response);
        // 프로젝트 정보를 화면에 표시
        document.querySelector(".pro_name").value = project_name;
        document.querySelector(".pro_status").value = projectStatus;
        if (success) {
            console.log(response);
        }
    } catch (error) {
        console.error(error);
    }
})();
