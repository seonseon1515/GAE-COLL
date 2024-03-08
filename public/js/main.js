const statusDiv = document.querySelectorAll(".main_status_txt");
let myjobdataByDate = [];
let myteamLogData = [];

for (let i = 0; i < statusDiv.length; i++) {
    statusDiv[i].addEventListener("click", click);
}
function click(e) {
    for (let i = 0; i < statusDiv.length; i++) {
        statusDiv[i].classList.remove("selected");
    }
    this.classList.add("selected");
    getProjectStatusJob(this.textContent);
}
function getProjectStatusJob(selectedProjectStatus) {
    let projectstatus = "";
    const myJobTable = document.querySelector("#my-job-tbody");
    myJobTable.innerHTML = "";

    switch (selectedProjectStatus) {
        case "계획 중":
            projectstatus = "planning";
            break;
        case "진행 중":
            projectstatus = "progress";
            break;
        case "피드백 요청":
            projectstatus = "needFeedback";
            break;
        case "피드백 완료":
            projectstatus = "finishFeedback";
            break;
        case "중단됨":
            projectstatus = "suspend";
            break;
        case "완료":
            projectstatus = "finish";
            break;
    }
    for (let i = 0; i < myjobdataByDate.length; i++) {
        if (myjobdataByDate[i].projectStatus === projectstatus) {
            const tr = document.createElement("tr");
            tr.addEventListener("click", function () {
                goJobDeatil(myjobdataByDate[i].projectId, myjobdataByDate[i].boardId);
            });
            tr.innerHTML = `
                        <td>
                            ${myjobdataByDate[i].title}
                        </td>
                        <td>
                            ${myjobdataByDate[i].deadline}
                        </td>
                        <td>
                            ${myjobdataByDate[i].projectName}
                        </td>
                `;
            myJobTable.appendChild(tr);
            if (myJobTable.childNodes.length === 5) {
                break;
            }
        }
    }
    if (myjobdataByDate.length < 5) {
        document.querySelector("#more-table").classList.add("hidden");
    }
}
function goJobDeatil(projectId, boardId) {
    console.log(projectId, boardId);
    goBoardContentPage(projectId, boardId);
}

(async function () {
    const token = localStorage.getItem("token");
    try {
        //내 프로젝트(이름, 깃헙, 블로그) 가져오기
        const getMyProjectResult = await axios({
            method: "post",
            url: "/api/project/mine",
            headers: { Authorization: `Bearer ${token}` },
        });

        const { success, result } = getMyProjectResult.data;

        if (success) {
            result.user_name === ""
                ? (document.getElementById("username").textContent = "")
                : (document.getElementById("username").textContent = `${result.user_name}님`);
            //깃헙링크 보여주기
            result.github === null || result.github === ""
                ? (document.getElementById("github").href = "/mypage")
                : (document.getElementById("github").href = result.github);
            // 블로그 링크 보여주기
            result.blog === null || result.blog === ""
                ? (document.getElementById("blog").placeholder = "/blog")
                : (document.getElementById("blog").href = result.blog);

            for (i = 0; i < result.projectResult.length; i++) {
                const html = document.createElement("div");
                const location = "home";
                html.innerHTML = `
                <div class="main_myproject_profile">
                    <button onclick='goProjectPage(${result.projectResult[i][0]},"home")'>
                    <div class="main_myproject_show"><img class=${result.projectResult[i][3]} /></div>
                    <div class="txt_place">
                        <div class="main_myproject_name">${result.projectResult[i][1]}</div>
                        <div class="main_myproject_stat">${result.projectResult[i][2]}</div>
                    </div>
                    </button>
                </div>
            `;
                document.querySelector(".profiles").appendChild(html);
            }
        }
        //내작업 가져오기
        const getMyJobResultResult = await axios({
            method: "POST",
            url: "/api/project/board/mine",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const { success: getMyJobSuccess, result: getMyJobResult } = getMyJobResultResult.data;
        let myjobdata = [];
        if (getMyJobSuccess) {
            for (let i = 0; i < getMyJobResult.length; i++) {
                for (let j = 0; j < getMyJobResult[i].board.length; j++) {
                    const data = {
                        boardId: getMyJobResult[i].board[j].id,
                        title: getMyJobResult[i].board[j].title,
                        projectStatus: getMyJobResult[i].board[j].status,
                        deadline: getMyJobResult[i].board[j].deadline,
                        projectId: getMyJobResult[i].projectId,
                        projectName: getMyJobResult[i].projectName,
                    };
                    myjobdata.push(data);
                }
            }
            //planning인거 deadline별로 넣기 최신부터 보여줌
            myjobdataByDate = myjobdata.sort((a, b) => {
                if (a.deadline > b.deadline) return -1;
                if (a.deadline < b.deadline) return 1;
                return 0;
            });
            getProjectStatusJob("계획 중");
        }
        //팀활동 가져오기
        const getTeamLogResult = await axios({
            method: "POST",
            url: "/api/project/teamboard",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (getTeamLogResult.data.success) {
            myteamLogData = getTeamLogResult.data.result.sort((a, b) => {
                if (a.updatedAt > b.updatedAt) return -1;
                if (a.updatedAt < b.updatedAt) return 1;
                return 0;
            });
            console.log(myteamLogData);
            const teamBoardTbody = document.querySelector("#team_board-tbody");
            for (let i = 0; teamBoardTbody.childNodes.length < 5; i++) {
                const tr = document.createElement("tr");
                tr.addEventListener("click", function () {
                    goProjectPage(myteamLogData[i].projectId, "board_main");
                });
                tr.innerHTML = `
                        <td class = "teamTd">
                            <img src = "./public/uploads/project/${myteamLogData[i].project_img}" />
                            
                            ${myteamLogData[i].project_name}
                        </td>
                        <td class = "teamLogTd">
                            ${myteamLogData[i].user_name}님 작업 : 
                            ${myteamLogData[i].title}
                        </td>
                `;
                teamBoardTbody.appendChild(tr);
            }
        }
    } catch (error) {
        console.log(error);
    }
})();

//프로젝트나 팀 로그 누르면  해당프로젝트 홈으로 이동
async function goProjectPage(projectId, location) {
    console.log(projectId, location);
    const token = localStorage.getItem("token");

    try {
        const updateTokenResult = await axios({
            method: "POST",
            url: "/api/project/update/token",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                projectId,
            },
        });
        const { success, token: newToken } = updateTokenResult.data;
        if (success) {
            localStorage.setItem("token", newToken);
            document.location.href = `/project/${location}`;
        }
    } catch (error) {
        console.log(error);
    }
}
//프로젝트누르면 해당프로젝트 보드 상세페이지로
async function goBoardContentPage(projectId, boardId) {
    const token = localStorage.getItem("token");

    try {
        const updateTokenResult = await axios({
            method: "POST",
            url: "/api/project/update/token",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                projectId,
            },
        });
        const { success, token: newToken } = updateTokenResult.data;
        if (success) {
            localStorage.setItem("token", newToken);
            document.location.href = `project/board_content/${boardId}`;
        }
    } catch (error) {
        console.log(error);
    }
}

//내작업에서 더보기 누르면 5개 더 보여주기
function showMoreJob() {
    console.log("hihi");
    const tbody = document.querySelector("#my-job-tbody");
    const before = document.querySelector("#my-job-tbody").childNodes.length;
    const selectedProjectStatus = document.querySelector(".selected").textContent;
    let projectstatus = "";

    switch (selectedProjectStatus) {
        case "계획 중":
            projectstatus = "planning";
            break;
        case "진행 중":
            projectstatus = "progress";
            break;
        case "피드백 요청":
            projectstatus = "needFeedback";
            break;
        case "피드백 완료":
            projectstatus = "finishFeedback";
            break;
        case "중단됨":
            projectstatus = "suspend";
            break;
        case "완료":
            projectstatus = "finish";
            break;
    }
    console.log(projectstatus);
    if (myjobdataByDate.length > tbody.childNodes.length) {
        for (let i = tbody.childNodes.length; i < myjobdataByDate.length; i++) {
            if (myjobdataByDate[i].projectStatus === projectstatus) {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                <td>
                    ${myjobdataByDate[i].title}
                </td>
                <td>
                    ${myjobdataByDate[i].deadline}
                </td>
                <td>
                    ${myjobdataByDate[i].projectName}
                </td>
                `;
                tbody.appendChild(tr);
                if (tbody.childNodes.length - before === 5) {
                    break;
                }
            }
        }
    }
    if (tbody.childNodes.length === myjobdataByDate.length) {
        document.querySelector("#more-table").classList.add("hidden");
    }
}
